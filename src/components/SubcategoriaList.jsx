import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card"; // mantém o mesmo padrão dos outros
import { Folder, ListTree } from "lucide-react";

export default function SubcategoriaList({
  subcategorias,
  onSelectSubcategoria,
  subcategoriaSelecionada,
}) {
  const getIcon = (nome) => {
    // Você pode trocar isso depois se quiser ícones específicos
    if (nome.toLowerCase().includes("corrediça"))
      return <ListTree className="h-5 w-5" />;
    return <Folder className="h-5 w-5" />;
  };

  return (
    <div className="p-6">
      {/* Cabeçalho da seção */}
      <div className="mb-6">
      </div>

      {/* Grid de cards — mesmo layout do CategoriaList */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subcategorias.map((sub) => {
          const selecionada = subcategoriaSelecionada?.id === sub.id;

          return (
            <Card
              key={sub.id}
              onClick={() => onSelectSubcategoria(sub)}
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
                    {getIcon(sub.nome)}
                  </div>

                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {sub.nome}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      {sub.ativo ? "Subcategoria ativa" : "Inativa"}
                    </CardDescription>
                  </div>
                </div>

                {/* Descrição */}
                <CardDescription className="text-sm text-slate-600 mb-2">
                  {sub.descricao}
                </CardDescription>

                {/* Status */}
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${
                      sub.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }
                  `}
                >
                  {sub.ativo ? "Ativa" : "Inativa"}
                </span>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
