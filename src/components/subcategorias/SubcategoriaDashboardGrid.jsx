import SubcategoriaDashboardCard from "./SubcategoriaDashboardCard";

function SubcategoriaDashboardGrid({ subcategorias }) {
  if (!subcategorias || subcategorias.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-slate-500">
        Nenhuma subcategoria encontrada.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {subcategorias.map((subcategoria) => (
        <SubcategoriaDashboardCard
          key={subcategoria.subcategoriaId}
          subcategoria={subcategoria}
        />
      ))}
    </div>
  );
}

export default SubcategoriaDashboardGrid;
