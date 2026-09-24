'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, ChevronRight, Hash, Menu, X } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ patterns }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Load progress from localStorage on mount
    const savedProgress = localStorage.getItem('dsa-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    
    const handleStorageChange = () => {
      const updatedProgress = localStorage.getItem('dsa-progress');
      if (updatedProgress) {
        setProgress(JSON.parse(updatedProgress));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dsa-progress-update', handleStorageChange);
    
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
      
      if (document.activeElement?.tagName === 'INPUT') return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIdx = patterns.findIndex(p => `/${p.id}` === pathname);
        if (currentIdx !== -1) {
          if (e.key === 'ArrowLeft' && currentIdx > 0) {
            window.location.href = `/${patterns[currentIdx - 1].id}`;
          } else if (e.key === 'ArrowRight' && currentIdx < patterns.length - 1) {
            window.location.href = `/${patterns[currentIdx + 1].id}`;
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dsa-progress-update', handleStorageChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pathname, patterns]);

  const filteredPatterns = patterns.filter(pattern => 
    pattern.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <div className="mobile-brand">
          <div className="brand-icon small">
            <Hash size={16} strokeWidth={2.5} />
          </div>
          <h2>DSA Vault</h2>
        </div>
        <button 
          className="menu-btn" 
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar Content */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Hash size={18} strokeWidth={2.5} />
            </div>
            <h2>DSA Vault</h2>
            <button 
              className="close-btn mobile-only" 
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="search-container">
            <span className="search-icon-wrapper">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search patterns... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {filteredPatterns.map(pattern => {
              const isActive = pathname === `/${pattern.id}`;
              const isReviewed = progress[pattern.id] === 'reviewed';
              const needsPractice = progress[pattern.id] === 'practice';
              
              return (
                <li key={pattern.id}>
                  <Link 
                    href={`/${pattern.id}`} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className="nav-content">
                      <span className="nav-text">{pattern.title}</span>
                      {isReviewed && <span className="status-dot reviewed" title="Reviewed"></span>}
                      {needsPractice && <span className="status-dot practice" title="Needs Practice"></span>}
                    </div>
                    <span className={`chevron-wrapper ${isActive ? 'active-chevron' : ''}`}>
                      <ChevronRight size={16} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {filteredPatterns.length === 0 && (
            <div className="no-results">
              <div className="empty-icon">🔍</div>
              <p>No patterns found for "{searchQuery}"</p>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
