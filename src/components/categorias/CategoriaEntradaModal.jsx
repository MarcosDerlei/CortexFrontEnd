import { useEffect, useState } from "react";
import api from "../../api/api";

export default function CategoriaEntradaModal({ categoria, onClose }) {
  const [itens, setItens] = useState([]);
  const [sku, setSku] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Carrega itens da categoria
  useEffect(() => {
    if (!categoria) return;

    api
      .get(`/itens?categoriaId=${categoria.id}`)
      .then((res) => {
        setItens(res.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar itens da categoria", err);
        setItens([]);
      });
  }, [categoria]);

  // 🔹 Submit da entrada
  function handleSubmit(e) {
    e.preventDefault();

    // Salvaguardas
    if (!sku || !quantidade || Number(quantidade) <= 0) return;

    setLoading(true);

    api
      .post("/movimentos", {
        sku,
        tipo: "ENTRADA",
        quantidade: Number(quantidade),
        observacao: observacao || null,
      })
      .then(() => {
        onClose(); // fecha modal ao sucesso
      })
      .catch((err) => {
        console.error("Erro ao registrar entrada", err);
      })
      .finally(() => setLoading(false));
  }

  // Não renderiza se não houver categoria
  if (!categoria) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Entrada rápida — {categoria.nome}
        </h2>

        {/* 🔹 FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Item */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Item
            </label>
            <select
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione um item</option>

              {itens.map((item) => (
                <option key={item.sku} value={item.sku}>
                  {item.descricao}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Quantidade
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Observação */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Observação
            </label>
            <textarea
              rows={3}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Opcional"
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar entrada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
