import CategoriaStatusBadge from "./CategoriaStatusBadge";
import CategoriaActions from "./CategoriaActions";
import { formatBRL } from "../../utils/Formatters";

export default function CategoriaCard({
  categoria,
  onClick,
  onView,
  onEdit,
  onRegisterEntry,
}) {
  // ✅ Limite visual de porcentagem (apenas UI)
  const MAX_VARIACAO = 200;

  const variacaoNum = Number(categoria?.variacao30d ?? 0);

  const variacaoTexto =
    variacaoNum > MAX_VARIACAO
      ? `${MAX_VARIACAO}%+`
      : `${Math.round(variacaoNum)}%`;

  return (
    <div
      onClick={onClick}
      className="
        relative
        bg-white rounded-xl shadow
        p-5 flex flex-col gap-4
        cursor-pointer
        hover:shadow-md transition
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          {categoria.nome}
        </h3>
        <CategoriaStatusBadge status={categoria.status} />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
        <div>
          <span className="font-medium">Itens</span>
          <div>{categoria.totalItens}</div>
        </div>

        <div>
          <span className="font-medium">Valor</span>
         <div>{formatBRL(categoria.valorEstoque)}</div>
        </div>

        <div>
          <span className="font-medium">Abaixo mín.</span>
          <div>{categoria.itensAbaixoMinimo}</div>
        </div>

        <div>
          <span className="font-medium">Variação 30d</span>
          <div className={variacaoNum >= 0 ? "text-green-600" : "text-red-600"}>
            {variacaoTexto}
          </div>
        </div>
      </div>

      {/* Ações */}
      <CategoriaActions
        onView={onView}
        onRegisterEntry={onRegisterEntry}
        onEdit={onEdit}
      />
    </div>
  );
}
