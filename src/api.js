import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getCollection = async () => {
  const { data } = await axios.get(`${API_URL}/coleccion`);
  return data;
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
