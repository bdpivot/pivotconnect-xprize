#!/bin/bash

# LaunchPad AI Setup Script
# Automates Google Cloud and local environment setup

set -e

echo "🦅 LaunchPad AI Setup"
echo "====================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js 20+ first."
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Install it from https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Get project ID
read -p "Enter your GCP project ID (default: phi-openclaw): " PROJECT_ID
PROJECT_ID=${PROJECT_ID:-phi-openclaw}

echo "Using project: $PROJECT_ID"
echo ""

# Set project
echo "Setting active project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required Google Cloud APIs..."
gcloud services enable aiplatform.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

echo "✅ APIs enabled"
echo ""

# Create service account
SERVICE_ACCOUNT="launchpad-ai@${PROJECT_ID}.iam.gserviceaccount.com"

if gcloud iam service-accounts describe $SERVICE_ACCOUNT &> /dev/null; then
    echo "Service account already exists: $SERVICE_ACCOUNT"
else
    echo "Creating service account..."
    gcloud iam service-accounts create launchpad-ai \
        --display-name="LaunchPad AI" \
        --project=$PROJECT_ID
    
    echo "Granting Vertex AI permissions..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/aiplatform.user"
    
    echo "✅ Service account created"
fi

echo ""

# Download service account key
KEY_FILE="service-account.json"

if [ -f "$KEY_FILE" ]; then
    read -p "Service account key already exists. Overwrite? (y/N): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Keeping existing key file"
    else
        echo "Downloading new service account key..."
        gcloud iam service-accounts keys create $KEY_FILE \
            --iam-account=$SERVICE_ACCOUNT \
            --project=$PROJECT_ID
        echo "✅ New key downloaded: $KEY_FILE"
    fi
else
    echo "Downloading service account key..."
    gcloud iam service-accounts keys create $KEY_FILE \
        --iam-account=$SERVICE_ACCOUNT \
        --project=$PROJECT_ID
    echo "✅ Key downloaded: $KEY_FILE"
fi

echo ""

# Create .env file
if [ -f ".env" ]; then
    echo ".env file already exists"
    read -p "Overwrite? (y/N): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Keeping existing .env"
    else
        echo "Creating .env file..."
        cat > .env << EOF
# Google Cloud Configuration
GCP_PROJECT_ID=$PROJECT_ID
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/$KEY_FILE

# Vertex AI (Gemini API)
VERTEX_AI_LOCATION=us-central1

# Airtable (Optional)
AIRTABLE_API_KEY=your-airtable-personal-access-token
AIRTABLE_BASE_ID=
AIRTABLE_USERS_TABLE=Users
AIRTABLE_CONVERSATIONS_TABLE=Conversations
AIRTABLE_MENTORS_TABLE=Mentors
AIRTABLE_GRANTS_TABLE=Grants

# API Server
PORT=8080
NODE_ENV=development
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
        echo "✅ .env file created"
    fi
else
    echo "Creating .env file..."
    cat > .env << EOF
# Google Cloud Configuration
GCP_PROJECT_ID=$PROJECT_ID
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/$KEY_FILE

# Vertex AI (Gemini API)
VERTEX_AI_LOCATION=us-central1

# Airtable (Optional)
AIRTABLE_API_KEY=your-airtable-personal-access-token
AIRTABLE_BASE_ID=
AIRTABLE_USERS_TABLE=Users
AIRTABLE_CONVERSATIONS_TABLE=Conversations
AIRTABLE_MENTORS_TABLE=Mentors
AIRTABLE_GRANTS_TABLE=Grants

# API Server
PORT=8080
NODE_ENV=development
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ .env file created"
fi

echo ""

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Dependencies installed"
echo ""

# Test connection
echo "Testing Gemini API connection..."
node -e "
import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config();

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.VERTEX_AI_LOCATION
});

const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

model.generateContent('Say hello in one sentence').then(result => {
  console.log('✅ Gemini API connected successfully');
  console.log('Response:', result.response.text());
}).catch(err => {
  console.error('❌ Gemini API connection failed:', err.message);
  process.exit(1);
});
"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update AIRTABLE_BASE_ID in .env if using Airtable"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:8080/health"
echo ""
echo "For deployment:"
echo "  gcloud builds submit --config cloudbuild.yaml"
echo ""
