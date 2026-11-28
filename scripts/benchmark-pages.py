#!/usr/bin/env python3
"""Read-only, allowlisted HTTP page measurements using only the Python stdlib."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import http.client
import json
import math
import os
from pathlib import Path
import re
import socket
import subprocess
import time
from urllib.parse import quote, quote_plus, urlsplit


# Conservative on purpose: a manifest is permission to fetch a page, not an action.
ACTION_SEGMENT = re.compile(
    r"(?:^|[-_.])(?:api|apis|logout|logoff|signout|sign-out|signoff|delete|remove|destroy|"
    r"revoke|unsubscribe|deactivate|terminate|callback|token|reset-password|verify-email)(?:$|[-_.])", re.IGNORECASE
)


def validate_base_url(value, allow_remote=False):
    """Accept an HTTP origin only; remote origins require a deliberate opt-in."""
    if not isinstance(value, str) or any(c.isspace() or ord(c) < 32 for c in value) or "\\" in value:
        raise ValueError("base URL must be an HTTP(S) origin")
    try:
        parsed = urlsplit(value)
        port = parsed.port
    except ValueError:
        raise ValueError("base URL has an invalid host or port") from None
    if (parsed.scheme not in ("http", "https") or not parsed.hostname
            or parsed.username is not None or parsed.password is not None
            or parsed.path not in ("", "/") or "?" in value or "#" in value
            or (port is not None and not 1 <= port <= 65535)):
        raise ValueError("base URL must contain only scheme, host, and optional port")
    host = parsed.hostname.lower()
    if not re.fullmatch(r"[a-z0-9.-]+", host) and ":" not in host:
        raise ValueError("invalid base URL host")
    local = host in ("localhost", "127.0.0.1") or host.endswith(".localhost")
    if not local and not allow_remote:
        raise ValueError("remote targets require explicit --allow-remote authorization")
    return value.rstrip("/")


def validate_route(route):
    """Only literal origin-relative page paths; no encodings, queries or actions."""
    if (not isinstance(route, str) or not route.startswith("/")
            or "//" in route or any(c in route for c in "?#%\\;:")
            or any(c.isspace() or ord(c) < 32 or ord(c) == 127 for c in route)
            or not route.isascii()):
        raise ValueError("manifest routes must be literal ASCII page paths without queries or encodings")
    segments = route.split("/")
    if any(segment in (".", "..") or ACTION_SEGMENT.search(segment) for segment in segments):
        raise ValueError("manifest contains an API, action, or traversal path")
    return route


def validate_routes(routes):
    if not isinstance(routes, list) or not routes:
        raise ValueError("manifest must contain a nonempty routes array")
    checked = []
    paths = []
    for entry in routes:
        if isinstance(entry, dict):
            if "path" not in entry or set(entry) - {"path", "label", "local_only"}:
                raise ValueError("route objects support only path, optional label, and local_only")
            path = validate_route(entry["path"])
            label = entry.get("label", "")
            if not isinstance(label, str) or len(label) > 300 or any(ord(c) < 32 for c in label):
                raise ValueError("route labels must be short printable strings")
            local_only = entry.get("local_only", False)
            if type(local_only) is not bool:
                raise ValueError("local_only must be a boolean")
            checked.append({"path": path, "label": label, "local_only": local_only})
        else:
            path = validate_route(entry)
            checked.append(path)
        paths.append(path)
    if len(set(paths)) != len(paths):
        raise ValueError("manifest routes must be unique")
    return checked



def validate_target_routes(base_url, entries):
    host = urlsplit(base_url).hostname
    local = host in ("localhost", "127.0.0.1") or host.endswith(".localhost")
    if not local and any(isinstance(entry, dict) and entry.get("local_only") for entry in entries):
        raise ValueError("remove local_only fixture routes before a remote comparison")


def load_routes(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8-sig"))
    except (OSError, ValueError):
        raise ValueError("cannot read a valid JSON route manifest") from None
    return validate_routes(data.get("routes") if isinstance(data, dict) else data)


def validate_settings(concurrency, repeats, timeout):
    if type(concurrency) is not int or not 1 <= concurrency <= 8:
        raise ValueError("concurrency must be an integer from 1 to 8")
    if type(repeats) is not int or repeats < 1:
        raise ValueError("repeats must be a positive integer")
    if not isinstance(timeout, (float, int)) or not math.isfinite(timeout) or timeout <= 0:
        raise ValueError("timeout must be a finite positive number of seconds")


def source_git_commit():
    try:
        result = subprocess.run(
            ["git", "-C", str(Path(__file__).resolve().parent.parent), "rev-parse", "HEAD"],
            capture_output=True, text=True, timeout=5, check=False,
        )
        commit = result.stdout.strip()
        return commit if result.returncode == 0 and re.fullmatch(r"[0-9a-f]{40,64}", commit) else None
    except (OSError, subprocess.SubprocessError):
        return None


def redact(value, cookie):
    """Protect cookie contents even if a server reflects them in Location."""
    if not cookie:
        return value
    secrets = {cookie}
    secrets.update(part.partition("=")[2].strip() for part in cookie.split(";") if "=" in part)
    secrets.discard("")
    tokens = sorted({encoded for secret in secrets for encoded in
                     (secret, quote(secret, safe=""), quote_plus(secret, safe=""))}, key=len, reverse=True)

    def clean(item):
        if isinstance(item, str):
            for token in tokens:
                item = item.replace(token, "[REDACTED]")
            return item
        if isinstance(item, list):
            return [clean(entry) for entry in item]
        if isinstance(item, dict):
            return {clean(key): clean(entry) for key, entry in item.items()}
        return item

    return clean(value)


def measure(base_url, route, repeat, timeout, cookie):
    parsed = urlsplit(base_url)
    connection_type = http.client.HTTPSConnection if parsed.scheme == "https" else http.client.HTTPConnection
    connection = connection_type(parsed.hostname, parsed.port, timeout=timeout)
    # Pin the documented local hostnames to loopback; DNS/proxy configuration must
    # not silently turn a local benchmark into remote traffic. Host/SNI stay intact.
    if parsed.hostname == "localhost" or parsed.hostname.endswith(".localhost"):
        connection._create_connection = lambda address, timeout, source_address=None: socket.create_connection(
            ("127.0.0.1", address[1]), timeout, source_address
        )
    sample = {"route": route, "repeat": repeat, "status": None, "redirect_location": None,
              "ttfb_ms": None, "total_ms": None, "bytes": 0, "error": None,
              "content_type": None, "content_length": None, "http_version": None}
    headers = {"User-Agent": "monkeys-page-benchmark/1", "Accept": "text/html", "Accept-Encoding": "identity"}
    if cookie:
        headers["Cookie"] = cookie
    response = None
    started = time.perf_counter()
    try:
        connection.request("GET", route, headers=headers)
        active_socket = connection.sock
        remaining = timeout - (time.perf_counter() - started)
        if remaining <= 0:
            raise TimeoutError()
        active_socket.settimeout(remaining)
        response = connection.getresponse()
        # TTFB proxy: time until response headers are available to http.client.
        sample["ttfb_ms"] = (time.perf_counter() - started) * 1000
        sample["status"] = response.status
        sample["content_type"] = response.getheader("Content-Type")
        sample["content_length"] = response.getheader("Content-Length")
        sample["http_version"] = {10: "HTTP/1.0", 11: "HTTP/1.1"}.get(response.version, str(response.version))
        sample["redirect_location"] = response.getheader("Location")
        if not 200 <= response.status < 300:
            sample["error"] = "http_status"
        while True:
            remaining = timeout - (time.perf_counter() - started)
            if remaining <= 0:
                raise TimeoutError()
            # read1 avoids a full-buffer read hiding a continuously trickling body.
            active_socket.settimeout(remaining)
            chunk = response.read1(65536)
            sample["bytes"] += len(chunk)
            if not chunk:
                if response.length not in (None, 0):
                    raise http.client.IncompleteRead(b"")
                break
    except (OSError, http.client.HTTPException, ValueError) as exc:
        # Exception text can contain server-controlled data or credentials.
        sample["error"] = type(exc).__name__
    finally:
        sample["total_ms"] = (time.perf_counter() - started) * 1000
        if response is not None:
            response.close()
        connection.close()
    return sample


def distribution(values, missing=0):
    ordered = sorted(values)
    return {"p50": ordered[math.ceil(len(ordered) * 0.5) - 1] if ordered else None,
            "p95": ordered[math.ceil(len(ordered) * 0.95) - 1] if ordered else None,
            "count": len(ordered), "missing": missing}


def summarize(routes, samples):
    summaries = {}
    for route in routes:
        rows = [row for row in samples if row["route"] == route]
        statuses = {}
        for row in rows:
            status = str(row["status"]) if row["status"] is not None else "no_response"
            statuses[status] = statuses.get(status, 0) + 1
        ttfb = [row["ttfb_ms"] for row in rows if row["ttfb_ms"] is not None]
        summaries[route] = {
            "count": len(rows), "bytes": sum(row["bytes"] for row in rows),
            "errors": sum(bool(row["error"]) or row["status"] is None or not 200 <= row["status"] < 300 for row in rows),
            "redirects": sum(row["status"] is not None and 300 <= row["status"] < 400 for row in rows),
            "status_counts": statuses,
            "total_ms": distribution([row["total_ms"] for row in rows]),
            "ttfb_ms": distribution(ttfb, missing=len(rows) - len(ttfb)),
        }
    return summaries


def run_benchmark(base_url, routes, *, concurrency=1, repeats=5, timeout=20.0, warmup=False, allow_remote=False):
    base_url = validate_base_url(base_url, allow_remote)
    entries = validate_routes(routes)
    validate_target_routes(base_url, entries)
    routes = [entry["path"] if isinstance(entry, dict) else entry for entry in entries]
    labels = {entry["path"]: entry["label"] for entry in entries if isinstance(entry, dict)}
    validate_settings(concurrency, repeats, timeout)
    cookie = os.environ.get("MONKEYS_BENCH_COOKIE", "")
    if any(ord(c) < 32 or ord(c) > 126 for c in cookie):
        raise ValueError("MONKEYS_BENCH_COOKIE must contain printable ASCII only")
    report = {
        "schema_version": 1,
        "timestamp_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source_git_commit": source_git_commit(),
        "base_url": base_url, "routes": routes, "route_labels": labels,
        "local_only_routes": [entry["path"] for entry in entries if isinstance(entry, dict) and entry["local_only"]],
        "config": {"concurrency": concurrency, "repeats": repeats, "timeout_seconds": float(timeout), "warmup": bool(warmup)},
    }
    warmup_samples = [measure(base_url, route, 1, timeout, cookie) for route in routes] if warmup else []
    report["warmup"] = {"request_count": len(warmup_samples), "samples": warmup_samples, "summaries": summarize(routes, warmup_samples)}
    # At most `concurrency` outstanding futures, not one future per requested sample.
    # Each repeat visits every route before the next repeat; warmups finish first.
    jobs = iter((route, repeat) for repeat in range(1, repeats + 1) for route in routes)
    samples = []
    with ThreadPoolExecutor(max_workers=concurrency) as executor:
        pending = []
        for _ in range(concurrency):
            job = next(jobs, None)
            if job is not None:
                pending.append(executor.submit(measure, base_url, *job, timeout, cookie))
        while pending:
            samples.append(pending.pop(0).result())
            job = next(jobs, None)
            if job is not None:
                pending.append(executor.submit(measure, base_url, *job, timeout, cookie))
    report["measured_request_count"] = len(samples)
    report["samples"] = samples
    report["summaries"] = summarize(routes, samples)
    return redact(report, cookie)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:3001")
    parser.add_argument("--manifest", required=True, help='JSON array or {"routes": ["/", "/about"]}')
    parser.add_argument("--allow-remote", action="store_true", help="explicitly authorize a remote target for later comparison")
    parser.add_argument("--concurrency", type=int, default=1, help="simultaneous requests, 1 through 8 (default: 1)")
    parser.add_argument("--repeats", type=int, default=5)
    parser.add_argument("--timeout", type=float, default=20.0, help="request timeout in seconds (default: 20)")
    parser.add_argument("--warmup", action="store_true", help="one sequential warmup per route, reported separately")
    parser.add_argument("--output", type=Path, required=True, help="save JSON report to this new file (never overwrite)")
    args = parser.parse_args(argv)
    try:
        # Reserve the output before sending requests; avoid losing a run to a bad
        # output path or accidentally replacing a saved baseline/manifest/source.
        base_url = validate_base_url(args.base_url, args.allow_remote)
        routes = load_routes(args.manifest)
        validate_target_routes(base_url, routes)
        validate_settings(args.concurrency, args.repeats, args.timeout)
        cookie = os.environ.get("MONKEYS_BENCH_COOKIE", "")
        if any(ord(c) < 32 or ord(c) > 126 for c in cookie):
            raise ValueError("MONKEYS_BENCH_COOKIE must contain printable ASCII only")
        with args.output.open("x", encoding="utf-8") as output:
            report = run_benchmark(base_url, routes, concurrency=args.concurrency, repeats=args.repeats,
                                   timeout=args.timeout, warmup=args.warmup, allow_remote=args.allow_remote)
            json.dump(report, output, indent=2, allow_nan=False)
            output.write("\n")
    except (ValueError, OSError):
        # Deliberately generic: paths, route contents and errors may contain secrets.
        parser.exit(2, "Invalid benchmark settings, manifest, cookie, or output path; use --help.\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
