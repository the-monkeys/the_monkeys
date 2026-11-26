#!/usr/bin/env python3
"""Measure per-page Next App Router JS, including layouts, without reading env files."""
import argparse
from datetime import datetime, timezone
import gzip
import json
from pathlib import Path
import subprocess


def measure(directory):
    root = Path(directory).resolve()
    pages = json.loads((root / 'app-build-manifest.json').read_text(encoding='utf-8'))['pages']
    files = {}
    results = []
    for entry, chunks in pages.items():
        if not entry.endswith('/page'):
            continue
        selected = set(chunks)
        parts = entry.strip('/').split('/')[:-1]
        layouts = ['/layout'] + ['/' + '/'.join(parts[:i]) + '/layout' for i in range(1, len(parts) + 1)]
        for layout in layouts:
            selected.update(pages.get(layout, []))
        selected = sorted(p for p in selected if p.endswith('.js'))
        for chunk in selected:
            path = (root / chunk).resolve()
            if not path.is_relative_to(root):
                raise ValueError('manifest chunk escapes build directory')
            if chunk not in files:
                data = path.read_bytes()
                files[chunk] = {'raw_bytes': len(data), 'gzip_bytes': len(gzip.compress(data, mtime=0))}
        results.append({'entry': entry, 'chunks': selected,
                        'raw_bytes': sum(files[p]['raw_bytes'] for p in selected),
                        'gzip_bytes': sum(files[p]['gzip_bytes'] for p in selected)})
    return {'schema_version': 1, 'generated_at_utc': datetime.now(timezone.utc).isoformat(),
            'build_id': (root / 'BUILD_ID').read_text().strip() if (root / 'BUILD_ID').exists() else None,
            'method': 'Unique per-page manifest JS chunks plus ancestor layouts; each chunk gzip level 9. Excludes async chunks, assets and browser caching. Not browser transfer or LCP.',
            'pages': sorted(results, key=lambda p: p['entry']), 'chunks': dict(sorted(files.items()))}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-dir', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    report = measure(args.build_dir)
    revision = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True, check=False)
    report['source_checkout_sha'] = revision.stdout.strip() if revision.returncode == 0 else None
    with Path(args.output).open('x', encoding='utf-8') as output:
        json.dump(report, output, indent=2)
        output.write('\n')
    print(f"Measured {len(report['pages'])} page entries; saved {args.output}")


if __name__ == '__main__':
    main()
