import React, { useState } from 'react';
import { exportWord, exportIndex } from '../api';
import { FileText, List, CheckCircle, AlertCircle } from 'lucide-react';

export default function ExportPanel() {
  const [loadingWord, setLoadingWord] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleExportWord = async () => {
    setLoadingWord(true);
    setMsg('');
    setError('');
    try {
      const { filename } = await exportWord();
      setMsg(`¡Documento ${filename} generado con éxito en el directorio raíz!`);
    } catch (err) {
      setError('Error al generar la ficha Word.');
    } finally {
      setLoadingWord(false);
    }
  };

  const handleExportIndex = async () => {
    setLoadingIndex(true);
    setMsg('');
    setError('');
    try {
      const { filename } = await exportIndex();
      setMsg(`¡Índice ${filename} generado con éxito!`);
    } catch (err) {
      setError('Error al generar el índice.');
    } finally {
      setLoadingIndex(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2>Exportar Documentos</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Genera los archivos .docx para impresión manteniendo el formato A4 original.
      </p>

      <div className="grid-cols-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%' }}>
            <FileText size={48} color="var(--accent-secondary)" />
          </div>
          <div>
            <h3>Ficha Individual</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Genera el archivo Word del último auto agregado al Excel.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleExportWord} disabled={loadingWord} style={{ width: '100%', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
            {loadingWord ? 'Generando...' : 'Generar Ficha Word'}
          </button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%' }}>
            <List size={48} color="var(--accent-primary)" />
          </div>
          <div>
            <h3>Índice Completo</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Genera el documento con el índice de todos los autos.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleExportIndex} disabled={loadingIndex} style={{ width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
            {loadingIndex ? 'Generando...' : 'Generar Índice'}
          </button>
        </div>
      </div>

      {msg && (
        <div className="card animate-fade-in" style={{ marginTop: '2rem', background: 'rgba(0, 210, 106, 0.1)', borderColor: 'var(--accent-success)', color: 'var(--accent-success)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CheckCircle /> {msg}
        </div>
      )}

      {error && (
        <div className="card animate-fade-in" style={{ marginTop: '2rem', background: 'rgba(244, 71, 71, 0.1)', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AlertCircle /> {error}
        </div>
      )}
    </div>
  );
}
