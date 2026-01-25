import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import CategoriaList from "../components/CategoriaList";
import CategoriaResumoModal from "../components/categorias/CategoriaResumoModal";
import CategoriaEntradaModal from "../components/categorias/CategoriaEntradaModal";
import MenuRapido from "../components/MenuRapido";

import api from "../api/api";

// ✅ Skeleton para card de resumo
function ResumoCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-6 py-4 animate-pulse">
      <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
      <div className="h-8 w-16 bg-slate-200 rounded" />
    </div>
  );
}

// ✅ Skeleton para card de categoria
function CategoriaCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div>
            <div className="h-5 w-28 bg-slate-200 rounded mb-1" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="h-5 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 bg-slate-200 rounded-lg" />
        <div className="h-8 w-20 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

// ✅ Skeleton completo do dashboard
function DashboardSkeleton() {
  return (
    <>
      {/* Resumo skeleton */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <ResumoCardSkeleton key={i} />
        ))}
      </div>

      {/* Categorias skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoriaCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

// 🔹 Card de resumo (real)
function ResumoCard({ title, value, highlight = "default" }) {
  const highlightClass =
    highlight === "danger"
      ? "bg-red-50 border-red-200 text-red-800"
      : highlight === "warning"
      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
      : highlight === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : "bg-white border-slate-200 text-slate-900";

  const titleClass =
    highlight === "danger"
      ? "text-red-700"
      : highlight === "warning"
      ? "text-yellow-700"
      : highlight === "success"
      ? "text-green-700"
      : "text-slate-600";

  return (
    <div className={`rounded-xl border shadow-sm px-6 py-4 ${highlightClass}`}>
      <p className={`text-sm font-medium ${titleClass}`}>{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export default function CategoriaPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categoriaResumo, setCategoriaResumo] = useState(null);
  const [categoriaEntrada, setCategoriaEntrada] = useState(null);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // ✅ ÚNICA CHAMADA DO DASHBOARD
  useEffect(() => {
    let isMounted = true;

    async function carregarDashboard() {
      try {
        const { data } = await api.get("/dashboard/categorias");
        if (isMounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard de categorias:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const resumo = dashboard?.resumo;
  const categorias = dashboard?.categorias ?? [];

  return (
    <>
      <Header search={search} setSearch={setSearch} onLogout={handleLogout} />

      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-6xl mx-auto">

          {/* MENU RÁPIDO */}
          <div className="mt-2">
            <MenuRapido />
          </div>

          {/* ✅ SKELETON durante loading (em vez de texto) */}
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* 🔹 RESUMO */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <ResumoCard
                  title="Total de Categorias"
                  value={resumo?.totalCategorias ?? "-"}
                />

                <ResumoCard
                  title="Categorias Críticas"
                  value={resumo?.categoriasCriticas ?? "-"}
                  highlight={
                    resumo?.categoriasCriticas > 0 ? "danger" : "success"
                  }
                />

                <ResumoCard
                  title="Maior Consumo (30d)"
                  value={resumo?.maiorConsumo30d ?? "-"}
                />

                <ResumoCard
                  title="Valor em Estoque"
                  value={
                    resumo?.valorTotalEstoque != null
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(resumo.valorTotalEstoque))
                      : "-"
                  }
                />
              </div>

              {/* 🔹 LISTA DE CATEGORIAS */}
              <CategoriaList
                categorias={categorias}
                search={search}
                onSelectCategoria={(cat) =>
                  navigate(`/categoria/${cat.id}/subcategorias`)
                }
                onViewCategoria={(cat) => setCategoriaResumo(cat)}
                onRegisterEntrada={(cat) => setCategoriaEntrada(cat)}
                onEditCategoria={(cat) =>
                  navigate(`/categorias/${cat.id}/editar`)
                }
              />
            </>
          )}
        </div>
      </div>

      {/* 👁️ MODAL RESUMO */}
      <CategoriaResumoModal
        categoria={categoriaResumo}
        onClose={() => setCategoriaResumo(null)}
      />

      {/* ➕ MODAL ENTRADA */}
      <CategoriaEntradaModal
        categoria={categoriaEntrada}
        onClose={() => setCategoriaEntrada(null)}
      />
    </>
  );
}