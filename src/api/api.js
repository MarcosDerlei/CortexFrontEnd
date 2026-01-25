import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// ✅ Envia token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Trata erros de resposta
api.interceptors.response.use(
  response => response,
  error => {
    // Se não há resposta (erro de rede)
    if (!error.response) {
      console.error("Erro de rede:", error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ✅ APENAS redireciona para login se:
    // 1. Status é 401 (Unauthorized)
    // 2. E a mensagem indica problema de token (não erro de negócio)
    if (status === 401) {
      const message = data?.message || data || "";
      
      // Verifica se é realmente um problema de autenticação
      const isAuthError = 
        typeof message === "string" && (
          message.toLowerCase().includes("token") ||
          message.toLowerCase().includes("expirado") ||
          message.toLowerCase().includes("inválido") ||
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("não autorizado")
        );
      
      if (isAuthError) {
        console.warn("Token expirado ou inválido. Redirecionando para login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // ✅ 403 Forbidden - pode ser falta de permissão, não necessariamente token
    // NÃO redireciona automaticamente, deixa o componente tratar
    if (status === 403) {
      console.warn("Acesso negado (403):", data?.message || "Sem permissão");
      // NÃO redireciona para login aqui
    }

    // ✅ Outros erros (400, 404, 500) - deixa o componente tratar
    return Promise.reject(error);
  }
);

export default api;