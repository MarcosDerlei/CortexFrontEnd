import { Search } from "lucide-react";
import cortexLogo from "../assets/cortex.jpg";

export default function Header({ search, setSearch, onLogout }) {
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

      {/* BUSCA */}
      <div className="relative w-72">
       
        
      </div>

      {/* BOTÃO SAIR */}
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
    </header>
  );
}
