import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ItemDetail from "../components/ItemDetail";
import Navegacao from "../components/Navegacao";

export default function ItemDetailPage() {
  const { sku } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (sku) {
      api.get(`/itens/sku/${sku}`).then(res => setItem(res.data));
    }
  }, [sku]);

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Navegação */}
        <Navegacao backPath={-1} homePath="/" />

        {/* Cabeçalho */}
        <header className="mb-10 mt-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Detalhes do Item
          </h1>
          <p className="text-slate-500 mt-1">
            Informações completas e controle de estoque
          </p>
        </header>

        {/* Card principal */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70">
          <ItemDetail item={item} />
        </div>

      </div>
    </div>
  );
}
