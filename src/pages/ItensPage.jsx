import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import Navegacao from "../components/Navegacao";
import MenuRapido from "../components/MenuRapido";

import { Package, Search, Barcode } from "lucide-react";

// ✅ Skeleton para card de item
function ItemCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-5 w-36 bg-slate-200 rounded mb-3" />
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 bg-slate-200 rounded" />
        <div className="h-3 w-24 bg-slate-200 rounded" />
      </div>
      <div className="h-3 w-20 bg-slate-200 rounded" />
    </div>
  );
}

// ✅ Grid de skeletons
function ItemGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ItensPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [search, setSearch] = useState("");

  async function carregarItens() {
    try {
      setLoading(true);
      const { data } = await api.get("/itens");
      setItens(data || []);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
      setItens([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarItens();
  }, []);

  const itensFiltrados = useMemo(() => {
    if (!search) return itens;

    const s = search.toLowerCase();

    return itens.filter((i) => {
      const sku = (i.sku || "").toLowerCase();
      const desc = (i.descricao || "").toLowerCase();
      return sku.includes(s) || desc.includes(s);
    });
  }, [itens, search]);

  return (
    <>
      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* ✅ Navegação igual padrão */}
          <Navegacao backPath={-1} homePath="/categorias" />

          {/* ✅ Menu rápido */}
          <div className="mt-6">
            <MenuRapido />
          </div>

          {/* ✅ Header da page */}
          <header className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Package size={22} />
              </div>

              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Itens
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Busque itens por SKU ou descrição e acesse os detalhes rapidamente.
                </p>

                {/* ✅ Busca */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 w-full">
                    <Search size={18} className="text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar item (SKU ou descrição)..."
                      className="w-full outline-none bg-transparent text-slate-800"
                    />
                  </div>

                  <button
                    onClick={() => setSearch("")}
                    className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* ✅ Lista */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-sm border border-slate-200/70">
            {loading ? (
              // ✅ SKELETON durante loading
              <ItemGridSkeleton count={9} />
            ) : itensFiltrados.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <Package size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-900">
                  Nenhum item encontrado.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Tente buscar por outro SKU ou descrição.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {itensFiltrados.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => navigate(`/item/${i.sku}`)}
                    className="text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 p-5 transition shadow-sm"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {i.descricao}
                    </p>

                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                      <Barcode size={14} />
                      <span className="font-semibold text-slate-700">
                        SKU:
                      </span>
                      <span>{i.sku}</span>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      Saldo: <span className="font-bold text-slate-900">{i.saldo}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}