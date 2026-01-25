import api from "../api/api";

export async function getDashboardSubcategorias(categoriaId) {
  const response = await api.get(
    `/dashboard/categorias/${categoriaId}/subcategorias`
  );

  return response.data;
}
