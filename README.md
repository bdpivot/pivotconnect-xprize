# PivotConnect — AI-Matched Mentorship (Zero Program Staff)

**Build with Gemini · XPRIZE Submission**

PivotConnect is an AI-powered mentorship platform that connects aspiring entrepreneurs with seasoned, often-retired executives — and runs the entire relationship (matching, introductions, scheduling, and ongoing accountability) with **zero program staff**. The AI does the coordination; humans provide the wisdom.

> **The idea in one line:** What if every aspiring entrepreneur could have a seasoned CEO as their mentor — matched, introduced, and supported by AI?

---

## 🎥 See It Running

- **Live demo (GitHub Pages):** https://bdpivot.github.io/pivotconnect-xprize/
- **Recorded walkthrough + screenshots:** [`demo/evidence/`](demo/evidence/)

The live demo is a self-contained, click-through walkthrough of the full PivotConnect user journey — from a founder's first message to a confirmed mentorship session and an ongoing accountability dashboard.

---

## 🧭 The User Journey (what the demo shows)

1. **Founder describes their business** — a first-time entrepreneur wants to start a sustainable fashion brand with $15K and no industry experience.
2. **AI matching (Compass agent)** — analyzes needs and surfaces 4 compatible mentors, ranked by a deep-compatibility score (Margaret Chen, 96%).
3. **Mentor profile + intro video** — the founder reviews the top match, including a short video introduction.
4. **AI-drafted introduction** — the system writes a personalized outreach message highlighting shared ground.
5. **Scheduling** — the mentor accepts; the founder books a first session from available slots.
6. **Confirmed session + prep checklist** — the AI prepares an agenda so the hour is well spent.
7. **Mentorship dashboard** — goals, milestones, and weekly AI check-ins keep the relationship on track over a 12-week program.

---

## 🤖 How Gemini Powers It

PivotConnect is built on Google's Gemini models (via Vertex AI):

- **Gemini 2.5 Pro** — reasoning, coaching, orchestration, and function-calling to route tasks between specialized agents
- **Gemini 2.5 Flash** — fast conversational responses
- **Embeddings** — semantic compatibility matching between founders and mentors (beyond keyword matching)

### Multi-Agent Architecture

| Agent | Role | Model |
|-------|------|-------|
| 🦅 Phoenix | Business coach & orchestrator | Gemini 2.5 Pro + Flash |
| 🧭 Compass / PivotConnect | Mentor matching | Embeddings + Flash |
| 🗺️ Atlas | Market research | Gemini 2.5 Pro |
| ⚡ Catalyst | Grant matching | Gemini 2.5 Pro + Embeddings |
| 📊 Ledger | Financial modeling | Gemini 2.5 Pro |

The orchestrator uses Gemini **function calling** to intelligently route a user's request to the right specialized agent.

---

## 📂 Repository Structure

```
pivotconnect-xprize/
├── docs/                      # Live GitHub Pages demo (self-contained)
│   ├── index.html             #   → the interactive walkthrough
│   └── assets/                #   → mentor intro video
├── demo/                      # Demo source + running evidence
│   ├── public/                #   → demo HTML (mentor-demo-v2.html)
│   ├── server.js              #   → tiny Express static server
│   └── evidence/              #   → recorded walkthrough + screenshots
├── src/                       # Application source
│   ├── agents/                #   → Phoenix, Compass, Atlas, Catalyst, Ledger
│   ├── api/                   #   → Express API server + routes
│   ├── integrations/gemini/   #   → Vertex AI / Gemini client
│   ├── config/                #   → configuration
│   └── utils/                 #   → logging
├── examples/                  # Runnable agent test (examples/test-phoenix.js)
├── scripts/setup.sh           # Automated setup
├── Dockerfile                 # Container build
├── cloudbuild.yaml            # Cloud Run deployment
├── .env.example               # Environment variable template (no secrets)
└── package.json
```

---

## 🚀 Run It Locally

### The demo (no keys required)
```bash
cd demo
npm install
npm start
# open http://localhost:3000/mentor-demo-v2.html
```

### The full API + agents (requires a Google Cloud project with Vertex AI)
```bash
cp .env.example .env      # then fill in your GCP project + credentials
npm install
npm start                 # API server on http://localhost:8080
```

See [`SETUP_GUIDE.md`](SETUP_GUIDE.md) and [`QUICK_START.md`](QUICK_START.md) for details.

> **Note:** No secrets or API keys are included in this repository. `.env.example` is a template only.

---

## 🌍 About Pivot Holdings International

PivotConnect is one program within **Pivot Holdings International (PHI)**, a 501(c)(3) foundation making entrepreneurship accessible to anyone willing to do the work — veterans, single parents, artists, farmers, and more.

- Website: https://pivotintl.org

---

## 📄 License

MIT — see [LICENSE](LICENSE).
