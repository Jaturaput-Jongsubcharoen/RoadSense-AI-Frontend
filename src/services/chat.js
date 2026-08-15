// import axios from "axios";

// export async function sendMessageToGemini(text) {
//   const res = await axios.post("http://127.0.0.1:5000/api/genai/chat", {
//     message: text
//   });
//   return res.data.reply;
// }

// old working code

// export async function sendMessageToOllama(message) {
//   try {
//     const res = await fetch("http://localhost:5000/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });

//     const data = await res.json();
//     return data.response || "No response.";
//   } catch (err) {
//     return "Error contacting server.";
//   }
// }

import { API_URL } from "./config";

const DOCUMENT_EXTENSIONS = [".pdf", ".txt", ".doc", ".docx"];

export function isSupportedKnowledgeFile(file) {
  const filename = file?.name?.toLowerCase() || "";
  return DOCUMENT_EXTENSIONS.some((extension) => filename.endsWith(extension));
}

async function readJsonResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Backend request failed.");
  }
  return data;
}

// -------- NORMAL CHAT MODE ---------
export async function sendMessageToOllama(message) {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await readJsonResponse(response);
    return data.response || "No response from the local AI service.";
  } catch (error) {
    console.error("Normal chat request failed:", error);
    return error.message === "Failed to fetch"
      ? "Cannot reach the Flask backend. Start the backend and try again."
      : error.message;
  }
}

// --------- RAG FILE UPLOAD ---------
export async function uploadKnowledgeFile(file) {
  if (!isSupportedKnowledgeFile(file)) {
    return {
      status: "error",
      error: "Unsupported document type. Use PDF, TXT, DOC, or DOCX.",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/rag/upload`, {
      method: "POST",
      body: formData,
    });

    return await readJsonResponse(response);
  } catch (error) {
    console.error("Knowledge upload failed:", error);
    return { status: "error", error: error.message };
  }
}

// --------- RAG ASK QUESTION ---------
export async function askRagQuestion(question) {
  try {
    const response = await fetch(`${API_URL}/api/rag/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    return await readJsonResponse(response);
  } catch (error) {
    console.error("RAG question failed:", error);
    return { error: error.message };
  }
}

export async function generateSuggestedQuestions() {
  try {
    const response = await fetch(`${API_URL}/api/rag/questions`, { method: "POST" });
    return await readJsonResponse(response);
  } catch (error) {
    console.error("Suggested question generation failed:", error);
    return { questions: [], error: error.message };
  }
}
