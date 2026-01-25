import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import { getDashboardSubcategorias } from "../services/subcategoriaDashboardService";

import SubcategoriaDashboardHeader from "../components/subcategorias/SubcategoriaDashboardHeader";
import SubcategoriaDashboardGrid from "../components/subcategorias/SubcategoriaDashboardGrid";

// ✅ Importar skeletons
import {
  ResumoGridSkeleton,
  SubcategoriaGridSkeleton,
} from "../components/Skeleton";

function CategoriaSubcategorias() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const [resumo, setResumo] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Previne chamada duplicada
    let isMounted = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDashboardSubcategorias(categoriaId);

        if (isMounted) {
          setResumo(data.resumo);
          setSubcategorias(data.subcategorias);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erro ao carregar dashboard de subcategorias");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (categoriaId) {
      carregarDashboard();
    }

    // ✅ Cleanup para evitar updates em componente desmontado
    return () => {
      isMounted = false;
    };
  }, [categoriaId]);

  // ✅ SKELETON LOADING (muito mais elegante!)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Barra de navegação */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          {/* Resumo skeleton */}
          <ResumoGridSkeleton />

          {/* Grid skeleton */}
          <SubcategoriaGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate("/categorias")}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
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