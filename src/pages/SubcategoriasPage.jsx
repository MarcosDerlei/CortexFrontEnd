import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import Navegacao from "../components/Navegacao";
import MenuRapido from "../components/MenuRapido";

import { Layers, Search } from "lucide-react";

// ✅ Skeleton para card de subcategoria
function SubcategoriaCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-5 w-32 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-24 bg-slate-200 rounded" />
    </div>
  );
}

// ✅ Grid de skeletons
function SubcategoriaGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SubcategoriaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function SubcategoriasPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subcategorias, setSubcategorias] = useState([]);
  const [search, setSearch] = useState("");

  async function carregarSubcategorias() {
    try {
      setLoading(true);
      const { data } = await api.get("/subcategorias");
      setSubcategorias(data || []);
    } catch (err) {
      console.error("Erro ao carregar subcategorias:", err);
      setSubcategorias([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarSubcategorias();
  }, []);

  const subcategoriasFiltradas = useMemo(() => {
    if (!search) return subcategorias;

    const s = search.toLowerCase();

    return subcategorias.filter((sub) => {
      const nome = (sub.nome || "").toLowerCase();
      return nome.includes(s);
    });
  }, [subcategorias, search]);

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Navegação */}
        <Navegacao backPath={-1} homePath="/categorias" />

        {/* ✅ Menu rápido */}
        <div className="mt-6">
          <MenuRapido />
        </div>

        {/* ✅ Header padrão SaaS */}
        <header className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Layers size={22} />
            </div>

            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Subcategorias
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Busque subcategorias pelo nome e acesse os itens rapidamente.
              </p>

              {/* ✅ Busca */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 w-full">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar subcategoria..."
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
            <SubcategoriaGridSkeleton count={9} />
          ) : subcategoriasFiltradas.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <Layers size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-900">
                Nenhuma subcategoria encontrada.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tente buscar por outro nome.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {subcategoriasFiltradas.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => navigate(`/subcategoria/${sub.id}/itens`)}
                  className="text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 p-5 transition shadow-sm"
                >
                  <p className="text-sm font-bold text-slate-900">{sub.nome}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Clique para ver os itens
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}