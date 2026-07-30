# LaunchPad AI - Complete Setup Guide

**Get your multi-agent system running in 15 minutes** ⏱️

---

## ✅ Prerequisites Check

Before starting, make sure you have:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Google Cloud CLI installed (`gcloud --version`)
- [ ] Git installed
- [ ] Text editor (VS Code, etc.)

**Don't have them?**
- Node.js: https://nodejs.org/
- gcloud CLI: https://cloud.google.com/sdk/docs/install
- Git: https://git-scm.com/downloads

---

## 🚀 Option 1: Automated Setup (Easiest)

Run the setup script—it does everything for you:

```bash
cd launchpad-ai
./scripts/setup.sh
```

The script will:
1. Enable required Google Cloud APIs
2. Create service account
3. Download credentials
4. Generate `.env` file
5. Install dependencies
6. Test Gemini connection

**Follow the prompts**, then skip to "Testing" section below.

---

## 🔧 Option 2: Manual Setup (If script fails)

### Step 1: Google Cloud Project

```bash
# Set your project
gcloud config set project phi-openclaw

# Enable APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 2: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create launchpad-ai \
  --display-name="LaunchPad AI" \
  --project=phi-openclaw

# Grant Vertex AI permissions
gcloud projects add-iam-policy-binding phi-openclaw \
  --member="serviceAccount:launchpad-ai@phi-openclaw.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Download key
gcloud iam service-accounts keys create service-account.json \
  --iam-account=launchpad-ai@phi-openclaw.iam.gserviceaccount.com \
  --project=phi-openclaw
```

### Step 3: Configure Environment

```bash
# Copy example
cp .env.example .env

# Edit .env
# Update these lines:
#   GCP_PROJECT_ID=phi-openclaw
#   GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/service-account.json
```

### Step 4: Install Dependencies

```bash
npm install
```

---

## 🧪 Testing

### Test 1: Health Check

```bash
# Start server
npm run dev

# In another terminal:
curl http://localhost:8080/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-07-29T02:15:00.000Z",
  "environment": "development"
}
```

### Test 2: Phoenix Agent

```bash
# Run test script
node examples/test-phoenix.js
```

**Expected output:**
```
🦅 Testing Phoenix Agent

Test 1: Simple coaching question
✅ Phoenix Response:
That's exciting! Sustainable fashion is a growing market...

Test 2: Question requiring market research (should route to Atlas)
✅ Routing Decision:
Agent: atlas
Atlas was called!
...

🎉 All tests passed!
```

### Test 3: API Endpoints

```bash
# Test chat endpoint
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_123",
    "message": "I want to start a tech business",
    "conversationHistory": []
  }'
```

**Expected:** JSON response with Phoenix guidance

---

## 🐛 Troubleshooting

### Error: "Could not load the default credentials"

**Fix:**
```bash
# Make sure path is absolute
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"

# Or in .env:
GOOGLE_APPLICATION_CREDENTIALS=/Users/bobd/.openclaw/workspace/launchpad-ai/service-account.json
```

### Error: "Permission denied"

**Fix:**
```bash
# Make scripts executable
chmod +x scripts/setup.sh
chmod +x examples/test-phoenix.js
```

### Error: "Module not found"

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: "Vertex AI API not enabled"

**Fix:**
```bash
gcloud services enable aiplatform.googleapis.com --project=phi-openclaw
```

### Port already in use

**Fix:**
```bash
# Use different port
PORT=3000 npm run dev
```

---

## 📦 Deploy to Cloud Run

### Option 1: Cloud Build (Automatic)

```bash
# Submit build
gcloud builds submit --config cloudbuild.yaml --project=phi-openclaw

# Get service URL
gcloud run services describe launchpad-ai \
  --region=us-central1 \
  --format='value(status.url)'
```

### Option 2: Docker Manual

```bash
# Build
docker build -t gcr.io/phi-openclaw/launchpad-ai:latest .

# Push
docker push gcr.io/phi-openclaw/launchpad-ai:latest

# Deploy
gcloud run deploy launchpad-ai \
  --image gcr.io/phi-openclaw/launchpad-ai:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi
```

---

## 🎯 Next Steps

Once everything works:

1. **Test all agents:**
   - Phoenix: `curl localhost:8080/api/chat`
   - Atlas: `curl localhost:8080/api/research`
   - Catalyst: `curl localhost:8080/api/grants`
   - Ledger: `curl localhost:8080/api/financial`
   - PivotConnect: `curl localhost:8080/api/mentors`

2. **Add Airtable (optional):**
   - Create base: https://airtable.com/create
   - Add tables: Users, Conversations, Mentors, Grants
   - Update `.env` with `AIRTABLE_BASE_ID`

3. **Run production tests:**
   - Load test with 100 requests
   - Monitor Cloud Logging
   - Check Vertex AI usage

4. **Deploy to production:**
   - `gcloud builds submit`
   - Test live URL
   - Monitor costs in Cloud Console

---

## 💰 Cost Monitoring

### Check Vertex AI usage:

```bash
# Navigate to:
https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/gemini-2.5-pro

# Click "Usage" tab
```

### Estimated costs (per 1000 users/month):

- Gemini 2.5 Pro: ~$700
- Gemini 2.0 Flash: ~$80
- Embeddings: ~$40
- Cloud Run: ~$100
- **Total: ~$920**

---

## 📞 Support

**Issues?** Email bob.delisa@pivotintl.org

**Documentation:**
- README.md: Overview & API reference
- This file: Setup instructions
- examples/: Sample usage scripts

---

## ✨ You're Ready!

Everything should be working now. Here's what you built:

- ✅ 5 AI agents (Phoenix, Atlas, Catalyst, Ledger, PivotConnect)
- ✅ Full Gemini integration (2.5 Pro, 2.0 Flash, Embeddings)
- ✅ REST API server
- ✅ Cloud Run deployment ready
- ✅ XPRIZE submission ready

**Time to test with real entrepreneurs!** 🦅🚀
