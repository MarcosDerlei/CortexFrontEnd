import { Search } from "lucide-react";
import cortexLogo from "../assets/cortex.jpg";

export default function Header({ search, setSearch /* onLogout */ }) {
  return (
    <header
      className="
        bg-[#FAFAF8]
        border-b border-black/5
        px-8 py-4
        flex items-center justify-between
        rounded-b-3xl
      "
    >
      {/* LOGO + MARCA */}
      <div className="flex items-center gap-3">
        <img
          src={cortexLogo}
          alt="CÓRTEX"
          className="w-10 h-10 rounded-xl"
        />
        <div>
          <h1 className="font-semibold text-lg leading-tight">
            CÓRTEX
          </h1>
          <p className="text-xs text-slate-500">
            Controle Operacional de Recursos, Tarefas e Execução
          </p>
        </div>
      </div>

      {/* BUSCA — ficará ativa depois */}
      <div className="relative w-72">
        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
        {/* 
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        */}
      </div>

      {/* BOTÃO SAIR — DESATIVADO TEMPORARIAMENTE */}
      {/* 
      <button
        onClick={onLogout}
        className="
          px-4 py-2
          rounded-xl
          bg-red-50
          text-red-600
          text-sm font-medium
          hover:bg-red-100
          transition
        "
      >
        Sair
      </button>
      */}
    </header>
  );
}
