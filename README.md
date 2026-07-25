# Delta Chat: P&ID Revision Analysis and Grounded Chat Engine

An industrial-grade engineering document intelligence platform designed to compare Piping and Instrumentation Diagram (P&ID) revision documents, compute precise spatial and categorical deltas, synthesize structured revision reports, and deliver spatially grounded conversational context using multi-LLM routing with primary Gemini 2.5 Flash and resilient fallbacks.

---

## Architecture Overview

```
                                +---------------------------+
                                |    P&ID Revision Docs     |
                                |  (PDF Native/Scan, CAD)   |
                                +-------------+-------------+
                                              |
                                              v
                                +---------------------------+
                                |      INGESTION LAYER      |
                                | (FormatAdapter Strategy)  |
                                +-------------+-------------+
                                              |
                                              v
                                +---------------------------+
                                |   CANONICAL DATA MODEL    |
                                | (Bounding Box Entities)   |
                                +-------------+-------------+
                                              |
                                              v
                                +---------------------------+
                                |   DELTA COMPUTATION       |
                                |  (Spatial IoU + Text)     |
                                +-------------+-------------+
                                              |
                                              v
                                +---------------------------+
                                |   MULTI-LLM ROUTING RAG   |
                                | Gemini 2.5 / Groq / Local |
                                +-------------+-------------+
```

---

## Core Capabilities

### 1. Multi-Format Ingestion Engine
* Format Strategy Adapters (`FormatAdapter`): Supports native vector PDFs, scanned drawing PDFs, and AutoCAD DWG/DXF layer metadata.
* Bounding Box Normalization: Extracted entities are mapped to uniform normalized coordinates across varying sheet sizes (D-size, A1, A0).

### 2. Canonical Engineering Data Representation
* Element Taxonomy: Classifies components into standard engineering categories: `VALVE`, `PIPELINE`, `PUMP`, `TANK`, `INSTRUMENT`, `DIMENSION`, `HEADER`, and `FITTING`.
* Schema Validation: Enforces tight boundary constraints and structured JSON object serialization.

### 3. Spatial and Semantic Delta Engine
* Multi-Factor Alignment (`ElementAligner`): Computes bounding box Intersection-over-Union (IoU), string edit distance (Levenshtein), and element type affinity to align components across revisions.
* Delta Classification (`ChangeClassifier`): Categorizes changes into `ADDED`, `REMOVED`, `MODIFIED`, and `MOVED`.
* Confidence Scoring: Assigns explicit confidence metrics (0.0 to 1.0) based on alignment delta margins.

### 4. Grounded Chat and Multi-LLM Provider Failover
* Resilient Provider Hierarchy: Routes user queries to Gemini 2.5 Flash as primary, failover to Groq Cloud (Mixtral/Llama), and secondary failover to local execution or mock fallback.
* Zero-Shot Spatial Grounding: Injects bounding box coordinates and revision markers into model context to enforce cited, hallucination-free answers.

### 5. Production Observability
* Distributed Tracing: Logs execution spans and latencies across ingestion, delta calculation, and LLM inference.
* Cost & Token Tracking: Computes real-time token consumption and estimated API usage metrics.

---

## Project Structure

```
.
├── .env.example               # Environment variable templates (no secrets)
├── .gitignore                 # Excludes credentials, build artifacts, node_modules
├── Dockerfile                 # Production multi-stage Docker build container
├── README.md                  # System documentation
├── dist/                      # Production build output (generated)
├── index.html                 # Single page application template
├── package.json               # Node.js dependencies and lifecycle scripts
├── server.ts                  # Express full-stack server entrypoint
├── src/                       # Frontend React application & components
│   ├── App.tsx                # Main container component
│   ├── components/            # UI components (Viewer, Chat, Telemetry, Delta Table)
│   ├── canonical/             # Data structure schemas and types
│   ├── delta/                 # Alignment and difference calculation engines
│   ├── ingest/                # Document extraction adapters
│   └── main.tsx               # Client entrypoint
└── vite.config.ts             # Vite build and development configuration
```

---

## Environment Variables and Security

Before committing or deploying, create a `.env` file based on `.env.example`. All secret keys must remain strictly in environment variables and must never be committed to git repositories.

### Sample Configuration (`.env.example`)

```env
# Application Settings
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your_random_secret_key_here

# LLM Provider Routing
LLM_PRIMARY_PROVIDER=gemini
LLM_FALLBACK_PROVIDER_1=groq
LLM_FALLBACK_PROVIDER_2=ollama

# Primary Provider - Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Fallback Provider 1 - Groq Cloud (Optional)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=mixtral-8x7b-32768

# Fallback Provider 2 - Ollama (Optional)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# API and Host Binding
API_HOST=0.0.0.0
API_PORT=3000
```

---

## Local Development Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pid-delta-chat.git
   cd pid-delta-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to supply your `GEMINI_API_KEY`.*

4. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   ```

6. Test production bundle locally:
   ```bash
   npm run start
   ```

---

## Deployment to Google Cloud Run (Free Tier)

Google Cloud Run offers a generous permanent Free Tier that includes:
* 2 million requests per month
* 360,000 GB-seconds of memory and 180,000 vCPU-seconds per month
* 1 GB egress within North America per month

By configuring cold-start scale-to-zero and setting resource allocations within free limits, you can run this application on GCP with zero ongoing monthly costs.

### Prerequisites for GCP Deployment
1. A Google Cloud Platform account with billing enabled (required by GCP to activate free tier resources).
2. Installed and initialized Google Cloud CLI (`gcloud`).

---

### Step-by-Step Deployment Commands

#### Step 1: Set GCP Project ID and Region
```bash
# Set your active GCP project ID
gcloud config set project YOUR_GCP_PROJECT_ID

# Set default region (e.g., us-central1 offers full free tier availability)
gcloud config set run/region us-central1
```

#### Step 2: Enable Necessary GCP Services
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

#### Step 3: Create an Artifact Registry Repository
```bash
gcloud artifacts repositories create pid-chat-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for P&ID Delta Chat"
```

#### Step 4: Build and Push Docker Image
```bash
# Build image using Cloud Build
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/pid-chat-repo/app:v1
```

#### Step 5: Deploy to Cloud Run under Free Tier Limits
To remain fully within Google Cloud Run Free Tier limits, specify:
* Memory: `512Mi` (or `1Gi`)
* CPU: `1`
* Minimum Instances: `0` (enables scale-to-zero when idle)
* Maximum Instances: `5` (prevents unexpected billing spikes)
* Concurrency: `80` requests per container

```bash
gcloud run deploy pid-delta-chat \
  --image us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/pid-chat-repo/app:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --concurrency 80 \
  --port 3000 \
  --set-env-vars "NODE_ENV=production,GEMINI_API_KEY=your_gemini_api_key_here"
```

#### Step 6: Verify Deployment URL
Once deployment completes, `gcloud` will output your HTTPS Service URL:
```text
Service [pid-delta-chat] revision [pid-delta-chat-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://pid-delta-chat-xxxxxx-uc.a.run.app
```

---

## Best Practices for Cost Prevention on GCP

1. **Keep `--min-instances 0`**: Container instances shut down automatically when traffic stops, incurring zero CPU/RAM charges when idle.
2. **Set `--max-instances 5`**: Prevents runaway billing if targeted by unexpected traffic floods.
3. **Use Gemini 2.5 Flash Free Tier**: Google AI Studio provides free quota limits for Gemini models, preventing upstream AI API charges.
4. **Use Secret Manager for Production Keys (Optional)**:
   ```bash
   gcloud secrets create GEMINI_API_KEY --data-file=-
   # Pass secret reference to Cloud Run:
   # --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
   ```

---

## GitHub Repository Push Checklist

Before pushing this repository to GitHub, verify that:
- `.env` is NOT tracked by git (`git status` should not list `.env`).
- `.env.example` contains sanitized placeholders without active tokens or keys.
- All dependencies are listed in `package.json`.
- `npm run lint` and `npm run build` execute cleanly without errors.

```bash
git add .
git commit -m "feat: prepare production release with sanitized environment, updated documentation, and GCP deployment configuration"
git push origin main
```

---

## License

This project is licensed under the MIT License.
