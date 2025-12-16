import React, { useEffect, useState } from "react";
import { Folder, Package, Hammer, PaintBucket, Wrench } from "lucide-react";
import api from "../api/api";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

export default function CategoriaList({ onSelectCategoria, categoriaSelecionada }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  const getIcon = (nome) => {
    const lower = nome.toLowerCase();
    if (lower.includes("ferragem")) return <Hammer className="h-5 w-5" />;
    if (lower.includes("madeira")) return <Package className="h-5 w-5" />;
    if (lower.includes("acabamento")) return <PaintBucket className="h-5 w-5" />;
    if (lower.includes("equipamento")) return <Wrench className="h-5 w-5" />;
    return <Folder className="h-5 w-5" />;
  };

  return (
    <div className="p-6">
      {/* Cabeçalho da seção */}
      <div className="mb-6">
      </div>

      {/* Grid de cards ocupando bem o espaço */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((cat) => {
          const selecionada = categoriaSelecionada?.id === cat.id;

          return (
            <Card
              key={cat.id}
              onClick={() => onSelectCategoria(cat)}
              className={`
                cursor-pointer transition-all
                rounded-2xl border
                flex flex-col justify-between h-full
                ${
                  selecionada
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:shadow-md"
                }
              `}
            >
              <CardHeader className="p-4">
                {/* Ícone + título */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full
                      ${
                        selecionada
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    {getIcon(cat.nome)}
                  </div>

                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {cat.nome}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      {cat.ativo ? "Categoria ativa" : "Categoria inativa"}
                    </CardDescription>
                  </div>
                </div>

                {/* Descrição */}
                <CardDescription className="text-sm text-slate-600 mb-2">
                  {cat.descricao}
                </CardDescription>

                {/* Status como “tagzinha” */}
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${
                      cat.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }
                  `}
                >
                  {cat.ativo ? "Ativa" : "Inativa"}
                </span>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
