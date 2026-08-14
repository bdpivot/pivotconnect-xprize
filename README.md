# PivotConnect — Evidence-Aware Mentor Coordination Prototype

**Build with Gemini · XPRIZE submission by Pivot Holdings International**

PivotConnect is a development-stage prototype exploring how AI could help entrepreneurs describe their needs, review explainable mentor recommendations, and prepare for a mentor relationship while keeping consequential decisions under human control.

> **Truth note:** The public walkthrough is a deterministic interactive prototype. Founder and mentor identities, scores, messages, introductions, scheduling, and outcomes are synthetic or representative. It does not use live Gemini inference, a live mentor directory, or production users.

## Try it out

- **Interactive prototype (no login or API key):** https://bdpivot.github.io/pivotconnect-xprize/
- **Recorded development walkthrough and screenshots:** [`demo/evidence/`](demo/evidence/)
- **Gemini development-test evidence:** [`Product_Evidence/`](Product_Evidence/)

The prototype lets a reviewer:

1. Review or edit a synthetic founder profile.
2. See representative mentor candidates with visible matching factors and caveats.
3. Inspect a mentor detail view before any represented introduction.
4. Explicitly acknowledge the synthetic data and approve the represented introduction.
5. Review preparation and follow-up states.
6. Inspect a four-part evidence legend separating verified evidence, implemented/tested code, prototype simulation, and planned work.

## What is implemented and tested

The repository contains a Node.js/Express architecture for specialized coaching, research, grant, financial-modeling, and mentor-oriented routes. Development logs document controlled successful tests involving:

- Gemini 2.5 Pro and Gemini 2.5 Flash model calls
- Gemini Code Execution for a synthetic financial scenario
- Google Search Grounding with query and citation metadata

These artifacts support development testing only; they do not establish production deployment, operational scale, real mentor matching, or participant outcomes. Some evidence logs also preserve failed attempts for completeness.

## What the public walkthrough represents

The public page uses deterministic browser-side logic so judges can review the proposed workflow without credentials, network dependencies, or variable model output. Its profile extraction, rankings, explanations, introduction, preparation, and follow-up states are representative product behavior—not live AI results.

## What remains planned

- Production authentication, authorization, monitoring, and data-retention controls
- A consented and verified mentor directory
- Live matching, scheduling, messaging, and relationship tracking
- Fairness, accessibility, security, and match-quality evaluation
- A governed pilot with real participant consent and measured outcomes

## Repository structure

```text
pivotconnect-xprize/
├── docs/                    # Public deterministic GitHub Pages prototype
├── demo/                    # Demo source and recorded development evidence
├── Product_Evidence/        # Selected Gemini development-test logs
├── src/                     # API, agents, integrations, config, and utilities
├── examples/                # Development examples
├── .env.example             # Environment template; no credentials
└── package.json
```

## Run locally

### Deterministic prototype — no keys required

```bash
cd demo
npm install
npm start
# Open http://localhost:3000/mentor-demo-v2.html
```

### API architecture — Google Cloud configuration required

```bash
cp .env.example .env
# Add your own Google Cloud project configuration and credentials.
npm install
npm start
```

See [`SETUP_GUIDE.md`](SETUP_GUIDE.md) and [`QUICK_START.md`](QUICK_START.md) for development setup. Never commit credentials or private participant data.

## Evidence boundary

**This repository demonstrates:** an inspectable product workflow, implemented API and agent code, and selected controlled Gemini capability tests.

**It does not demonstrate:** a production service, real mentors or founders, verified matches, completed meetings, validated impact, staffing reduction, or a proven operating model.

## About Pivot Holdings International

PivotConnect is a program concept of **Pivot Holdings International**, a 501(c)(3) private foundation focused on expanding access to entrepreneurship education, mentorship, and AI-enabled tools.

- Website: https://pivotintl.org

## License

MIT — see [`LICENSE`](LICENSE).
