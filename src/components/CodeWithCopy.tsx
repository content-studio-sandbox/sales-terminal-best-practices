import React from 'react';
import { CopyButton } from './CopyButton';

interface CodeWithCopyProps {
  code: string;
  description?: string;
  block?: boolean;
}

export const CodeWithCopy: React.FC<CodeWithCopyProps> = ({ code, description, block = false }) => {
  if (block) {
    return (
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
          <code style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "3px 6px", 
            borderRadius: "3px", 
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.75rem",
            flex: 1,
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word"
          }}>
            {code}
          </code>
          <CopyButton text={code} />
        </div>
        {description && (
          <span style={{ color: "#525252", fontSize: "0.875rem", display: "block", marginTop: "0.25rem" }}>
            {description}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "0.5rem", display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <code style={{ 
        backgroundColor: "#f4f4f4", 
        padding: "3px 6px", 
        borderRadius: "3px", 
        fontFamily: "'IBM Plex Mono', monospace"
      }}>
        {code}
      </code>
      <CopyButton text={code} />
      {description && (
        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ {description}</span>
      )}
    </div>
  );
};

// Made with Bob
