
// ORIGINAL CODE (WORKING)

// import { useState } from "react";
// import { sendMessageToOllama } from "../services/chat";

// export default function ChatbotWidget() {
//   const [msg, setMsg] = useState("");
//   const [chat, setChat] = useState([]);

//   const send = async () => {
//     if (!msg.trim()) return;

//     // Add the user message and placeholder bot message
//     setChat(prev => [...prev, { user: msg, bot: "..." }]);

//     const reply = await sendMessageToOllama(msg);

//     // Replace the bot message with actual model response
//     setChat(prev => {
//       const updated = [...prev];
//       updated[updated.length - 1].bot = reply;
//       return updated;
//     });

//     setMsg("");
//   };

//   return (
//     <div className="chatbox" style={{ textAlign: "center" }}>
//       {chat.map((m, i) => (
//         <div key={i} style={{ marginBottom: "15px" }}>
//           <p><b>You:</b> {m.user}</p>
//           <p><b>AI:</b> {m.bot}</p>
//         </div>
//       ))}

//       <input
//         value={msg}
//         onChange={(e) => setMsg(e.target.value)}
//         placeholder="Ask something..."
//         style={{ width: "250px", padding: "8px" }}
//       />
//       <button onClick={send} style={{ marginLeft: "10px" }}>Send</button>
//     </div>
//   );
// }


// old working code

// import { useState } from "react";
// import { sendMessageToOllama } from "../services/chat";

// export default function ChatbotWidget() {
//   const [msg, setMsg] = useState("");
//   const [chat, setChat] = useState([]);

//   const send = async () => {
//     if (!msg.trim()) return;

//     // Add the user message and placeholder bot message
//     setChat(prev => [...prev, { user: msg, bot: "..." }]);

//     const reply = await sendMessageToOllama(msg);

//     // Replace the bot message with actual model response
//     setChat(prev => {
//       const updated = [...prev];
//       updated[updated.length - 1].bot = reply;
//       return updated;
//     });

//     setMsg("");
//   };

//   return (
//     <div 
//       style={{ textAlign: "center" }}
//     >

//       {/* <h1 className="chat-title">AI Assistant</h1> ⭐ NEW */}

//       <div className="chatbox"> {/* ⭐ NEW container */}
//         {chat.map((m, i) => (
//           <div key={i} style={{ marginBottom: "15px" }}>
//             <p className="msg-user"> {/* ⭐ NEW */}
//               <b>You:</b> {m.user}
//             </p>

//             <p className="msg-ai"> {/* ⭐ NEW */}
//               <b>AI:</b> {m.bot}
//             </p>
//           </div>
//         ))}
//       </div>

//       <input
//         value={msg}
//         onChange={(e) => setMsg(e.target.value)}
//         placeholder="Ask something..."
//         className="chat-input"  // ⭐ NEW
//       />

//       <button 
//         onClick={send}
//         className="chat-btn"  // ⭐ NEW
//       >
//         Send
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import {
  sendMessageToOllama,
  uploadKnowledgeFile,
  askRagQuestion,
  isSupportedKnowledgeFile,
} from "../services/chat";

export default function ChatbotWidget() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [useRag, setUseRag] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [knowledgeReady, setKnowledgeReady] = useState(false);

  const exampleQuestions = useRag
    ? ["What commonly causes potholes?", "Why should damaged road signs be repaired?", "What maintenance actions are described?"]
    : ["What are common causes of road damage?", "How can potholes be repaired?", "What should a road inspection prioritize?"];

  const selectExampleDocument = async () => {
    try {
      const response = await fetch("/examples/rag/roadsense-example-knowledge.txt");
      if (!response.ok) throw new Error("Example document could not be loaded.");
      const blob = await response.blob();
      setFile(new File([blob], "roadsense-example-knowledge.txt", { type: "text/plain" }));
      setUploadMsg("Example document selected. Upload it when you are ready.");
    } catch (error) {
      console.error("Example document selection failed:", error);
      setUploadMsg("Could not load the example document. Check the frontend server.");
    }
  };

  const send = async (question = msg) => {
    if (!question.trim() || isSending) return;

    if (useRag && !knowledgeReady) {
      setChat((prev) => [...prev, { user: question, bot: "Upload and index a document before asking a RAG question." }]);
      setMsg("");
      return;
    }

    setChat((prev) => [...prev, { user: question, bot: "Working…" }]);
    setIsSending(true);

    let replyText = "";

    if (useRag) {
      const reply = await askRagQuestion(question);
      replyText =
        reply.answer || reply.response || reply.error || "No answer available.";
    } else {
      replyText = await sendMessageToOllama(question);
    }

    setChat((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].bot = replyText;
      return updated;
    });

    setMsg("");
    setIsSending(false);
  };

  const uploadFile = async () => {
    if (!file || isUploading) {
      setUploadMsg("Please select a PDF, TXT, DOC, or DOCX file first.");
      return;
    }

    if (!isSupportedKnowledgeFile(file)) {
      setUploadMsg("Unsupported file. Knowledge upload accepts PDF, TXT, DOC, or DOCX only.");
      return;
    }

    setIsUploading(true);
    const result = await uploadKnowledgeFile(file);

    if (result.status === "ok") {
      setKnowledgeReady(true);
      setUploadMsg(`Knowledge indexed successfully (${result.chunks_loaded} chunk${result.chunks_loaded === 1 ? "" : "s"}).`);
    } else {
      setKnowledgeReady(false);
      setUploadMsg(result.error || "Upload failed. Check that the backend is running.");
    }
    setIsUploading(false);
  };

  return (
    <div className="chat-widget">
      <div className="chat-mode-tabs" role="group" aria-label="Assistant mode">
        <button className={!useRag ? "mode-tab is-active" : "mode-tab"} onClick={() => setUseRag(false)} type="button">Normal Chat</button>
        <button className={useRag ? "mode-tab is-active" : "mode-tab"} onClick={() => setUseRag(true)} type="button">RAG Knowledge</button>
      </div>

      {useRag && <div className="knowledge-panel">
        <div>
          <span className="mode-tag">DOCUMENT INPUT</span>
          <h2>Give the assistant something to read.</h2>
          <p>Upload a PDF, TXT, DOC, or DOCX. The backend extracts text, builds embeddings, retrieves relevant chunks, then asks Llama 3.1 for an answer.</p>
        </div>
        <input
          id="knowledge-file"
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={(e) => { setFile(e.target.files[0]); setKnowledgeReady(false); setUploadMsg(""); }}
        />
        <div className="file-actions">
          <label className="file-picker compact" htmlFor="knowledge-file">Choose document</label>
          <button onClick={selectExampleDocument} className="button button-secondary compact-button" type="button">Use example document</button>
          <button onClick={uploadFile} className="button button-primary compact-button" disabled={isUploading} type="button">{isUploading ? "Indexing…" : "Upload & index"}</button>
        </div>
        {file && <p className="selected-file"><span aria-hidden="true">✓</span> {file.name}</p>}
        <p className="input-hint">Allowed: PDF / TXT / DOC / DOCX. Images are for Detect Damage only.</p>
        {uploadMsg && <p className={`status-message ${uploadMsg.includes("successfully") || uploadMsg.includes("indexed") ? "status-success" : "status-error"}`} role="status">{uploadMsg}</p>}
      </div>}

      <div className="chatbox">
        {chat.length === 0 && <div className="empty-chat"><span className="empty-chat-mark">?</span><p>{useRag ? "Upload the example document, then ask a question about road maintenance." : "Ask a road-safety question to start a local Llama 3.1 conversation."}</p></div>}
        {chat.map((m, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <p className="msg-user">
              <b>You:</b> {m.user}
            </p>
            <p className="msg-ai">
              <b>AI:</b> {m.bot}
            </p>
          </div>
        ))}
      </div>

      <div className="question-examples" aria-label="Example questions">
        {exampleQuestions.map((question) => <button key={question} type="button" onClick={() => { setMsg(question); send(question); }}>{question}</button>)}
      </div>
      <div className="chat-compose">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={useRag ? "Ask about the uploaded document…" : "Ask the local AI…"} className="chat-input" onKeyDown={(e) => e.key === "Enter" && send()} aria-label="Question" />
        <button onClick={() => send()} className="button button-primary send-button" disabled={isSending} type="button">{isSending ? "Working…" : "Send →"}</button>
      </div>
    </div>
  );
}
