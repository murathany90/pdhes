import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from build_linked_hes import build_payloads, validate_linked_fullness_consistency


class LinkedHesBuildTest(unittest.TestCase):
    def write_inputs(self, root: Path, *, version: str = "hes177-v-test") -> tuple[Path, Path, Path, Path]:
        links = root / "links.json"
        hes = root / "hes.json"
        manifest = root / "manifest.json"
        fullness = root / "fullness.json"
        links.write_text(json.dumps({"links": [{"pdhesSiteId": "site-1", "hesId": "hes-1", "reservoirId": "r-1", "role": "lower_reservoir", "confidence": "high", "method": "test"}]}), encoding="utf-8")
        hes.write_text(json.dumps({"features": [{"type": "Feature", "id": "hes-1", "properties": {"id": "hes-1", "name": "Test HES", "damName": "Test Baraj", "province": "TEST"}}]}), encoding="utf-8")
        manifest.write_text(json.dumps({"dataVersion": version}), encoding="utf-8")
        fullness.write_text(json.dumps({"dataVersion": version, "pipelineRunAt": "2026-09-16T00:00:00Z", "latestObservationAt": "2026-09-15", "records": [{"hesId": "hes-1", "fullnessPercent": 71.2, "source": "dsi", "status": "available", "isEstimated": False, "observedAt": "2026-09-15", "observationTimestamp": "2026-09-15"}]}), encoding="utf-8")
        return links, hes, manifest, fullness

    def test_linked_payloads_preserve_canonical_version_and_observation(self):
        with tempfile.TemporaryDirectory() as directory:
            inputs = self.write_inputs(Path(directory))
            summary, fullness = build_payloads(*inputs)
        self.assertEqual(summary["dataVersion"], "hes177-v-test")
        self.assertEqual(summary["records"][0]["observedAt"], "2026-09-15")
        self.assertEqual(summary["records"][0]["observationTimestamp"], "2026-09-15")
        self.assertEqual(fullness["records"][0]["dataVersion"], "hes177-v-test")
        self.assertEqual(fullness["records"][0]["source"], "dsi")
        self.assertFalse(fullness["records"][0]["isEstimated"])

    def test_version_mismatch_fails_before_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            links, hes, manifest, fullness = self.write_inputs(root, version="hes177-v-a")
            manifest.write_text(json.dumps({"dataVersion": "hes177-v-b"}), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "dataVersion mismatch"):
                build_payloads(links, hes, manifest, fullness)

    def test_consistency_mismatch_fails(self):
        canonical = {"dataVersion": "hes177-v-test", "pipelineRunAt": "2026-09-16T00:00:00Z", "records": [{"hesId": "hes-1", "fullnessPercent": 71.2, "source": "dsi", "provider": "DSİ", "isEstimated": False, "observedAt": "2026-09-15", "observationTimestamp": "2026-09-15"}]}
        linked = {"dataVersion": "hes177-v-test", "pipelineRunAt": "2026-09-16T00:00:00Z", "records": [{"hesId": "hes-1", "fullnessPercent": 70.0, "source": "dsi", "provider": "DSİ", "isEstimated": False, "observedAt": "2026-09-15", "observationTimestamp": "2026-09-15"}]}
        with self.assertRaisesRegex(ValueError, "fullnessPercent"):
            validate_linked_fullness_consistency(canonical, linked)


if __name__ == "__main__":
    unittest.main()
