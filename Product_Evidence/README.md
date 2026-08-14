# PivotConnect — Selected Gemini Development-Test Evidence

This folder contains selected artifacts from controlled development tests performed for PivotConnect using Google Gemini through Vertex AI.

> **Scope:** These artifacts support limited capability-testing claims. They do not prove production deployment, continuous availability, real mentor matching, operational scale, or participant outcomes. Successful and failed attempts are retained where relevant.

## Included logs

- [`logs/run-20260731-220300.log`](logs/run-20260731-220300.log) — successful Gemini 2.5 Pro and Gemini 2.5 Flash development calls; the same run also records unsuccessful embedding attempts.
- [`logs/advanced-features-2026-08-01T15-54-28-283Z.log`](logs/advanced-features-2026-08-01T15-54-28-283Z.log) — controlled tests recording Gemini Code Execution, Google Search Grounding metadata, and multimodal image analysis.
- [`logs/gemini-evidence-20260730-123742.log`](logs/gemini-evidence-20260730-123742.log) — an earlier mixed-result run containing successful Pro/Flash calls, a rate-limit response, and unsuccessful embedding attempts.
- [`logs/gemini-evidence-20260730-123657.log`](logs/gemini-evidence-20260730-123657.log) — an earlier mixed-result run retained as part of the honest development record.

## Evidence interpretation

The logs include timestamps, configured project/region information, model identifiers, response metadata, and error records. They should be read as development logs rather than audited production telemetry.

Financial examples, research outputs, citations, and image-analysis text contained in these logs are synthetic test material. They are not financial advice, validated market research, or evidence of program impact.

## Not included here

The empty `billing/` and `dashboards/` directories are placeholders; this public repository does not currently provide independent billing or observability evidence in those folders. No claim should rely on missing artifacts.
