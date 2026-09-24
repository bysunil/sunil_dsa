'use client';

import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import './syntax.css';
import CopyButton from './CopyButton';
import { createRoot } from 'react-dom/client';
import { ExternalLink, CheckCircle, CircleDashed } from 'lucide-react';

export default function TemplateViewer({ patternData }) {
  const contentRef = useRef(null);
  const [status, setStatus] = useState('unreviewed'); // 'unreviewed' | 'reviewed' | 'practice'

  useEffect(() => {
    // Apply syntax highlighting
    if (contentRef.current) {
      const blocks = contentRef.current.querySelectorAll('pre code');
      blocks.forEach((block) => {
        hljs.highlightElement(block);
        
        // Add copy button to pre blocks
        const pre = block.parentNode;
        if (pre && pre.tagName === 'PRE' && !pre.querySelector('.copy-btn')) {
          pre.style.position = 'relative';
          
          const btnContainer = document.createElement('div');
          pre.appendChild(btnContainer);
          
          const root = createRoot(btnContainer);
          root.render(<CopyButton text={block.innerText} />);
        }
      });
    }
  }, [patternData]);

  useEffect(() => {
    // Load progress status
    const savedProgress = localStorage.getItem('dsa-progress');
    if (savedProgress) {
      const progressObj = JSON.parse(savedProgress);
      if (progressObj[patternData.id]) {
        setStatus(progressObj[patternData.id]);
      } else {
        setStatus('unreviewed');
      }
    } else {
      setStatus('unreviewed');
    }
  }, [patternData.id]);

  const toggleStatus = (newStatus) => {
    const currentStatus = status === newStatus ? 'unreviewed' : newStatus;
    setStatus(currentStatus);
    
    // Save to localStorage
    const savedProgress = localStorage.getItem('dsa-progress');
    const progressObj = savedProgress ? JSON.parse(savedProgress) : {};
    
    if (currentStatus === 'unreviewed') {
      delete progressObj[patternData.id];
    } else {
      progressObj[patternData.id] = currentStatus;
    }
    
    localStorage.setItem('dsa-progress', JSON.stringify(progressObj));
    // Dispatch event so sidebar can update
    window.dispatchEvent(new Event('dsa-progress-update'));
  };

  return (
    <div className="template-viewer">
      <div className="header glass-panel">
        <div className="header-top">
          <h1>{patternData.title}</h1>
          <div className="status-controls">
            <button 
              className={`status-btn reviewed ${status === 'reviewed' ? 'active' : ''}`}
              onClick={() => toggleStatus('reviewed')}
            >
              <CheckCircle size={16} className="mr-2" />
              Reviewed
            </button>
            <button 
              className={`status-btn practice ${status === 'practice' ? 'active' : ''}`}
              onClick={() => toggleStatus('practice')}
            >
              <CircleDashed size={16} className="mr-2" />
              Needs Practice
            </button>
          </div>
        </div>
        
        {patternData.related_problems && patternData.related_problems.length > 0 && (
          <div className="related-problems">
            <h3>Related Problems</h3>
            <ul>
              {patternData.related_problems.map((prob, idx) => (
                <li key={idx}>
                  <a href={prob.url} target="_blank" rel="noopener noreferrer" className="problem-link">
                    {prob.name} <ExternalLink size={14} className="ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div 
        className="markdown-content" 
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: patternData.contentHtml }} 
      />

      <style jsx>{`
        .template-viewer {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .header {
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        h1 {
          margin: 0;
          color: var(--foreground);
        }
        
        .status-controls {
          display: flex;
          gap: 0.5rem;
        }
        
        .status-btn {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 1px solid var(--panel-border);
          background: var(--panel-bg);
          color: var(--text-muted);
          font-family: inherit;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .mr-2 { margin-right: 0.5rem; }
        .ml-1 { margin-left: 0.25rem; }
        
        .status-btn:hover {
          background: var(--panel-hover);
          color: var(--foreground);
        }
        
        .status-btn.reviewed.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: #10b981;
          color: #10b981;
        }
        
        .status-btn.practice.active {
          background: rgba(245, 158, 11, 0.15);
          border-color: #f59e0b;
          color: #f59e0b;
        }
        
        .related-problems {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--panel-border);
        }
        
        .related-problems h3 {
          font-size: 1rem;
          margin-top: 0;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .related-problems ul {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .problem-link {
          display: flex;
          align-items: center;
          background: var(--active-bg);
          color: var(--accent);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.9rem;
          border: 1px solid var(--panel-border);
          transition: all 0.2s ease;
        }
        
        .problem-link:hover {
          background: var(--panel-hover);
          transform: translateY(-1px);
        }
        
        .markdown-content {
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}
