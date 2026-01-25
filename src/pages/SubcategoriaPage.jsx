import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDashboardSubcategorias } from "../services/subcategoriaDashboardService";
import SubcategoriaList from "../components/SubcategoriaList";
import Header from "../components/Header";
import Navegacao from "../components/Navegacao";

export default function SubcategoriaPage() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const [subcategorias, setSubcategorias] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoriaId) return;

    getDashboardSubcategorias(categoriaId)
      .then((data) => {
        // ajuste conforme o shape que seu backend retorna
        setSubcategorias(data.subcategorias);
        setResumo(data.resumo);
      })
      .catch((err) =>
        console.error("Erro ao carregar dashboard de subcategorias:", err)
      )
      .finally(() => setLoading(false));
  }, [categoriaId]);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Navegacao backPath={`/categorias`} homePath={`/categorias`} />
          </div>

          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900">
              Subcategorias
            </h1>
            <p className="text-slate-600 mt-2">
              Escolha uma subcategoria para navegar pelo estoque
            </p>
          </header>

          {/* RESUMO (opcional, mas já preparado) */}
          {resumo && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <span className="text-sm text-slate-500">
                  Total subcategorias
                </span>
                <p className="text-2xl font-bold">{resumo.total}</p>
              </div>
            </div>
          )}

          <div
            className="
              bg-white/80
              backdrop-blur
              rounded-3xl
              p-10
              shadow-sm
              border border-slate-200/70
            "
          >
            {loading ? (
              <p className="text-center text-slate-500">
                Carregando subcategorias...
              </p>
            ) : (
              <SubcategoriaList
                subcategorias={subcategorias}
                onSelectSubcategoria={(sub) =>
                  navigate(`/subcategoria/${sub.id}/itens`)
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
