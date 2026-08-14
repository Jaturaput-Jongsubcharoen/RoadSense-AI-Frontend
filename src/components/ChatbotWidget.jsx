
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
import { sendMessageToOllama } from "../services/chat";
import { uploadKnowledgeFile, askRagQuestion } from "../services/chat";

export default function ChatbotWidget() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [useRag, setUseRag] = useState(true); // 🔄 toggle between RAG or Normal Chat

  const send = async () => {
    if (!msg.trim()) return;

    setChat((prev) => [...prev, { user: msg, bot: "..." }]);

    let replyText = "";

    if (useRag) {
      // 🧠 RAG QUERY
      const reply = await askRagQuestion(msg);
      replyText =
        reply.answer || reply.response || reply.error || "No answer available.";
    } else {
      // 💬 Normal LLM Chat
      replyText = await sendMessageToOllama(msg);
    }

    setChat((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].bot = replyText;
      return updated;
    });

    setMsg("");
  };

  const uploadFile = async () => {
    if (!file) {
      setUploadMsg("⚠ Please select a file first.");
      return;
    }

    const result = await uploadKnowledgeFile(file);

    if (result.status === "ok") {
      setUploadMsg("✅ Knowledge uploaded successfully!");
    } else {
      setUploadMsg("❌ Upload failed: " + (result.error || "Unknown error"));
    }
  };

  return (
    <div style={{ textAlign: "center" }}>

      {/* 📁 Upload Section */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginRight: "10px" }}
        />
        <button onClick={uploadFile} className="chat-btn">
          Upload Knowledge 📄
        </button>
        {uploadMsg && (
          <p style={{ fontSize: "14px", marginTop: "5px" }}>{uploadMsg}</p>
        )}
      </div>

      {/* 🔄 Toggle RAG / Normal */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Mode:
        </label>
        <select
          value={useRag ? "rag" : "normal"}
          onChange={(e) => setUseRag(e.target.value === "rag")}
          style={{
            padding: "5px",
            borderRadius: "5px",
            background: "#222",
            color: "white",
            border: "1px solid #333",
          }}
        >
          <option value="rag">📚 RAG Knowledge Chat</option>
          <option value="normal">🤖 Normal LLM Chat</option>
        </select>
      </div>

      {/* 💬 Message List */}
      <div className="chatbox">
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

      {/* 📝 Input + Send */}
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Ask something..."
        className="chat-input"
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button onClick={send} className="chat-btn">
        Send
      </button>
    </div>
  );
}
