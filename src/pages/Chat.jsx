// ORIGINAL CODE WORKING
// import ChatbotWidget from "../components/ChatbotWidget";

// export default function Chat() {
//   return (
//     <div className="page">
//       <h1>AI Assistant</h1>
//       <ChatbotWidget />
//     </div>
//   );
// }

import ChatbotWidget from "../components/ChatbotWidget";
import DocumentExampleGallery from "../components/DocumentExampleGallery";
import { useState } from "react";
import { generateSuggestedQuestions, uploadKnowledgeFile } from "../services/chat";


export default function Chat() {
  const [selectedExample, setSelectedExample] = useState(null);

  const handleExampleDocument = async (document, file) => {
    setSelectedExample({ document, file, indexing: true });
    const uploadResult = await uploadKnowledgeFile(file);
    const generated = uploadResult.status === "ok" ? await generateSuggestedQuestions() : { questions: [] };
    setSelectedExample({ document, file, indexing: false, uploadResult, suggestedQuestions: generated.questions?.length >= 5 ? generated.questions.slice(0, 5) : document.suggested_questions || [] });
  };

  return (
    <div className="page page-tool">
      <section className="page-intro">
        <div className="eyebrow">03 / LOCAL AI ASSISTANT</div>
        <h1>Ask the road<br /><em>better questions.</em></h1>
        <p>Choose a direct local conversation or ground your question in a document you provide. The two modes are separate by design.</p>
      </section>
      <DocumentExampleGallery onUseDocument={handleExampleDocument} />
      <div className="chat-layout">
        <aside className="mode-guide">
          <div className="mode-guide-block">
            <span className="mode-tag">NORMAL CHAT</span>
            <h2>Open conversation</h2>
            <p>User question → Flask → Ollama / Llama 3.1 → response</p>
            <small>No document upload required. Ollama must be running locally.</small>
          </div>
          <div className="mode-guide-block mode-guide-rag">
            <span className="mode-tag">RAG KNOWLEDGE CHAT</span>
            <h2>Document-grounded answers</h2>
            <p>Document → chunks → embeddings → FAISS → Llama 3.1</p>
            <small>Upload PDF, TXT, DOC, or DOCX, then ask about its contents.</small>
          </div>
        </aside>
        <div className="tool-card chat-card"><ChatbotWidget key={`${selectedExample?.file?.name || "empty"}-${selectedExample?.indexing ? "indexing" : "ready"}`} selectedExample={selectedExample} /></div>
      </div>
    </div>
  );
}
