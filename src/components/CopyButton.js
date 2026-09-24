'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="copy-btn"
      title="Copy code"
      aria-label="Copy code"
    >
      {isCopied ? <Check size={16} /> : <Copy size={16} />}
      <style jsx>{`
        .copy-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #a1a1aa;
          padding: 0.4rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
      `}</style>
    </button>
  );
}
