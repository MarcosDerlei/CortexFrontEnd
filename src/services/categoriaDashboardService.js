// services/categoriaDashboardService.js
import api from "../api/api";

export function getDashboardCategorias() {
  return api.get("/dashboard/categorias");
}
