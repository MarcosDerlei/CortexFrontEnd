import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ItemDetail from "../components/ItemDetail";
import Navegacao from "../components/Navegacao";
import { Package, Barcode, Layers, MapPin, Clock } from "lucide-react";

export default function ItemDetailPage() {
  const { sku } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (sku) {
      api.get(`/itens/sku/${sku}`).then((res) => setItem(res.data));
    }
  }, [sku]);

  const alertaStyles = {
    NORMAL: "bg-green-100 text-green-700 border-green-200",
    ATENCAO: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CRITICO: "bg-red-100 text-red-700 border-red-200",
  };

  const alertaLabel = {
    NORMAL: "OK",
    ATENCAO: "Atenção",
    CRITICO: "Crítico",
  };

  const alerta = item?.alerta || "NORMAL";
  const badgeClass =
    alertaStyles[alerta] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Navegação */}
        <Navegacao backPath={-1} homePath="/" />

        {/* Header compacto (sem botões) */}
        <div className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Package size={22} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  {item?.descricao || "Carregando item..."}
                </h1>

                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${badgeClass}`}
                >
                  {alertaLabel[alerta] || alerta}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Barcode size={16} />
                  SKU:{" "}
                  <span className="text-slate-700 font-medium">
                    {item?.sku || sku}
                  </span>
                </span>

                {item?.categoriaNome && (
                  <span className="inline-flex items-center gap-2">
                    <Layers size={16} />
                    {item.categoriaNome}
                    {item?.subcategoriaNome ? ` • ${item.subcategoriaNome}` : ""}
                  </span>
                )}

                {item?.localizacao && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {item.localizacao}
                  </span>
                )}

                {item?.ultimaAtualizacao && (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    {new Date(item.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70">
          <ItemDetail item={item} />
        </div>
      </div>
    </div>
  );
}
