import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getCollection = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/coleccion`);
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn("Backend API no disponible, usando collection.json local...", err.message);
  }
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}collection.json`);
    const staticData = await res.json();
    return staticData;
  } catch (err2) {
    console.error("Error cargando collection.json de respaldo:", err2);
    return [];
  }
};

export const generateIA = async (modelo, piloto) => {
  const { data } = await axios.post(`${API_URL}/generar_ia`, { modelo, piloto });
  return data;
};

export const saveCar = async (carData) => {
  const { data } = await axios.post(`${API_URL}/guardar_auto`, carData);
  return data;
};

export const exportWord = async () => {
  const { data } = await axios.post(`${API_URL}/exportar_word`);
  return data;
};

export const exportIndex = async () => {
  const { data } = await axios.post(`${API_URL}/generar_indice`);
  return data;
};
