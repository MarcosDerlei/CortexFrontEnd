import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ItemDetail from "../components/ItemDetail";
import Navegacao from "../components/Navegacao";
import MenuRapido from "../components/MenuRapido";
import { Package, Barcode, Layers, MapPin, Clock } from "lucide-react";

// ✅ Skeleton para header do item
function ItemHeaderSkeleton() {
  return (
    <div className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-48 bg-slate-200 rounded" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Skeleton para cards de informação
function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 bg-slate-200 rounded" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
      <div className="h-6 w-24 bg-slate-200 rounded" />
    </div>
  );
}

// ✅ Skeleton para botões de ação
function ItemActionsSkeleton() {
  return (
    <div className="flex flex-wrap gap-3 mt-8 animate-pulse">
      <div className="h-10 w-28 bg-slate-200 rounded-xl" />
      <div className="h-10 w-28 bg-slate-200 rounded-xl" />
      <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      <div className="h-10 w-32 bg-slate-200 rounded-xl" />
    </div>
  );
}

// ✅ Skeleton completo do detalhe do item
function ItemDetailSkeleton() {
  return (
    <div>
      {/* Cards de informação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
      </div>

      {/* Botões de ação */}
      <ItemActionsSkeleton />

      {/* Tab content */}
      <div className="mt-6 animate-pulse">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="h-5 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-64 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  const { sku } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function carregarItem() {
      if (!sku) return;

      setLoading(true);
      try {
        const res = await api.get(`/itens/sku/${sku}`);
        if (isMounted) {
          setItem(res.data);
        }
      } catch (err) {
        console.error("Erro ao carregar item:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarItem();

    return () => {
      isMounted = false;
    };
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

        {/* ✅ Menu rápido */}
        <div className="mt-6">
          <MenuRapido />
        </div>

        {/* ✅ SKELETON ou conteúdo real */}
        {loading ? (
          <>
            <ItemHeaderSkeleton />
            <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70">
              <ItemDetailSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Header compacto */}
            <div className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Package size={22} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                      {item?.descricao || "Item não encontrado"}
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
          </>
        )}
      </div>
    </div>
  );
}