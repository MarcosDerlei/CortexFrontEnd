import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Package, Warehouse, ShieldAlert } from "lucide-react";

export default function ItemList({ subcategoriaId, onSelectItem }) {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    if (subcategoriaId) {
      api
        .get(`/itens/subcategoria/${subcategoriaId}`)
        .then((res) => setItens(res.data))
        .catch((err) => console.error("Erro ao carregar itens:", err));
    }
  }, [subcategoriaId]);

  if (!subcategoriaId)
    return <p className="text-slate-500">Selecione uma subcategoria.</p>;

  const alertaStyles = {
    OK: "bg-green-100 text-green-700 border-green-200",
    "ATENÇÃO": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "CRÍTICO": "bg-red-100 text-red-700 border-red-200",
  };

  const alertaIconStyles = {
    OK: "text-green-600",
    "ATENÇÃO": "text-yellow-600",
    "CRÍTICO": "text-red-600",
  };

  return (
    <div className="w-full">
      {itens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {itens.map((item) => {
            const alerta = item.alerta || "OK";

            return (
              <div
                key={item.sku}
                onClick={() => onSelectItem?.(item)}
                className="
                  cursor-pointer
                  bg-white
                  border border-slate-200/70
                  rounded-3xl
                  p-6
                  shadow-sm
                  hover:shadow-md hover:-translate-y-0.5
                  transition
                "
              >
                {/* Topo */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Package size={20} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {item.descricao}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        SKU:{" "}
                        <span className="font-medium text-slate-700">
                          {item.sku}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      inline-flex items-center gap-2
                      px-3 py-1
                      text-xs font-semibold
                      rounded-full border
                      ${alertaStyles[alerta] || "bg-slate-100 text-slate-700 border-slate-200"}
                    `}
                  >
                    <ShieldAlert
                      size={14}
                      className={alertaIconStyles[alerta] || "text-slate-600"}
                    />
                    {alerta}
                  </span>
                </div>

                {/* Observação */}
                <p className="text-sm text-slate-600 mt-4 line-clamp-2 min-h-[40px]">
                  {item.observacao || "Sem observações."}
                </p>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                    <p className="text-xs text-slate-500">Saldo</p>
                    <p className="text-xl font-bold text-slate-900">
                      {item.saldo ?? 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                    <p className="text-xs text-slate-500">Reservado</p>
                    <p className="text-xl font-bold text-slate-900">
                      {item.reservado ?? 0}
                    </p>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <Warehouse size={14} />
                    {item.unidade || "un"}
                  </span>

                  <span className="truncate max-w-[180px] text-right">
                    {item.fornecedor || "Fornecedor não informado"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-500">Nenhum item encontrado nesta subcategoria.</p>
      )}
    </div>
  );
}
