import React, { useState } from 'react';
import { Copy, Checkmark } from '@carbon/icons-react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, size = 'sm' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent card
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem',
        backgroundColor: copied ? '#e8f5e9' : 'transparent',
        border: '1px solid',
        borderColor: copied ? '#24a148' : '#e0e0e0',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginLeft: '0.5rem',
        verticalAlign: 'middle'
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = '#f4f4f4';
          e.currentTarget.style.borderColor = '#0f62fe';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = '#e0e0e0';
        }
      }}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      {copied ? (
        <Checkmark size={iconSize} style={{ color: '#24a148' }} />
      ) : (
        <Copy size={iconSize} style={{ color: '#525252' }} />
      )}
    </button>
  );
};

// Made with Bob
