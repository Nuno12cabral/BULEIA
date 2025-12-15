import axios from 'axios';


const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://api.exemplo.com';


export const api = axios.create({
baseURL: API_BASE,
timeout: 15000,
headers: { 'Content-Type': 'application/json' },
});


// Exemplo de interceptors para injetar token
api.interceptors.request.use(async (cfg) => {
// pegar token do store / securestorage
// const token = await SecureStore.getItemAsync('token');
// if (token) cfg.headers.Authorization = `Bearer ${token}`;
return cfg;
});


export default api;