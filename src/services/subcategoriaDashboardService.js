import api from "../api/api";
// ou o caminho correto do seu axios/config de API

export async function getDashboardSubcategorias(categoriaId) {
  const response = await api.get(
    `/dashboard/categorias/${categoriaId}/subcategorias`
  );

  return response.data;
}
