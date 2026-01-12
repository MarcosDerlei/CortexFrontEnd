import { useNavigate } from "react-router-dom";

function SubcategoriaDashboardCard({ subcategoria }) {
  const navigate = useNavigate();

  const {
    subcategoriaId,
    nome,
    totalItens,
    itensAbaixoMinimo,
    valorEstoque,
    status,
    giro,
  } = subcategoria;

  const statusStyles = {
    NORMAL: "bg-green-100 text-green-700",
    ATENCAO: "bg-yellow-100 text-yellow-800",
    CRITICO: "bg-red-100 text-red-700",
  };

  const giroStyles = {
    ALTO: "text-green-600",
    MEDIO: "text-yellow-600",
    BAIXO: "text-red-600",
  };

  return (
    <div
      onClick={() => navigate(`/subcategoria/${subcategoriaId}/itens`)}
      className="
        cursor-pointer
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        flex flex-col justify-between
        transition
        hover:shadow-md
        hover:-translate-y-0.5
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {nome}
        </h3>

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            statusStyles[status] || "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Corpo */}
      <div className="space-y-2 text-sm text-slate-600">
        <p>
          Total de itens:{" "}
          <span className="font-medium text-slate-900">
            {totalItens}
          </span>
        </p>

        <p>
          Abaixo do mínimo:{" "}
          <span
            className={`font-medium ${
              itensAbaixoMinimo > 0
                ? "text-red-600"
                : "text-slate-900"
            }`}
          >
            {itensAbaixoMinimo}
          </span>
        </p>

        <p>
          Valor em estoque:{" "}
          <span className="font-medium text-slate-900">
            {valorEstoque?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </p>
      </div>

      {/* Rodapé */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500">Giro</span>
        <span
          className={`font-semibold ${
            giroStyles[giro] || "text-slate-600"
          }`}
        >
          {giro}
        </span>
      </div>
    </div>
  );
}

export default SubcategoriaDashboardCard;
