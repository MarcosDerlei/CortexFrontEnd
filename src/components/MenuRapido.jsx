import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Layers,
  Package,
  Factory,
  ShoppingCart
} from "lucide-react";

export default function MenuRapido() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: "Categorias", path: "/categorias", icon: <LayoutGrid size={16} /> },
    { label: "Subcategorias", path: "/subcategorias", icon: <Layers size={16} /> },
    { label: "Itens", path: "/itens", icon: <Package size={16} /> },
    { label: "Fornecedores", path: "/fornecedores", icon: <Factory size={16} /> },
    { label: "Carrinho", path: "/carrinho", icon: <ShoppingCart size={16} /> },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((i) => {
        const ativo = location.pathname.startsWith(i.path);

        return (
          <button
            key={i.path}
            onClick={() => navigate(i.path)}
            className={[
              "px-4 py-2 rounded-xl text-sm font-semibold border transition flex items-center gap-2",
              ativo
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
            ].join(" ")}
          >
            {i.icon}
            {i.label}
          </button>
        );
      })}
    </div>
  );
}
