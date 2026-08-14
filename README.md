# RoadSense AI Frontend

RoadSense AI is an intelligent road issue detection and RAG AI assistant platform. This repository contains the separated React/Vite frontend for the platform. It provides the browser interface for uploading road images, viewing model predictions, chatting with a local AI assistant, and uploading documents for retrieval-augmented question answering.

The frontend is a portfolio-oriented separation of the frontend component from a COMP258 educational team project originally developed at Centennial College. The original project was developed by a team; this repository does not present that team work as individual work. It is separated here to make the frontend easier to review and maintain.

## Project Overview

RoadSense AI addresses two related road-information workflows:

- Road issue identification: a user uploads an image and the Flask backend uses a trained image-classification model to return a predicted road issue and confidence value.
- Road-information assistance: a user can chat with a local Llama 3.1 service, or upload a PDF, TXT, or DOCX document and ask questions grounded in the uploaded content.

This repository contains the client application only. The Flask API, TensorFlow model, embedding model, FAISS index, and Ollama runtime remain part of the separate backend and ML components.

## Key Features

- React single-page interface built with Vite.
- Navigation between Home, Detect Damage, Prediction Result, and AI Chat views.
- Road image upload through `POST /api/predict`.
- Display of the predicted class, confidence, and backend error responses.
- Local AI chat through `POST /api/chat`.
- Document upload for PDF, TXT, and DOCX files through `POST /api/rag/upload`.
- RAG question answering through `POST /api/rag/ask`.
- Chat mode selection between RAG Knowledge Chat and Normal LLM Chat.
- Enter-key submission for chat messages and in-page conversation history.

## How the Platform Works

```text
User
	-> React/Vite frontend
	-> Flask REST API
	-> TensorFlow/EfficientNetB0 model or RAG/Ollama services
	-> JSON API response
	-> React result or chat interface
```

For image analysis, the frontend sends the selected file as multipart form data. The Flask API passes it to the road issue classifier and returns `class_name` and `confidence` values, which the frontend displays on the result view.

For the assistant, normal chat sends a message to the Flask API, which calls the local Ollama service. In RAG mode, the user first uploads a document. The backend extracts and chunks the document, creates Sentence Transformer embeddings, stores them in a FAISS index, retrieves relevant chunks for a question, and asks the local Ollama Llama 3.1 model to answer using that context.

## System Architecture

The technologies below describe the complete RoadSense AI platform. Only the React/Vite, Axios, JavaScript, HTML, and CSS portion is included in this repository.

```mermaid
flowchart LR
		U[User] --> F[React/Vite frontend]
		F -->|Axios or fetch| A[Flask REST API]
		A --> P[TensorFlow EfficientNetB0 classifier]
		A --> C[Normal chat service]
		A --> R[RAG service]
		R --> S[Sentence Transformers\nall-MiniLM-L6-v2]
		R --> Q[FAISS vector index]
		C --> O[Ollama\nLlama 3.1]
		R --> O
		P --> A
		O --> A
		A --> F
```

## Frontend Architecture

The frontend is a small React single-page application. `src/main.jsx` mounts the app and supplies `BrowserRouter`; `src/App.jsx` defines the application routes and renders the navigation component.

```text
RoadSense-AI-Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── ChatbotWidget.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── Navbar.jsx
│   │   └── PredictionResult.jsx
│   ├── pages/
│   │   ├── Chat.jsx
│   │   ├── Detect.jsx
│   │   ├── Home.jsx
│   │   └── PredictResult.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── chat.js
│   │   ├── chatbot.js
│   │   └── config.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

The page components compose the user views, while the components handle navigation, image selection, prediction display, and chat interactions. State is held locally with React `useState`; prediction data is passed to the result route through React Router location state. The service modules contain the chat and RAG request functions. The current source also includes an Axios instance and older chatbot/config helpers that are not used by the active image and chat flows.

Styling is supplied by `src/App.css`, including the page cards, fixed navigation panel, upload controls, and chat messages. There is no separate frontend state-management library or frontend database.

## Routes

| Frontend route | View | Purpose |
| --- | --- | --- |
| `/` | Home | Introductory road issue detection view |
| `/detect` | Detect | Select an image and submit it for prediction |
| `/result` | PredictionResult | Show the prediction returned by the backend |
| `/chat` | Chat | Use normal chat or RAG document-assisted chat |

## Backend/API Integration

The active frontend calls these Flask API endpoints:

| Method | Endpoint | Frontend use |
| --- | --- | --- |
| `POST` | `/api/predict` | Sends an image in a multipart `image` field and receives prediction data |
| `POST` | `/api/chat` | Sends `{ "message": "..." }` for normal local AI chat |
| `POST` | `/api/rag/upload` | Sends a document in a multipart `file` field for indexing |
| `POST` | `/api/rag/ask` | Sends `{ "question": "..." }` and receives an RAG answer |

The original Flask application also exposes `GET /api/health`, but the active frontend does not call it.

At present, the copied frontend uses the source implementation's local backend URLs directly: image prediction uses `http://127.0.0.1:5000`, while chat and RAG requests use `http://localhost:5000`. No `.env` file or Vite environment-variable integration exists in the source frontend. For a different backend host or a deployed frontend, these request URLs must be configured in the frontend code or replaced with an environment-based configuration as a separate change.

## Technology Stack

### This repository

- React 19
- React DOM
- React Router DOM
- Vite
- Axios
- JavaScript and JSX
- HTML and CSS
- ESLint

### Overall RoadSense AI platform

- Python and Flask for the REST API
- TensorFlow with an EfficientNetB0 image-classification model
- Sentence Transformers using `all-MiniLM-L6-v2` for document embeddings
- FAISS for the in-memory vector index used by the RAG service
- Ollama running the Llama 3.1 local language model

## Getting Started

### Prerequisites

- Node.js and npm compatible with the Vite version in `package.json` (Node.js 18 or newer is a reasonable baseline from the original project documentation).
- A running RoadSense AI Flask backend at the URLs used by the frontend.
- For AI responses, the backend's local Ollama service and the `llama3.1` model must also be available.
- For image predictions and RAG responses, the backend must have its own Python dependencies, trained model, embedding model, and FAISS setup installed.

### Install and run the frontend

```bash
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. The browser UI can render without the backend, but image detection, normal chat, document upload, and RAG questions require the Flask API to be running on port `5000`.

Useful project commands:

```bash
npm run build   # Create a production build in dist/
npm run lint    # Run ESLint
npm run preview # Preview the production build locally
```

## Running the Complete Platform

This repository is frontend-only. Run the separate Flask backend from the original platform with its Python dependencies and make sure its ML and RAG services are available. The original backend documentation describes starting the API with `python app.py`; coordinate the backend working directory and model/runtime setup separately because no backend or ML files are included here.

No maintained backend repository link is recorded in this separated repository. Do not assume that the frontend alone provides prediction or AI services.

## Original Project / Attribution

RoadSense AI is a reorganized portfolio version of the AsphaltAegis COMP258 educational team project developed at Centennial College. The original project documentation credits the team members Numaan Baig, Anmol, Raj Patel, Juan, Jaturaput, Daniela, and Abdallah. This repository separates the React frontend for portfolio presentation and maintainability while preserving the distinction between team-developed source work and individual contributions.

The original project was documented for educational use and was not presented as verified production software. That limitation applies to the platform context described here.

## Additional Documentation

The source project contains broader backend, ML, model-card, and architecture documentation. Those materials are intentionally not copied into this frontend repository because they describe components that remain outside this codebase. The API contract summarized above is derived from the active frontend request code and the original Flask routes.
