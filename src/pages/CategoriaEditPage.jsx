import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function CategoriaEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Busca categoria pelo ID
  useEffect(() => {
    api
      .get(`/categorias/${id}`)
      .then((res) => setCategoria(res.data))
      .catch(() => {
        alert("Categoria não encontrada");
        navigate("/categorias");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // 🔹 Atualiza campos do formulário
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setCategoria((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // 🔹 Submit da edição
  function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    api
      .put(`/categorias/${id}`, categoria)
      .then(() => {
        navigate("/categorias");
      })
      .catch((err) => {
        console.error("Erro ao atualizar categoria", err);
        alert("Erro ao salvar categoria");
      })
      .finally(() => setSaving(false));
  }

  if (loading) {
    return <p className="p-6">Carregando categoria...</p>;
  }

  if (!categoria) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Editar Categoria
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            name="nome"
            value={categoria.nome}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Código */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Código
          </label>
          <input
            name="codigo"
            value={categoria.codigo || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={categoria.descricao || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Ativo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ativo"
            checked={categoria.ativo}
            onChange={handleChange}
          />
          <label className="text-sm font-medium">
            Categoria ativa
          </label>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/categorias")}
            className="px-4 py-2 bg-slate-200 rounded"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
