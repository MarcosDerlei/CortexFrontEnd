import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriaList from "../components/CategoriaList";
import Header from "../components/Header";

export default function CategoriaPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
        onLogout={handleLogout}
      />

      <div className="min-h-screen bg-slate-100/80 px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900">
              Categorias
            </h1>
            <p className="text-slate-600 mt-2">
              Escolha uma categoria para navegar pelo estoque
            </p>
          </header>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70">
            <CategoriaList
              search={search}
              onSelectCategoria={(cat) => {
                navigate(`/categoria/${cat.id}/subcategorias`);
              }}
            />
          </div>

        </div>
      </div>
    </>
  );
}
