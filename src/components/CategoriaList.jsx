import { useEffect, useState } from "react";
import api from "../api/api";
import CategoriaCard from "./categorias/CategoriaCard";

export default function CategoriaList({
  onSelectCategoria,
  onViewCategoria,
  onRegisterEntrada,
  onEditCategoria,
}) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => {
        console.error("Erro ao buscar dashboard de categorias", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-slate-500">
        Carregando categorias...
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categorias.map((cat) => (
        <CategoriaCard
          key={cat.id}
          categoria={cat}
          onClick={() => onSelectCategoria(cat)}
          onView={() => onViewCategoria(cat)}
          onRegisterEntry={() => onRegisterEntrada(cat)}
          onEdit={() => onEditCategoria(cat)}
        />
      ))}
    </div>
  );
}
