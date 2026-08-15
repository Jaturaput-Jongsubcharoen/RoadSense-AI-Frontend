const flowDefinitions = {
  classification: {
    label: "IMAGE FLOW",
    nodes: [
      ["IMG", "Image"],
      ["224", "Preprocess"],
      ["AI", "EfficientNetB0"],
      ["7×", "Categories"],
      ["OK", "Result"],
    ],
  },
  assistant: {
    label: "ASSISTANT FLOW",
    modes: [
      {
        label: "NORMAL CHAT",
        nodes: [["?", "Question"], ["AI", "Llama 3.1"], ["✓", "Answer"]],
      },
      {
        label: "AGENTIC RAG",
        nodes: [
          ["DOC", "Document"],
          ["CH", "Chunks"],
          ["V", "Embeddings"],
          ["F", "FAISS"],
          ["AI", "Llama 3.1"],
          ["✓", "Grounded"],
        ],
      },
    ],
  },
};

function FlowNodes({ nodes }) {
  return (
    <div className="process-nodes">
      {nodes.map(([icon, label], index) => (
        <div className="process-step" key={`${label}-${index}`}>
          <span className="process-node">{icon}</span>
          <span className="process-label">{label}</span>
          {index < nodes.length - 1 && <span className="process-connector" aria-hidden="true"><span /></span>}
        </div>
      ))}
    </div>
  );
}

export default function ProcessFlow({ type }) {
  const definition = flowDefinitions[type];
  const modes = definition.modes || [{ label: definition.label, nodes: definition.nodes }];

  return (
    <div className={`process-flow process-flow-${type}`} aria-hidden="true">
      <div className="process-mode-track">
        {modes.map((mode) => (
          <div className="process-mode" key={mode.label}>
            <span className="process-mode-label">{mode.label}</span>
            <FlowNodes nodes={mode.nodes} />
          </div>
        ))}
      </div>
    </div>
  );
}
