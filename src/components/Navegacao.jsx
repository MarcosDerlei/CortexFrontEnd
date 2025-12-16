import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function Navegacao({ backPath = null }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 mb-6">

      {/* Voltar para Página Anterior */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
        onClick={() => backPath ? navigate(backPath) : navigate(-1)}
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      {/* Voltar para Página Principal */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white"
        onClick={() => navigate("/")}
      >
        <Home size={18} />
        Início
      </button>

    </div>
  );
}
