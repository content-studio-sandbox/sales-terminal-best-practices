import React from "react";

interface VisualDiagramProps {
  title: string;
  content: string;
  type?: "flow" | "architecture" | "concept";
}

export default function VisualDiagram({ title, content, type = "concept" }: VisualDiagramProps) {
  return (
    <div style={{
      backgroundColor: "#f4f4f4",
      padding: "2rem",
      borderRadius: "8px",
      border: "2px solid #0f62fe",
      marginBottom: "2rem"
    }}>
      <h4 style={{
        margin: "0 0 1rem 0",
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "#0f62fe",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        📊 {title}
      </h4>
      <pre style={{
        backgroundColor: "#ffffff",
        padding: "1.5rem",
        borderRadius: "4px",
        border: "1px solid #e0e0e0",
        fontSize: "0.875rem",
        fontFamily: "'IBM Plex Mono', monospace",
        overflow: "auto",
        lineHeight: 1.6,
        margin: 0,
        color: "#161616"
      }}>
        {content}
      </pre>
    </div>
  );
}