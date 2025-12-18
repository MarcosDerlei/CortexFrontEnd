import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

/*
=====================================================
 AUTENTICAÇÃO / JWT — DESATIVADO TEMPORARIAMENTE
 (Login fake no front + backend liberado)
 Reativar depois do CRUD estar pronto
=====================================================
*/

// // envia token no request
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // trata token expirado ou inválido
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403)
//     ) {
//       // token inválido ou expirado
//       localStorage.removeItem("token");

//       // redireciona para login
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
