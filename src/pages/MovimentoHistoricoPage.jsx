import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function MovimentoHistoricoPage() {
  const { sku } = useParams();
  const navigate = useNavigate();

  const [movimentos, setMovimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/movimentos/item/${sku}`)
      .then((res) => setMovimentos(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [sku]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        ← Voltar
      </button>

      {/* Título */}
      <h2 className="text-2xl font-bold mb-6">
        Histórico de Movimentações — {sku}
      </h2>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow border p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b font-semibold bg-gray-100">
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Quantidade</th>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Observação</th>
            </tr>
          </thead>

          <tbody>
            {movimentos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Nenhuma movimentação registrada até o momento.
                </td>
              </tr>
            ) : (
              movimentos.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="p-2">{m.tipo}</td>
                  <td className="p-2">{m.quantidade}</td>
                  <td className="p-2">
                    {new Date(m.dataMovimento).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-2">{m.observacao || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
