import { Eye, Edit, Plus } from "lucide-react";

export default function CategoriaActions({
  onView,
  onEdit,
  onRegisterEntry,
}) {
  return (
    <div className="flex gap-2 pointer-events-auto">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onView?.();
        }}
        className="p-1 rounded hover:bg-slate-100 cursor-pointer"
        title="Ver detalhes"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRegisterEntry?.();
        }}
        className="p-1 rounded hover:bg-slate-100 cursor-pointer"
        title="Registrar entrada"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="p-1 rounded hover:bg-slate-100 cursor-pointer"
        title="Editar categoria"
      >
        <Edit className="h-4 w-4" />
      </button>
    </div>
  );
}
