import React, { useEffect, useState } from 'react';
import { getCollection } from '../api';
import { Car, Trophy, Flag, Database } from 'lucide-react';

export default function Dashboard() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getCollection();
      setCollection(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Cargando colección...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Mi Colección</h2>
          <p style={{ color: 'var(--text-muted)' }}>{collection.length} autos en la base de datos</p>
        </div>
        <button className="btn btn-secondary" onClick={loadData}>
          <Database size={16} /> Actualizar
        </button>
      </div>

      {collection.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No hay autos en la colección. ¡Usa el generador IA para agregar uno!</p>
        </div>
      ) : (
        <div className="collection-grid">
          {collection.map((car, idx) => (
            <div key={idx} className="card car-card">
              <div className="car-year">{car.Anio}</div>
              <div className="car-model">{car.Modelo}</div>
              <div className="car-driver">{car.Piloto}</div>
              <div className="car-team" style={{ '--team-color': car.Color_Fondo !== '-' ? car.Color_Fondo : 'var(--accent-primary)' }}>
                {car.Escuderia}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <span title="Victorias Piloto" style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'0.85rem', color:'var(--text-muted)'}}>
                  <Trophy size={14} color="gold" /> {car.Pil_Victorias}
                </span>
                <span title="Carreras Piloto" style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'0.85rem', color:'var(--text-muted)'}}>
                  <Flag size={14} /> {car.Pil_Carreras}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
