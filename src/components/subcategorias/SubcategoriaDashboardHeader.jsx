function SubcategoriaDashboardHeader({ resumo }) {
  if (!resumo) return null;

  const temCritico = resumo.subcategoriasCriticas > 0;
  const temAbaixoMinimo = resumo.subcategoriasAbaixoMinimo > 0;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total de Itens */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total de Itens Cadastrados</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {resumo.totalItens}
        </p>
      </div>

      {/* Subcategorias Críticas */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          temCritico
            ? "bg-red-50 border-red-200"
            : "bg-white border-slate-200"
        }`}
      >
        <p
          className={`text-sm ${
            temCritico ? "text-red-600" : "text-slate-500"
          }`}
        >
          Subcategorias Críticas
        </p>
        <p
          className={`mt-1 text-2xl font-bold ${
            temCritico ? "text-red-700" : "text-slate-900"
          }`}
        >
          {resumo.subcategoriasCriticas}
        </p>
      </div>

      {/* Abaixo do Mínimo */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          !temCritico && temAbaixoMinimo
            ? "bg-yellow-50 border-yellow-200"
            : "bg-white border-slate-200"
        }`}
      >
        <p
          className={`text-sm ${
            !temCritico && temAbaixoMinimo
              ? "text-yellow-700"
              : "text-slate-500"
          }`}
        >
          Abaixo do Mínimo
        </p>
        <p
          className={`mt-1 text-2xl font-bold ${
            !temCritico && temAbaixoMinimo
              ? "text-yellow-800"
              : "text-slate-900"
          }`}
        >
          {resumo.subcategoriasAbaixoMinimo}
        </p>
      </div>

      {/* Valor em Estoque */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <p className="text-sm text-slate-500">Valor em Estoque</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {resumo.valorTotalEstoque?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

    </div>
  );
}

export default SubcategoriaDashboardHeader;
