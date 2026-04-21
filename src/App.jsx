import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AIGenerator from './components/AIGenerator';
import ExportPanel from './components/ExportPanel';
import MagazineViewer from './components/MagazineViewer';
import { LayoutDashboard, Sparkles, Printer, BookOpen } from 'lucide-react';

function App() {
  // If the app is built for production (deployed to Git), default to reader mode
  const isPublicMode = import.meta.env.PROD;
  const [activeTab, setActiveTab] = useState(isPublicMode ? 'magazine' : 'dashboard');

  if (isPublicMode) {
    return (
      <div style={{ height: '100vh', width: '100vw', padding: '0', backgroundColor: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>
        <MagazineViewer />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-title">
          F<span>1</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Colección Expert System
        </p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '12px 20px' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Mi Colección
          </button>
          
          <button 
            className={`btn ${activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '12px 20px' }}
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles size={18} /> Agente IA
          </button>
          
          <button 
            className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '12px 20px' }}
            onClick={() => setActiveTab('export')}
          >
            <Printer size={18} /> Exportar Word
          </button>

          <button 
            className={`btn ${activeTab === 'magazine' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '12px 20px' }}
            onClick={() => setActiveTab('magazine')}
          >
            <BookOpen size={18} /> Visor Revista
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'ai' && <AIGenerator onSaveSuccess={() => setActiveTab('dashboard')} />}
        {activeTab === 'export' && <ExportPanel />}
        {activeTab === 'magazine' && <MagazineViewer />}
      </main>
    </div>
  );
}

export default App;
