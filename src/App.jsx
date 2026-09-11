import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AIGenerator from './components/AIGenerator';
import ExportPanel from './components/ExportPanel';
import { LayoutDashboard, Sparkles, Printer } from 'lucide-react';

function App() {
  const isPublicMode = import.meta.env.PROD;
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-title">
          F<span>1</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          Colección Andy Hansen
        </p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '12px 18px', textAlign: 'left' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Catálogo Showroom
          </button>
          
          {!isPublicMode && (
            <>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
              
              <button 
                className={`btn ${activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '12px 18px', textAlign: 'left' }}
                onClick={() => setActiveTab('ai')}
              >
                <Sparkles size={18} /> Agente IA
              </button>
              
              <button 
                className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '12px 18px', textAlign: 'left' }}
                onClick={() => setActiveTab('export')}
              >
                <Printer size={18} /> Exportar Word
              </button>
            </>
          )}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <strong>51 Réplicas F1 (1:43)</strong><br />
            1950 — 2025
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {!isPublicMode && activeTab === 'ai' && <AIGenerator onSaveSuccess={() => setActiveTab('dashboard')} />}
        {!isPublicMode && activeTab === 'export' && <ExportPanel />}
      </main>
    </div>
  );
}

export default App;
