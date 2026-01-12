import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import ItemList from "../components/ItemList";
import Navegacao from "../components/Navegacao";

export default function ItemPage() {
  const { id } = useParams(); // ID da SUBCATEGORIA
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Navegação (Voltar / Início) */}
        <Navegacao backPath={-1} homePath="/" />

        {/* Container visual padrão */}
        <div className="mt-8 bg-white/80 backdrop-blur rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/70">
          <ItemList
            subcategoriaId={Number(id)}
            onSelectItem={(item) => navigate(`/item/${item.sku}`)}
          />
        </div>
      </div>
    </div>
  );
}
