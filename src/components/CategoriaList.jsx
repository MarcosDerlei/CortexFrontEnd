import { useEffect, useState } from "react";
import CategoriaCard from "./categorias/CategoriaCard";
import { getDashboardCategorias } from "../services/categoriaDashboardService";

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

// ✅ Grid de skeletons
function CategoriaGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CategoriaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function CategoriaList({
  categorias: categoriasExternas,
  onSelectCategoria,
  onViewCategoria,
  onRegisterEntrada,
  onEditCategoria,
}) {
  const [categorias, setCategorias] = useState(categoriasExternas || []);
  const [loading, setLoading] = useState(!categoriasExternas);

  useEffect(() => {
    // Se já recebeu categorias via props, não precisa buscar
    if (categoriasExternas) {
      setCategorias(categoriasExternas);
      setLoading(false);
      return;
    }

    // Caso contrário, busca do backend
    getDashboardCategorias()
      .then((res) => {
        setCategorias(res.data.categorias);
      })
      .catch((err) => {
        console.error("Erro ao buscar dashboard de categorias", err);
      })
      .finally(() => setLoading(false));
  }, [categoriasExternas]);

  // ✅ SKELETON durante loading
  if (loading) {
    return <CategoriaGridSkeleton count={6} />;
  }

  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Nenhuma categoria encontrada.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categorias.map((cat) => (
        <CategoriaCard
          key={cat.id}
          categoria={cat}
          onClick={() => onSelectCategoria(cat)}
          onView={() => onViewCategoria(cat)}
          onRegisterEntry={() => onRegisterEntrada(cat)}
          onEdit={() => onEditCategoria(cat)}
        />
      ))}
    </div>
  );
}