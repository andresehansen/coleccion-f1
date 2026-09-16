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
        <div className="sidebar-brand">
          <div className="brand-title">
            F<span>1</span>
          </div>
          <p className="brand-subtitle">
            Colección Andy Hansen
          </p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Catálogo Showroom
          </button>
          
          {!isPublicMode && (
            <>
              <div className="nav-divider" />
              
              <button 
                className={`btn ${activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('ai')}
              >
                <Sparkles size={18} /> Agente IA
              </button>
              
              <button 
                className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('export')}
              >
                <Printer size={18} /> Exportar Word
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">
            <strong>53 Réplicas F1 (1:43)</strong><br />
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
