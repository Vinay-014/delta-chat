# Delta Chat Engine: P&ID Revision Analysis and Grounded Chat Engine

An industrial-grade engineering document intelligence platform designed to compare Piping and Instrumentation Diagram (P&ID) revision documents, compute precise spatial and categorical deltas, synthesize structured revision reports, and deliver spatially grounded conversational context using multi-LLM routing with primary Gemini 2.5 Flash and resilient fallbacks.



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



## Project Structure

```
.
├── .github/                       # GitHub Actions CI/CD workflows
│   └── workflows/
│       ├── cd.yml                 # Continuous deployment workflow
│       └── ci.yml                 # Continuous integration testing pipeline
├── api/                           # Vercel Serverless API handler
│   └── index.ts                   # Exported Express API handler for Vercel
├── assets/                        # Design assets and project artifacts
├── eval/                          # Evaluation harness & metrics benchmarking
│   ├── datasets/                  # Ground truth annotations and test drawing pairs
│   │   ├── ground_truth.json      # Benchmark validation dataset
│   │   └── sample_pairs.json      # Sample revision pairs for testing
│   ├── __init__.py
│   ├── evaluator.py              # Precision, recall, and IoU metric evaluators
│   ├── metrics.py                # Quality metric calculations
│   ├── report_generator.py       # Benchmark evaluation summary generator
│   └── run_eval.py               # CLI runner for evaluation harness
├── public/                        # Static web assets
│   └── favicon.svg                # Application favicon
├── scripts/                       # Automation and utility scripts
│   ├── eval_pipeline.sh          # Pipeline evaluation runner script
│   ├── run_demo.sh               # Local demo launch script
│   ├── seed_database.py          # Sample data generator script
│   └── setup.sh                  # Workspace setup script
├── src/                           # Source application code
│   ├── api/                       # Backend API modules & endpoints
│   │   ├── routes/                # Express / Python API route definitions
│   │   │   ├── __init__.py
│   │   │   ├── chat.py            # RAG chat query endpoints
│   │   │   ├── delta.py           # Revision comparison endpoints
│   │   │   ├── health.py          # Service health check endpoints
│   │   │   └── ingest.py          # Document ingestion endpoints
│   │   ├── __init__.py
│   │   ├── dependencies.py       # API route dependencies
│   │   └── schemas.py             # Request & response data schemas
│   ├── canonical/                 # Bounding-box and entity domain models
│   │   ├── __init__.py
│   │   ├── model.py               # Element taxonomy & bounding box interfaces
│   │   ├── serializer.py          # Serialization helpers
│   │   └── validator.py           # Coordinate & entity validators
│   ├── chat/                      # RAG grounding & multi-LLM engine
│   │   ├── __init__.py
│   │   ├── answer.py              # Answer synthesis with citation grounding
│   │   ├── context.py             # Context window packing & formatting
│   │   ├── grounding.py           # Bounding-box spatial citation mapper
│   │   ├── indexer.py             # Spatial entity indexer
│   │   ├── llm_client.py          # Gemini & fallback provider client
│   │   └── retriever.py           # Spatial & semantic context retriever
│   ├── components/                # React UI components
│   │   ├── DeltaMatrixTable.tsx   # Interactive revision delta matrix table
│   │   ├── EvaluationPanel.tsx    # Evaluation harness & benchmark viewer
│   │   ├── GroundedChatModal.tsx  # Fullscreen grounded chat dialog
│   │   ├── GroundedChatPanel.tsx  # Inline RAG chat panel with spatial citations
│   │   ├── Header.tsx             # Application navigation header
│   │   ├── HomeOverview.tsx       # System overview & metrics dashboard
│   │   ├── IngestionSelector.tsx  # Document pair selector component
│   │   ├── ObservabilityPanel.tsx # System metrics & telemetry dashboard
│   │   ├── PIDCanvasViewer.tsx    # Canvas rendering P&ID drawings & overlays
│   │   └── ResultNavigator.tsx    # Delta filtering and navigation controls
│   ├── delta/                     # Spatial alignment & change detection engine
│   │   ├── __init__.py
│   │   ├── aligner.py             # Multi-factor Hungarian / IoU aligner
│   │   ├── classifier.py          # ADDED/REMOVED/MODIFIED/MOVED classifier
│   │   ├── confidence.py          # Confidence score calculator
│   │   ├── engine.py              # Core delta engine pipeline
│   │   └── report.py              # Structured delta report synthesizer
│   ├── ingest/                    # Document ingestion adapters
│   │   ├── __init__.py
│   │   ├── base.py                # Abstract format adapter interface
│   │   ├── dwg.py                 # CAD DWG/DXF extraction adapter
│   │   ├── pdf_native.py          # Vector PDF text & vector extractor
│   │   ├── pdf_scanned.py         # Scanned image OCR/vector extractor
│   │   └── registry.py            # Format adapter registry
│   ├── observability/             # Telemetry, logging & distributed tracing
│   │   ├── __init__.py
│   │   ├── logger.py              # Structured JSON logger
│   │   ├── metrics.py             # Performance & latency tracker
│   │   ├── middleware.py         # Request tracing middleware
│   │   ├── telemetry.py           # Cost & token tracking
│   │   └── tracer.py              # Span execution tracer
│   ├── utils/                     # Common utility functions
│   │   ├── __init__.py
│   │   ├── cache.py               # Response & computation caching
│   │   ├── file_utils.py          # File path & I/O helpers
│   │   ├── helpers.py             # Generic helper functions
│   │   ├── text_utils.py          # String matching & Levenshtein helpers
│   │   └── validators.py          # Data structure validation helpers
│   ├── App.tsx                    # Main React application component
│   ├── config.py                  # System configuration parameters
│   ├── exceptions.py              # Custom error & exception definitions
│   ├── index.css                  # Global Tailwind CSS styles
│   ├── main.py                    # Python engine entrypoint
│   ├── main.tsx                   # Client-side React entrypoint
│   └── types.ts                   # Global TypeScript types & interfaces
├── tests/                         # Automated test suite
│   ├── integration/               # Integration tests
│   │   ├── test_api.py            # API endpoint integration tests
│   │   └── test_pipeline.py       # End-to-end processing pipeline tests
│   ├── unit/                      # Unit tests
│   │   ├── test_chat.py           # Chat & grounding unit tests
│   │   ├── test_delta.py          # Spatial alignment unit tests
│   │   └── test_ingest.py         # Document ingestion unit tests
│   └── conftest.py                # Pytest configuration & fixtures
├── web/                           # Streamlit / Web UI interface
│   ├── components/                # Streamlit custom UI widgets
│   │   └── ui_components.py
│   ├── pages/                     # Multi-page web dashboard
│   │   ├── 1_Upload.py            # Document upload page
│   │   ├── 2_Delta.py             # Revision comparison page
│   │   └── 3_Chat.py              # Interactive grounded chat page
│   ├── __init__.py
│   └── app.py                     # Streamlit web app entrypoint
├── .env.example                   # Environment variable template
├── .gitignore                     # Git exclusion rules
├── .pre-commit-config.yaml        # Pre-commit hook configurations
├── Dockerfile                     # Multi-stage container build definition
├── Makefile                       # Development & build automation commands
├── README.md                      # Complete system documentation
├── bun.lock                       # Bun lockfile
├── docker-compose.yml             # Local multi-container compose configuration
├── index.html                     # HTML SPA entrypoint
├── metadata.json                  # Application metadata & frame permissions
├── package.json                   # Node.js dependencies and lifecycle scripts
├── pyproject.toml                 # Python project & dependencies configuration
├── server.ts                      # Express full-stack server & API routes
├── setup.py                       # Python package setup script
├── tsconfig.json                  # TypeScript compiler options
├── vercel.json                    # Vercel deployment & routing config
└── vite.config.ts                 # Vite build & development setup
```



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



## Deployment to Google Cloud Run (Free Tier)

Google Cloud Run offers a generous permanent Free Tier that includes:
* 2 million requests per month
* 360,000 GB-seconds of memory and 180,000 vCPU-seconds per month
* 1 GB egress within North America per month

By configuring cold-start scale-to-zero and setting resource allocations within free limits, you can run this application on GCP with zero ongoing monthly costs.

### Prerequisites for GCP Deployment
1. A Google Cloud Platform account with billing enabled (required by GCP to activate free tier resources).
2. Installed and initialized Google Cloud CLI (`gcloud`).



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


