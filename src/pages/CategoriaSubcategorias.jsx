import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import { getDashboardSubcategorias } from "../services/subcategoriaDashboardService";

import SubcategoriaDashboardHeader from "../components/subcategorias/SubcategoriaDashboardHeader";
import SubcategoriaDashboardGrid from "../components/subcategorias/SubcategoriaDashboardGrid";

function CategoriaSubcategorias() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const [resumo, setResumo] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);
        const data = await getDashboardSubcategorias(categoriaId);

        setResumo(data.resumo);
        setSubcategorias(data.subcategorias);
      } catch (err) {
        setError("Erro ao carregar dashboard de subcategorias");
      } finally {
        setLoading(false);
      }
    }

    if (categoriaId) {
      carregarDashboard();
    }
  }, [categoriaId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Carregando subcategorias...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* BARRA DE NAVEGAÇÃO */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/categorias")}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <button
            onClick={() => navigate("/categorias")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <Home className="h-4 w-4" />
            Início
          </button>
        </div>

        {/* HEADER DO DASHBOARD */}
        <SubcategoriaDashboardHeader resumo={resumo} />

        {/* GRID DE CARDS */}
        <SubcategoriaDashboardGrid subcategorias={subcategorias} />

      </div>
    </div>
  );
}

export default CategoriaSubcategorias;
