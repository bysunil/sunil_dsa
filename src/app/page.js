import Link from 'next/link';
import { getSortedPatternsData } from '@/lib/markdown';
import { BookOpen, Code, Trophy } from 'lucide-react';
import './page.css';

export default function Home() {
  const patterns = getSortedPatternsData();
  
  return (
    <div className="welcome-container">
      <div className="hero glass-panel">
        <h1 className="gradient-text">Welcome to DSA Vault</h1>
        <p className="subtitle">Your ultimate revision companion for coding interviews.</p>
        
        <div className="features">
          <div className="feature">
            <div className="icon-wrapper"><BookOpen size={24} /></div>
            <h3>Structured Learning</h3>
            <p>Templates organized by patterns to build intuition.</p>
          </div>
          <div className="feature">
            <div className="icon-wrapper"><Code size={24} /></div>
            <h3>Ready-to-use Code</h3>
            <p>Python 3 templates with syntax highlighting and easy copy.</p>
          </div>
          <div className="feature">
            <div className="icon-wrapper"><Trophy size={24} /></div>
            <h3>Track Progress</h3>
            <p>Mark patterns as reviewed or needing practice.</p>
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Get Started</h2>
          <p>Select a pattern from the sidebar, or jump straight in:</p>
          {patterns.length > 0 && (
            <Link href={`/${patterns[0].id}`} className="cta-btn">
              Start with {patterns[0].title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
