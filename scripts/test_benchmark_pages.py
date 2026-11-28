"""Focused stdlib tests; all HTTP traffic uses a disposable loopback fixture."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("benchmark-pages.py")
BENCH = None


class FixtureHandler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        with self.server.lock:
            self.server.requests.append((self.command, self.path, self.headers.get("Cookie")))
            self.server.active += 1
            self.server.peak = max(self.server.peak, self.server.active)
        try:
            if self.path == "/slow":
                time.sleep(0.04)
            if self.path == "/header-and-body-delay":
                time.sleep(0.08)
            if self.path == "/timeout":
                time.sleep(0.2)
            status = 503 if self.path == "/failure" else 200
            body = b"BODY_MUST_NEVER_BE_SAVED"
            if self.path in ("/redirect", "/external", "/echo-cookie"):
                status = 302
            self.send_response(status)
            if self.path == "/redirect":
                self.send_header("Location", "/target")
            if self.path == "/external":
                self.send_header("Location", "http://example.com/target")
            if self.path == "/echo-cookie":
                self.send_header("Location", "/target?value=" + self.headers.get("Cookie", ""))
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body) + (10 if self.path == "/broken" else 0)))
            self.end_headers()
            if self.path == "/delayed-body":
                time.sleep(0.06)
            if self.path == "/header-and-body-delay":
                time.sleep(0.12)
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass
        finally:
            with self.server.lock:
                self.server.active -= 1


class BenchmarkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        global BENCH
        spec = importlib.util.spec_from_file_location("benchmark_pages", SCRIPT)
        BENCH = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(BENCH)

    def setUp(self):
        self.cookie_env = patch.dict(os.environ, {"MONKEYS_BENCH_COOKIE": ""})
        self.cookie_env.start()
        self.addCleanup(self.cookie_env.stop)
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), FixtureHandler)
        self.server.requests = []
        self.server.lock = threading.Lock()
        self.server.active = self.server.peak = 0
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base = "http://127.0.0.1:%d" % self.server.server_port
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.server.shutdown)

    def invoke(self, routes, *extra, cookie=None):
        manifest = Path(self.temp.name) / "routes.json"
        output = Path(self.temp.name) / "result.json"
        manifest.write_text(json.dumps({"routes": routes}), encoding="utf-8")
        env = os.environ.copy()
        env.pop("MONKEYS_BENCH_COOKIE", None)
        env["PYTHONDONTWRITEBYTECODE"] = "1"
        if cookie is not None:
            env["MONKEYS_BENCH_COOKIE"] = cookie
        completed = subprocess.run(
            [sys.executable, "-B", str(SCRIPT), "--base-url", self.base,
             "--manifest", str(manifest), "--output", str(output), *extra],
            env=env, capture_output=True, text=True, timeout=15,
        )
        report = json.loads(output.read_text(encoding="utf-8")) if output.exists() else None
        return completed, report

    def test_default_settings_and_saved_metadata(self):
        completed, report = self.invoke(["/"])
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(len(self.server.requests), 5)
        self.assertEqual(report["routes"], ["/"])
        self.assertEqual(report["config"], {"concurrency": 1, "repeats": 5, "timeout_seconds": 20.0, "warmup": False})
        self.assertTrue(report["timestamp_utc"].endswith("Z"))
        self.assertIn("source_git_commit", report)
        if report["source_git_commit"] is not None:
            self.assertRegex(report["source_git_commit"], r"^[0-9a-f]{40,64}$")
        self.assertEqual(report["base_url"], self.base)
        self.assertEqual(report["warmup"]["samples"], [])
        self.assertEqual(report["summaries"]["/"]["count"], 5)
        self.assertEqual(report["summaries"]["/"]["errors"], 0)
        sample = report["samples"][0]
        self.assertEqual(sample["status"], 200)
        self.assertEqual(sample["bytes"], 24)
        self.assertGreaterEqual(sample["total_ms"], sample["ttfb_ms"])
        self.assertNotIn("BODY_MUST_NEVER_BE_SAVED", json.dumps(report))

    def test_local_only_and_strict_base_urls(self):
        for url in ("http://localhost:3001", "http://app.localhost:3001/", "http://127.0.0.1:3001"):
            with self.subTest(url=url):
                BENCH.validate_base_url(url)
        for url in ("https://example.com", "http://127.1", "http://localhost.evil.test", "http://0.0.0.0"):
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    BENCH.validate_base_url(url)
        self.assertEqual(BENCH.validate_base_url("https://example.com/", allow_remote=True), "https://example.com")
        for url in ("file:///tmp/a", "http://user:secret@localhost", "http://localhost/api", "http://localhost/?action=x", "http://localhost/#x", "http://localhost:99999", "http://localhost\\@example.com"):
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    BENCH.validate_base_url(url, allow_remote=True)

    def test_allowlist_rejects_actions_urls_and_ambiguous_paths(self):
        for route in ("/", "/about", "/blog/representative-slug", "/profile/alice"):
            self.assertEqual(BENCH.validate_route(route), route)
        for route in ("https://evil.test/", "//evil.test/", "about", "C:/page", "/?action=delete", "/a#b", "/api", "/API/posts", "/logout", "/auth/sign-out", "/blog/delete", "/blog/delete-post", "/blog/remove", "/a/../api", "/%61pi/posts", "/%2561pi", "/a%2fb", "/a\\b", "/a;b", "/a\nb", "/a//b", "/a/./b", "/a?", "/a#", "/auth/google/callback", "/auth/token", "/reset-password/abc"):
            with self.subTest(route=route):
                with self.assertRaises(ValueError):
                    BENCH.validate_route(route)

    def test_manifest_is_required_nonempty_unique_and_fully_validated(self):
        for data in ([], {}, {"routes": []}, {"routes": ["/", "/"]}, {"routes": ["/", "/api/users"]}, {"routes": [1]}, {"routes": "/"}):
            with self.subTest(data=data):
                manifest = Path(self.temp.name) / "invalid.json"
                manifest.write_text(json.dumps(data), encoding="utf-8")
                with self.assertRaises(ValueError):
                    BENCH.load_routes(manifest)
        completed, report = self.invoke(["/", "/logout"])
        self.assertNotEqual(completed.returncode, 0)
        self.assertIsNone(report)
        self.assertEqual(self.server.requests, [])

    def test_warmup_is_once_per_route_and_excluded_from_measured_samples(self):
        completed, report = self.invoke(["/", "/about"], "--warmup", "--repeats", "2", "--concurrency", "2")
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(len(self.server.requests), 6)
        self.assertEqual([row[1] for row in self.server.requests[:2]], ["/", "/about"])
        self.assertEqual(len(report["warmup"]["samples"]), 2)
        self.assertEqual(len(report["samples"]), 4)
        self.assertEqual(report["summaries"]["/"]["count"], 2)
        self.assertEqual(report["warmup"]["summaries"]["/"]["count"], 1)

    def test_concurrency_is_bounded_and_covers_every_repeat(self):
        report = BENCH.run_benchmark(self.base, ["/slow"], concurrency=3, repeats=9, timeout=2)
        self.assertEqual(len(report["samples"]), 9)
        self.assertGreater(self.server.peak, 1)
        self.assertLessEqual(self.server.peak, 3)
        self.assertEqual(sorted(s["repeat"] for s in report["samples"]), list(range(1, 10)))

    def test_cli_and_library_reject_invalid_limits_before_http(self):
        for args in (("--concurrency", "9"), ("--concurrency", "0"), ("--repeats", "0"), ("--timeout", "0"), ("--timeout", "nan"), ("--timeout", "inf")):
            completed, report = self.invoke(["/"], *args)
            self.assertNotEqual(completed.returncode, 0)
            self.assertIsNone(report)
        for kwargs in ({"concurrency": 9}, {"concurrency": 0}, {"repeats": 0}, {"timeout": float("nan")}, {"timeout": -1}):
            with self.assertRaises(ValueError):
                BENCH.run_benchmark(self.base, ["/"], **kwargs)
        self.assertEqual(self.server.requests, [])

    def test_redirects_never_follow_and_cookie_never_serializes(self):
        secret = "session=VERY_SECRET_VALUE"
        completed, report = self.invoke(["/redirect", "/external", "/echo-cookie"], "--repeats", "1", cookie=secret)
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(len(self.server.requests), 3)
        self.assertTrue(all(row[0] == "GET" and row[2] == secret for row in self.server.requests))
        samples = {s["route"]: s for s in report["samples"]}
        self.assertEqual(samples["/redirect"]["redirect_location"], "/target")
        self.assertEqual(samples["/external"]["redirect_location"], "http://example.com/target")
        self.assertEqual(report["summaries"]["/redirect"]["redirects"], 1)
        serialized = json.dumps(report) + completed.stdout + completed.stderr
        self.assertNotIn(secret, serialized)
        self.assertNotIn("VERY_SECRET_VALUE", serialized)

    def test_http_errors_timeouts_and_partial_bodies_are_preserved(self):
        report = BENCH.run_benchmark(self.base, ["/failure", "/timeout", "/broken"], repeats=1, timeout=0.05)
        self.assertEqual(len(report["samples"]), 3)
        samples = {s["route"]: s for s in report["samples"]}
        self.assertEqual(samples["/failure"]["status"], 503)
        self.assertIsNone(samples["/timeout"]["status"])
        self.assertEqual(samples["/broken"]["status"], 200)
        self.assertEqual(samples["/broken"]["bytes"], 24)
        for route in report["routes"]:
            self.assertEqual(report["summaries"][route]["errors"], 1)
            self.assertEqual(report["summaries"][route]["count"], 1)
            self.assertIsNotNone(report["summaries"][route]["total_ms"]["p95"])
            self.assertIsNotNone(samples[route]["error"])
        self.assertEqual(report["summaries"]["/timeout"]["ttfb_ms"]["missing"], 1)

    def test_percentiles_include_failed_sample_durations(self):
        rows = [dict(route="/", total_ms=t, ttfb_ms=t / 2 if t != 400 else None,
                     status=200 if t < 400 else 503, error=None if t < 400 else "http_status", bytes=1)
                for t in (10, 20, 30, 400)]
        summary = BENCH.summarize(["/"], rows)["/"]
        self.assertEqual(summary["count"], 4)
        self.assertEqual(summary["errors"], 1)
        self.assertEqual(summary["total_ms"]["p50"], 20)
        self.assertEqual(summary["total_ms"]["p95"], 400)
        self.assertEqual(summary["ttfb_ms"]["missing"], 1)
        self.assertEqual(summary["status_counts"], {"200": 3, "503": 1})

    def test_ttfb_precedes_delayed_body_and_proxies_are_not_used(self):
        with patch.dict(os.environ, {"HTTP_PROXY": "http://127.0.0.1:1", "http_proxy": "http://127.0.0.1:1", "NO_PROXY": "", "no_proxy": ""}):
            report = BENCH.run_benchmark(self.base, ["/delayed-body"], repeats=1)
        sample = report["samples"][0]
        self.assertEqual(sample["status"], 200)
        self.assertGreater(sample["total_ms"] - sample["ttfb_ms"], 30)

    def test_labeled_manifest_and_response_metadata(self):
        completed, report = self.invoke([
            {"path": "/about", "label": "public static page"},
            {"path": "/profile/alice", "label": "protected initial HTML; not full authenticated performance"},
        ], "--repeats", "1")
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(report["routes"], ["/about", "/profile/alice"])
        self.assertEqual(report["route_labels"]["/about"], "public static page")
        self.assertEqual(report["measured_request_count"], 2)
        self.assertEqual(report["warmup"]["request_count"], 0)
        sample = report["samples"][0]
        self.assertEqual(sample["content_type"], "text/html; charset=utf-8")
        self.assertEqual(sample["content_length"], "24")
        self.assertEqual(sample["http_version"], "HTTP/1.0")
        self.assertEqual(report["summaries"]["/about"]["bytes"], 24)

    def test_body_read_uses_remaining_timeout_after_headers(self):
        report = BENCH.run_benchmark(self.base, ["/header-and-body-delay"], repeats=1, timeout=0.15)
        sample = report["samples"][0]
        self.assertEqual(sample["status"], 200)
        self.assertEqual(sample["bytes"], 0)
        self.assertIsNotNone(sample["ttfb_ms"])
        self.assertEqual(report["summaries"]["/header-and-body-delay"]["errors"], 1)

    def test_localhost_subdomain_is_pinned_to_loopback(self):
        base = "http://fixture.localhost:%d" % self.server.server_port
        report = BENCH.run_benchmark(base, ["/"], repeats=1)
        self.assertEqual(report["samples"][0]["status"], 200)
        self.assertEqual(len(self.server.requests), 1)

    def test_eight_workers_remain_bounded(self):
        report = BENCH.run_benchmark(self.base, ["/slow"], concurrency=8, repeats=16, timeout=3)
        self.assertEqual(len(report["samples"]), 16)
        self.assertLessEqual(self.server.peak, 8)
        self.assertTrue(all(sample["status"] == 200 for sample in report["samples"]))
    def test_local_only_fixture_cannot_be_sent_to_remote_origin(self):
        with patch.object(BENCH, "measure", side_effect=AssertionError("remote fixture must not be requested")):
            with self.assertRaises(ValueError):
                BENCH.run_benchmark('https://example.com',
                    [{"path": "/blog/local-fixture", "label": "local-only gated initial HTML", "local_only": True}],
                    repeats=1, allow_remote=True)
        completed, report = self.invoke([
            {"path": "/about", "label": "local-only gated initial HTML", "local_only": True}
        ], "--repeats", "1")
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(report["local_only_routes"], ["/about"])
        self.assertEqual(report["samples"][0]["status"], 200)
    def test_existing_output_is_never_overwritten_or_requested(self):
        manifest = Path(self.temp.name) / "routes.json"
        output = Path(self.temp.name) / "baseline.json"
        manifest.write_text('["/"]', encoding="utf-8")
        output.write_text("KEEP_BASELINE", encoding="utf-8")
        completed = subprocess.run(
            [sys.executable, "-B", str(SCRIPT), "--base-url", self.base,
             "--manifest", str(manifest), "--output", str(output)],
            capture_output=True, text=True, timeout=10,
        )
        self.assertNotEqual(completed.returncode, 0)
        self.assertEqual(output.read_text(encoding="utf-8"), "KEEP_BASELINE")
        self.assertEqual(self.server.requests, [])
    def test_invalid_cookie_is_rejected_without_echo_or_requests(self):
        secret = "session=secret\r\nInjected: yes"
        completed, report = self.invoke(["/"], cookie=secret)
        self.assertNotEqual(completed.returncode, 0)
        self.assertNotIn("secret", completed.stderr + completed.stdout)
        self.assertEqual(self.server.requests, [])
        self.assertIsNone(report)


if __name__ == "__main__":
    unittest.main()
