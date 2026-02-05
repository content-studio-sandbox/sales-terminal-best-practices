import React from "react";
import { ChevronDown, ChevronUp } from "@carbon/icons-react";

interface ExerciseCardProps {
  id: string;
  title: string;
  scenario?: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  special?: boolean; // For special exercises like Zsh installation
}

export default function ExerciseCard({
  id,
  title,
  scenario,
  isExpanded,
  onToggle,
  children,
  special = false
}: ExerciseCardProps) {
  return (
    <div
      onClick={() => onToggle(id)}
      style={{
        backgroundColor: "#ffffff",
        padding: "1.25rem",
        borderRadius: "4px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...(special && { borderLeft: "4px solid #24a148" })
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#0f62fe";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "#e0e0e0";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: special ? "#24a148" : "#0f62fe" }}>
            {title}
          </h4>
          {scenario && (
            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
              {scenario}
            </p>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={20} style={{ color: "#0f62fe", flexShrink: 0, marginLeft: "1rem" }} />
        ) : (
          <ChevronDown size={20} style={{ color: "#0f62fe", flexShrink: 0, marginLeft: "1rem" }} />
        )}
      </div>
      
      {isExpanded && (
        <div style={{ 
          marginTop: scenario ? "0" : "0.75rem",
          fontSize: "0.875rem", 
          lineHeight: 1.7, 
          color: "#161616" 
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Made with Bob
