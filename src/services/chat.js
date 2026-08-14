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

// -------- NORMAL CHAT MODE ---------
export async function sendMessageToOllama(message) {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.response;
}

// --------- RAG FILE UPLOAD ---------
export async function uploadKnowledgeFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:5000/api/rag/upload", {
    method: "POST",
    body: formData,
  });

  return res.json();
}

// --------- RAG ASK QUESTION ---------
export async function askRagQuestion(question) {
  const res = await fetch("http://localhost:5000/api/rag/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  return res.json();
}
