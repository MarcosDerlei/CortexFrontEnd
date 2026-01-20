import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriaList from "../components/CategoriaList";
import Header from "../components/Header";
import CategoriaResumoModal from "../components/categorias/CategoriaResumoModal";
import CategoriaEntradaModal from "../components/categorias/CategoriaEntradaModal";
import api from "../api/api";

import MenuRapido from "../components/MenuRapido";

// ✅ helper local
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
  const [categoriaResumo, setCategoriaResumo] = useState(null);
  const [categoriaEntrada, setCategoriaEntrada] = useState(null);

  // ✅ Dashboard resumo (topo)
  const [resumo, setResumo] = useState(null);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // ✅ Busca resumo do dashboard de categorias
  useEffect(() => {
    async function carregarResumo() {
      try {
        const { data } = await api.get("/dashboard/categorias/resumo");
        setResumo(data);
      } catch (err) {
        console.error("Erro ao carregar resumo categorias:", err);
      }
    }

    carregarResumo();
  }, []);

  return (
    <>
      <Header search={search} setSearch={setSearch} onLogout={handleLogout} />

      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* ✅ MENU RÁPIDO (HOME NÃO PRECISA DE VOLTAR/INÍCIO) */}
          <div className="mt-2">
            <MenuRapido />
          </div>

          {/* ✅ Cards de resumo */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <ResumoCard
              title="Total de Categorias"
              value={resumo?.totalCategorias ?? "-"}
            />

            <ResumoCard
              title="Categorias Críticas"
              value={resumo?.categoriasCriticas ?? "-"}
              highlight={resumo?.categoriasCriticas > 0 ? "danger" : "success"}
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

          {/* ✅ Lista */}
          <div className="bg-transparent">
            <CategoriaList
              search={search}
              onSelectCategoria={(cat) =>
                navigate(`/categoria/${cat.id}/subcategorias`)
              }
              onViewCategoria={(cat) => setCategoriaResumo(cat)}
              onRegisterEntrada={(cat) => setCategoriaEntrada(cat)}
              onEditCategoria={(cat) => navigate(`/categorias/${cat.id}/editar`)}
            />
          </div>
        </div>
      </div>

      {/* 👁️ Modal de resumo */}
      <CategoriaResumoModal
        categoria={categoriaResumo}
        onClose={() => setCategoriaResumo(null)}
      />

      {/* ➕ Modal de entrada rápida */}
      <CategoriaEntradaModal
        categoria={categoriaEntrada}
        onClose={() => setCategoriaEntrada(null)}
      />
    </>
  );
}
