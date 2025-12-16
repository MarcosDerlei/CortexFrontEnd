import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import cortexLogo from "../assets/cortex.jpg";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/categorias");
    } catch {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center px-6">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-24 items-center">

        {/* LADO ESQUERDO — MARCA */}
        <div className="text-white flex flex-col items-start">
          
          {/* LOGO COM FUNDO ARREDONDADO */}
          <div className="bg-[#FBF7F2] p-6 rounded-3xl mb-10">
            <img
              src={cortexLogo}
              alt="CÓRTEX"
              className="w-44 h-auto"
            />
          </div>

          {/* SUBTÍTULO */}
          <p className="text-lg text-white/70 tracking-wide uppercase">
            Controle Operacional de Recursos, Tarefas e Execução
          </p>

          {/* DESCRIÇÃO (MAIS ESPAÇADA) */}
          <p className="text-lg text-white/80 mt-12 mb-8 max-w-md">
            Gerencie seu estoque de forma organizada e eficiente
          </p>

          {/* TAGS */}
          <div className="flex gap-3 flex-wrap">
            {[
              "Controle de materiais",
              "Alertas de estoque baixo",
              "Organização hierárquica",
              "Histórico de movimentações",
            ].map(text => (
              <span
                key={text}
                className="bg-white/20 px-5 py-2 rounded-full text-sm backdrop-blur"
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* LADO DIREITO — LOGIN */}
        <form
          onSubmit={handleLogin}
          className="
            bg-[#FBF7F2]
            backdrop-blur
            rounded-3xl
            border border-black/5
            shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]
            p-10
            max-w-sm
            w-full
          "
        >
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Bem-vindo 
          </h2>

          <p className="text-slate-500 text-sm text-center mb-8">
            Entre com suas credenciais
          </p>

          <input
            className="w-full mb-4 p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-6 p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
