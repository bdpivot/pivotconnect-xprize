# Product Evidence — PivotConnect (Build with Gemini XPRIZE)

This folder contains evidence that PivotConnect uses Google Gemini models on
Google Cloud (Vertex AI), as required by the competition.

**Google Cloud Project:** `phi-openclaw`
**Region:** `us-central1`
**Gemini models used:** `gemini-2.5-pro`, `gemini-2.5-flash`
**Billing:** Google Cloud free trial credits ($300) — usage to date is a
fraction of $0.01, so the monthly invoice is effectively $0.00 (permitted by
the rules for free-tier / credit usage).

---

## 📁 Folder Contents

### `/logs` — Agent execution logs (✅ included)
Timestamped execution logs from `examples/generate-evidence.js`, showing live,
successful calls to Gemini 2.5 Pro and Gemini 2.5 Flash on Vertex AI, with model
names, finish reasons, and response sizes. Each line is ISO-8601 timestamped.

Reproduce anytime:
```bash
node examples/generate-evidence.js
```

### `/dashboards` — Observability screenshots (⬜ ADD PNG/JPG)
Add screenshots of the Vertex AI / Cloud observability dashboards showing
Gemini request counts and token usage. See "How to capture" below.

### `/billing` — Billing invoice / cost table (⬜ ADD PDF/PNG)
Add the monthly billing invoice PDF (or the zero-dollar cost table export)
for each month of the competition.

---

## 📸 How to Capture the Remaining Evidence

### 1. Observability dashboard (Gemini request/token counts)
Google Cloud Console →
**Vertex AI → Dashboard** (or **Observability**), project `phi-openclaw`,
region `us-central1`. Set the time range to include **2026-07-30**.
Screenshot the graphs that show requests and tokens for `gemini-2.5-pro` and
`gemini-2.5-flash`. Save as PNG/JPG into `/dashboards`.

Direct: https://console.cloud.google.com/vertex-ai

Also useful — the API metrics view:
**APIs & Services → Vertex AI API → Metrics** (shows traffic/request counts).

### 2. Billing invoice / cost table
Google Cloud Console → **Billing**:
- **Invoices:** Billing → Invoices → download monthly PDF, OR
- **Cost table (recommended for $0/credits):** Billing → Cost table → set month →
  **Download CSV**, or print/save the page as PDF. This shows the
  **Vertex AI / Generative AI** SKU line even at $0.00, plus credits applied.

Save PDF/PNG into `/billing`.

---

## 🧾 Summary of Verified Usage (2026-07-30)

| Model | Successful calls | Evidence |
|-------|------------------|----------|
| gemini-2.5-pro | 6+ | `/logs` + earlier Phoenix orchestrator tests |
| gemini-2.5-flash | 2+ | `/logs` |

Note: A `429 RESOURCE_EXHAUSTED` appears in one log — this is free-tier rate
limiting, which further confirms real quota-metered calls to Gemini.
