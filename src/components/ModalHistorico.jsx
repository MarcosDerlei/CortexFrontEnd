import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { X, History } from "lucide-react";

export default function ModalHistorico({ sku, onClose }) {
  const [movimentos, setMovimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!sku) return;

      try {
        setLoading(true);

        // ✅ endpoint correto: filtra por SKU
        const res = await api.get(`/movimentos/item/${sku}`);

        setMovimentos(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setMovimentos([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sku]);

  const movimentosOrdenados = useMemo(() => {
    const arr = [...movimentos];

    arr.sort((a, b) => {
      const da = new Date(a.dataMovimento).getTime();
      const db = new Date(b.dataMovimento).getTime();
      return db - da;
    });

    return arr;
  }, [movimentos]);

  function formatDate(v) {
    if (!v) return "-";
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    return d.toLocaleString("pt-BR");
  }

  function badgeTipo(tipo) {
    const base =
      "px-2 py-1 rounded-full text-xs font-bold border inline-flex items-center";

    const t = (tipo || "").toUpperCase();

    if (t === "ENTRADA")
      return (
        <span className={`${base} bg-green-100 text-green-700 border-green-200`}>
          ENTRADA
        </span>
      );
    if (t === "SAIDA")
      return (
        <span className={`${base} bg-red-100 text-red-700 border-red-200`}>
          SAÍDA
        </span>
      );
    if (t === "AJUSTE")
      return (
        <span className={`${base} bg-slate-100 text-slate-700 border-slate-200`}>
          AJUSTE
        </span>
      );
    if (t === "DEVOLUCAO")
      return (
        <span className={`${base} bg-blue-100 text-blue-700 border-blue-200`}>
          DEVOLUÇÃO
        </span>
      );
    if (t === "RESERVADO")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800 border-yellow-200`}>
          RESERVADO
        </span>
      );
    if (t === "LIBERACAO")
      return (
        <span className={`${base} bg-purple-100 text-purple-700 border-purple-200`}>
          LIBERAÇÃO
        </span>
      );

    return (
      <span className={`${base} bg-slate-100 text-slate-700 border-slate-200`}>
        {tipo || "-"}
      </span>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-slate-200/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Histórico do Item
              </h2>
              <p className="text-sm text-slate-500">SKU: {sku}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <p className="text-slate-600">Carregando histórico...</p>
          ) : movimentosOrdenados.length === 0 ? (
            <p className="text-slate-600">Nenhum movimento encontrado.</p>
          ) : (
            <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Data</th>
                    <th className="text-left px-4 py-3 font-semibold">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold">Qtd</th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Observação
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {movimentosOrdenados.map((m) => (
                    <tr key={m.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        {formatDate(m.dataMovimento)}
                      </td>

                      <td className="px-4 py-3">{badgeTipo(m.tipo)}</td>

                      <td className="px-4 py-3 font-bold text-slate-900">
                        {m.quantidade}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {m.observacao || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
