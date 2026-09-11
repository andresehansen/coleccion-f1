import React, { useEffect, useState } from 'react';
import { getCollection } from '../api';
import Catalog from './Catalog';

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
      console.error("Error al cargar colección:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }} className="animate-pulse">
        <h3 style={{ color: 'var(--text-muted)' }}>Cargando Catálogo de Monoplazas F1...</h3>
      </div>
    );
  }

  return <Catalog collection={collection} onRefresh={loadData} />;
}
