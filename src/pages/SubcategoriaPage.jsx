import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import SubcategoriaList from "../components/SubcategoriaList";
import Header from "../components/Header";
import Navegacao from "../components/Navegacao";

export default function SubcategoriaPage() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    api
      api.get(`/subcategorias/categoria/${categoriaId}`)
      .then((res) => setSubcategorias(res.data))
      .catch((err) => console.error("Erro ao carregar subcategorias:", err));
  }, [id]);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* BARRA VOLTAR / INÍCIO */}
          <div className="mb-6">
            {/* ajuste o homePath se seu "início" for /categorias */}
            <Navegacao backPath={`/categorias`} homePath={`/categorias`} />
          </div>

          {/* TÍTULO */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900">Subcategorias</h1>
            <p className="text-slate-600 mt-2">
              Escolha uma subcategoria para navegar pelo estoque
            </p>
          </header>

          {/* CONTAINER */}
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
            <SubcategoriaList
              subcategorias={subcategorias}
              onSelectSubcategoria={(sub) =>
                navigate(`/subcategoria/${sub.id}/itens`)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
