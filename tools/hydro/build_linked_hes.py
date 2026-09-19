"""Build the small PDHES <-> HES runtime package from canonical inputs."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_LINKS = ROOT / "app/public/hydrology/pdhes_hes_links.json"
DEFAULT_HES = ROOT / "app/public/hydrology/data/hes177/hes_177.geojson"
DEFAULT_MANIFEST = ROOT / "app/public/hydrology/data/hes177/hes_177_manifest.json"
DEFAULT_FULLNESS = ROOT / "app/public/hydrology/data/live/hes_fullness_latest.json"
DEFAULT_SUMMARY = ROOT / "app/public/hydrology/data/hes177/hes_linked_summary.json"
DEFAULT_LINKED_FULLNESS = ROOT / "app/public/hydrology/data/live/hes_linked_fullness_latest.json"

SUMMARY_PROPERTIES = (
    "id", "entityId", "name", "damName", "province", "basinName",
    "coordinateStatus", "coordinateKind", "reservoirName", "reservoirSource",
    "reservoirMatchConfidence",
)
OBSERVATION_FIELDS = ("observedAt", "observationTimestamp", "fetchedAt")


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Cannot read JSON input: {path}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"Expected JSON object: {path}")
    return value


def write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f"{path.suffix}.tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def data_version(manifest: dict[str, Any], fullness: dict[str, Any]) -> str:
    manifest_version = str(manifest.get("dataVersion") or "")
    fullness_version = str(fullness.get("dataVersion") or "")
    if not manifest_version or not fullness_version:
        raise ValueError("Canonical manifest and fullness payload must both contain dataVersion")
    if manifest_version != fullness_version:
        raise ValueError(f"Canonical dataVersion mismatch: manifest={manifest_version}, fullness={fullness_version}")
    return manifest_version


def build_payloads(
    links_path: Path = DEFAULT_LINKS,
    hes_path: Path = DEFAULT_HES,
    manifest_path: Path = DEFAULT_MANIFEST,
    fullness_path: Path = DEFAULT_FULLNESS,
) -> tuple[dict[str, Any], dict[str, Any]]:
    links_payload = read_json(links_path)
    hes_payload = read_json(hes_path)
    manifest_payload = read_json(manifest_path)
    fullness_payload = read_json(fullness_path)
    version = data_version(manifest_payload, fullness_payload)

    links = links_payload.get("links")
    if not isinstance(links, list):
        raise ValueError("PDHES-HES mapping must contain a links array")
    features = hes_payload.get("features")
    if not isinstance(features, list):
        raise ValueError("Canonical HES data must contain a features array")
    hes_by_id = {
        str((feature.get("properties") or {}).get("id") or feature.get("id") or ""): feature
        for feature in features
        if isinstance(feature, dict)
    }
    fullness_records = fullness_payload.get("records")
    if not isinstance(fullness_records, list):
        raise ValueError("Canonical fullness data must contain a records array")
    fullness_by_id = {
        str(record.get("hesId")): record
        for record in fullness_records
        if isinstance(record, dict) and record.get("hesId")
    }

    linked_hes: list[dict[str, Any]] = []
    linked_fullness: list[dict[str, Any]] = []
    for link in links:
        if not isinstance(link, dict):
            raise ValueError("PDHES-HES mapping contains a non-object link")
        hes_id = str(link.get("hesId") or "")
        if not hes_id:
            raise ValueError("PDHES-HES mapping contains a link without hesId")
        feature = hes_by_id.get(hes_id)
        if feature is None:
            raise ValueError(f"PDHES-HES link points to missing canonical HES: {hes_id}")
        fullness = fullness_by_id.get(hes_id)
        if fullness is None:
            raise ValueError(f"PDHES-HES link has no canonical fullness record: {hes_id}")

        observations = {field: fullness.get(field) for field in OBSERVATION_FIELDS}
        linked_hes.append({
            "hesId": hes_id,
            "dataVersion": version,
            **observations,
            "properties": {
                key: (feature.get("properties") or {}).get(key)
                for key in SUMMARY_PROPERTIES
                if key in (feature.get("properties") or {})
            },
        })
        linked_fullness.append({"dataVersion": version, **fullness})

    generated_at = fullness_payload.get("generatedAt") or fullness_payload.get("pipelineRunAt") or manifest_payload.get("generatedAt")
    summary_payload = {
        "version": 2,
        "dataVersion": version,
        "generatedAt": generated_at,
        "pipelineRunAt": fullness_payload.get("pipelineRunAt"),
        "latestObservationAt": fullness_payload.get("latestObservationAt"),
        "records": sorted(linked_hes, key=lambda record: record["hesId"]),
    }
    linked_fullness_payload = {
        key: value for key, value in fullness_payload.items() if key != "records"
    }
    linked_fullness_payload.update({
        "dataVersion": version,
        "recordCount": len(linked_fullness),
        "records": sorted(linked_fullness, key=lambda record: record["hesId"]),
    })
    return summary_payload, linked_fullness_payload


def build_and_write(
    summary_path: Path = DEFAULT_SUMMARY,
    linked_fullness_path: Path = DEFAULT_LINKED_FULLNESS,
    **inputs: Path,
) -> None:
    summary, linked_fullness = build_payloads(**inputs)
    write_json_atomic(summary_path, summary)
    write_json_atomic(linked_fullness_path, linked_fullness)
    print(json.dumps({
        "dataVersion": summary["dataVersion"],
        "linkedHesCount": len(summary["records"]),
        "latestObservationAt": summary["latestObservationAt"],
        "summary": str(summary_path.relative_to(ROOT)) if summary_path.is_relative_to(ROOT) else str(summary_path),
        "fullness": str(linked_fullness_path.relative_to(ROOT)) if linked_fullness_path.is_relative_to(ROOT) else str(linked_fullness_path),
    }, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--links", type=Path, default=DEFAULT_LINKS)
    parser.add_argument("--hes", type=Path, default=DEFAULT_HES)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--fullness", type=Path, default=DEFAULT_FULLNESS)
    parser.add_argument("--summary-output", type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument("--fullness-output", type=Path, default=DEFAULT_LINKED_FULLNESS)
    args = parser.parse_args()
    build_and_write(
        summary_path=args.summary_output,
        linked_fullness_path=args.fullness_output,
        links_path=args.links,
        hes_path=args.hes,
        manifest_path=args.manifest,
        fullness_path=args.fullness,
    )


if __name__ == "__main__":
    main()
