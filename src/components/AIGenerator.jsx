import React, { useState } from 'react';
import { generateIA, saveCar } from '../api';
import { Sparkles, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function AIGenerator({ onSaveSuccess }) {
  const [modelo, setModelo] = useState('');
  const [piloto, setPiloto] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!modelo || !piloto) return;
    
    setLoading(true);
    setError('');
    setGeneratedData(null);
    setSuccessMsg('');
    
    try {
      const data = await generateIA(modelo, piloto);
      setGeneratedData(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error conectando con la IA. ¿Configuraste la API Key?');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveCar(generatedData);
      setSuccessMsg(`¡${generatedData.Modelo} guardado en el Excel!`);
      setGeneratedData(null);
      setModelo('');
      setPiloto('');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setError('Error al guardar en el Excel.');
    }
  };

  const handleChange = (key, value) => {
    setGeneratedData({ ...generatedData, [key]: value });
  };

  return (
    <div className="animate-fade-in">
      <h2>Generador con IA</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Escribe el auto y piloto, y Gemini buscará toda la historia y estadísticas.
      </p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Modelo del Auto</label>
            <input 
              type="text" 
              placeholder="Ej: Ferrari F2004" 
              value={modelo} 
              onChange={e => setModelo(e.target.value)} 
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Piloto</label>
            <input 
              type="text" 
              placeholder="Ej: Michael Schumacher" 
              value={piloto} 
              onChange={e => setPiloto(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !modelo || !piloto}>
            {loading ? <span className="animate-pulse">Generando...</span> : <><Sparkles size={16}/> Generar</>}
          </button>
        </form>
      </div>

      {error && (
        <div className="card" style={{ background: 'rgba(244, 71, 71, 0.1)', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AlertCircle /> {error}
        </div>
      )}

      {successMsg && (
        <div className="card" style={{ background: 'rgba(0, 210, 106, 0.1)', borderColor: 'var(--accent-success)', color: 'var(--accent-success)', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <CheckCircle /> {successMsg}
        </div>
      )}

      {generatedData && (
        <div className="card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3>Revisar y Editar Datos Generados</h3>
            <button className="btn btn-success" onClick={handleSave}>
              <Save size={16} /> Guardar en Colección
            </button>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label>Historia del Auto</label>
              <textarea 
                rows="6" 
                value={generatedData.Historia_Auto} 
                onChange={e => handleChange('Historia_Auto', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Historia del Piloto</label>
              <textarea 
                rows="6" 
                value={generatedData.Historia_Piloto} 
                onChange={e => handleChange('Historia_Piloto', e.target.value)}
              />
            </div>
          </div>

          <h4>Especificaciones</h4>
          <div className="grid-cols-3" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            {['Motor', 'Caja', 'Chasis', 'Diseñador', 'Color_Fondo', 'Color_Tabla'].map(field => (
              <div key={field} className="form-group" style={{ marginBottom: 0 }}>
                <label>{field.replace('_', ' ')}</label>
                <input 
                  type="text" 
                  value={generatedData[field] || ''} 
                  onChange={e => handleChange(field, e.target.value)}
                />
              </div>
            ))}
          </div>

          <h4>Estadísticas del Piloto</h4>
          <div className="grid-cols-3" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            {['Pil_Carreras', 'Pil_Victorias', 'Pil_Podios', 'Pil_Puntos', 'Pil_Pos'].map(field => (
              <div key={field} className="form-group" style={{ marginBottom: 0 }}>
                <label>{field.replace('Pil_', '')}</label>
                <input 
                  type="text" 
                  value={generatedData[field] || ''} 
                  onChange={e => handleChange(field, e.target.value)}
                />
              </div>
            ))}
          </div>

          <h4>Estadísticas de la Escudería</h4>
          <div className="grid-cols-3" style={{ marginTop: '1rem' }}>
            {['Eq_Carreras', 'Eq_Victorias', 'Eq_Poles', 'Eq_VR', 'Eq_Pos'].map(field => (
              <div key={field} className="form-group" style={{ marginBottom: 0 }}>
                <label>{field.replace('Eq_', '')}</label>
                <input 
                  type="text" 
                  value={generatedData[field] || ''} 
                  onChange={e => handleChange(field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
