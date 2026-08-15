
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

import { useEffect, useState } from "react";
import {
  sendMessageToOllama,
  uploadKnowledgeFile,
  askRagQuestion,
  generateSuggestedQuestions,
  isSupportedKnowledgeFile,
} from "../services/chat";

export default function ChatbotWidget({ selectedExample }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(selectedExample?.file || null);
  const [uploadMsg, setUploadMsg] = useState(selectedExample?.indexing ? "Indexing example document…" : selectedExample?.uploadResult?.status === "ok" ? `Knowledge indexed successfully (${selectedExample.uploadResult.chunks_loaded} chunks).` : selectedExample?.uploadResult?.error || "");
  const [useRag, setUseRag] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(Boolean(selectedExample?.indexing));
  const [knowledgeReady, setKnowledgeReady] = useState(selectedExample?.uploadResult?.status === "ok");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(Boolean(selectedExample?.indexing));
  const [selectedDocument, setSelectedDocument] = useState(selectedExample?.document || null);
  const [suggestedQuestions, setSuggestedQuestions] = useState(selectedExample?.suggestedQuestions || selectedExample?.document?.suggested_questions || []);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState(() => selectedExample?.file?.type.includes("pdf") ? URL.createObjectURL(selectedExample.file) : "");

  useEffect(() => () => {
    if (documentPreviewUrl) URL.revokeObjectURL(documentPreviewUrl);
  }, [documentPreviewUrl]);

  const selectDocumentFile = (nextFile) => {
    if (documentPreviewUrl) URL.revokeObjectURL(documentPreviewUrl);
    setFile(nextFile);
    setSelectedDocument(null);
    setKnowledgeReady(false);
    setIsGeneratingQuestions(false);
    setUploadMsg("");
    setDocumentPreviewUrl(nextFile?.type.includes("pdf") ? URL.createObjectURL(nextFile) : "");
    if (nextFile) indexDocument(nextFile);
  };

  const indexDocument = async (documentFile) => {
    if (!isSupportedKnowledgeFile(documentFile)) {
      setUploadMsg("Unsupported file. Knowledge upload accepts PDF, TXT, DOC, or DOCX only.");
      return;
    }
    setIsUploading(true);
    setKnowledgeReady(false);
    setIsGeneratingQuestions(false);
    setUploadMsg("Indexing document…");
    const result = await uploadKnowledgeFile(documentFile);
    if (result.status === "ok") {
      setKnowledgeReady(true);
      setIsGeneratingQuestions(true);
      setUploadMsg(`Knowledge indexed successfully (${result.chunks_loaded} chunk${result.chunks_loaded === 1 ? "" : "s"}). Generating example questions…`);
      const generated = await generateSuggestedQuestions();
      setSuggestedQuestions(generated.questions?.length >= 5 ? generated.questions.slice(0, 5) : fallbackQuestions.slice(0, 5));
      setIsGeneratingQuestions(false);
      setUploadMsg(`Knowledge indexed successfully (${result.chunks_loaded} chunk${result.chunks_loaded === 1 ? "" : "s"}).`);
    } else {
      setUploadMsg(result.error || "Upload failed. Check that the backend is running.");
    }
    setIsUploading(false);
  };

  const fallbackQuestions = selectedDocument?.suggested_questions?.length
    ? selectedDocument.suggested_questions
    : [
      "What commonly causes potholes?",
      "Why should damaged road signs be repaired?",
      "What maintenance actions are described?",
      "What main road-safety issue is discussed?",
      "What recommendation can be taken from the document?",
    ];
  const exampleQuestions = useRag ? (suggestedQuestions.length ? suggestedQuestions : fallbackQuestions) : ["What are common causes of road damage?", "How can potholes be repaired?", "What should a road inspection prioritize?"];

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

  return (
    <div className="chat-widget">
      <div className="chat-mode-tabs" role="group" aria-label="Assistant mode">
        <button className={!useRag ? "mode-tab is-active" : "mode-tab"} onClick={() => setUseRag(false)} type="button">Normal Chat</button>
        <button className={useRag ? "mode-tab is-active" : "mode-tab"} onClick={() => setUseRag(true)} type="button">Agentic RAG Knowledge</button>
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
          onChange={(e) => selectDocumentFile(e.target.files[0])}
        />
        <div className="file-actions">
          <label className="file-picker compact" htmlFor="knowledge-file">Upload document</label>
          {isUploading && <span className="input-hint">Indexing…</span>}
        </div>
        {file && <div className="selected-document-card">
          {documentPreviewUrl && <iframe className="manual-pdf-preview" src={`${documentPreviewUrl}#page=1&toolbar=0`} title="Selected PDF first page" />}
          <div><span className="example-label">{file.name.split(".").pop()?.toUpperCase()} · {(file.size / (1024 * 1024)).toFixed(2)} MB</span><p className="selected-file"><span aria-hidden="true">✓</span> {file.name}</p></div>
          <button type="button" className="text-button" onClick={() => selectDocumentFile(null)}>Change / remove document</button>
        </div>}
        <p className="input-hint">Allowed: PDF / TXT / DOC / DOCX. Images are for Detect Damage only.</p>
        {uploadMsg && <p className={`status-message ${isUploading || isGeneratingQuestions ? "status-loading" : uploadMsg.includes("successfully") || uploadMsg.includes("indexed") ? "status-success" : "status-error"}`} role="status" aria-live="polite"><span>{uploadMsg}</span>{(isUploading || isGeneratingQuestions) && <span className="loading-dots" aria-hidden="true"><i /> <i /> <i /></span>}</p>}
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

      <div className="question-prompt-heading">
        <span className="mode-tag">TRY IT NOW</span>
        <p>{isGeneratingQuestions ? "RoadSense AI is generating example questions…" : "Example questions to explore this document."}</p>
      </div>
      <div className="question-examples" aria-label="Example questions">
        {exampleQuestions.map((question) => <button key={question} type="button" disabled={isUploading || isGeneratingQuestions || (useRag && !knowledgeReady)} onClick={() => { setMsg(question); send(question); }}>{question}</button>)}
      </div>
      <div className="chat-compose">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} disabled={isUploading || isGeneratingQuestions || (useRag && !knowledgeReady)} placeholder={isUploading ? "Indexing document…" : isGeneratingQuestions ? "Generating example questions…" : useRag ? "Ask about the uploaded document…" : "Ask the local AI…"} className="chat-input" onKeyDown={(e) => e.key === "Enter" && send()} aria-label="Question" />
        <button onClick={() => send()} className="button button-primary send-button" disabled={isSending || isUploading || isGeneratingQuestions || (useRag && !knowledgeReady)} type="button">{isSending ? "Working…" : isGeneratingQuestions ? "Preparing…" : "Send →"}</button>
      </div>
    </div>
  );
}
