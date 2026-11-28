import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('bundles', Path(__file__).with_name('benchmark-bundles.py'))
bundles = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bundles)

class BundleTests(unittest.TestCase):
    def test_includes_parent_layouts_once_and_excludes_other_routes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'static').mkdir()
            for name in ['shared.js', 'root.js', 'nested.js', 'page.js', 'other.js']:
                (root / 'static' / name).write_bytes(name.encode() * 20)
            pages = {'/layout': ['static/shared.js', 'static/root.js', 'static/style.css'],
                     '/(site)/layout': ['static/shared.js', 'static/nested.js'],
                     '/(site)/page/page': ['static/shared.js', 'static/page.js'],
                     '/other/page': ['static/other.js']}
            (root / 'app-build-manifest.json').write_text(json.dumps({'pages': pages}))
            report = bundles.measure(root)
            route = next(p for p in report['pages'] if p['entry'] == '/(site)/page/page')
            self.assertEqual(route['chunks'], ['static/nested.js', 'static/page.js', 'static/root.js', 'static/shared.js'])
            self.assertEqual(route['raw_bytes'], sum((root / p).stat().st_size for p in route['chunks']))
            self.assertGreater(route['gzip_bytes'], 0)
            self.assertLess(route['gzip_bytes'], route['raw_bytes'])

    def test_rejects_manifest_paths_outside_build(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'app-build-manifest.json').write_text(json.dumps({'pages': {'/page': ['../secret.js']}}))
            with self.assertRaises(ValueError):
                bundles.measure(root)

if __name__ == '__main__':
    unittest.main()
