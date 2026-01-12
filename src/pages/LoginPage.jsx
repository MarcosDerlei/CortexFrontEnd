import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import cortexLogo from "../assets/cortex.jpg";
import loginBg from "../assets/login-bg.jpg"; // ✅ adiciona uma imagem de fundo

import {
  User,
  Lock,
  Box,
  AlertTriangle,
  ListChecks,
} from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // (opcional) remember state se tu quiser no futuro
      localStorage.setItem("remember_me", remember ? "1" : "0");

      navigate("/categorias");
    } catch {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ✅ Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* ✅ Overlay */}
      <div className="absolute inset-0 bg-emerald-950/60" />

      {/* ✅ Conteúdo */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">

          {/* ==========================
              LADO ESQUERDO — BRAND
             ========================== */}
          <div className="text-white">
            {/* Logo */}
            <div className="flex items-center gap-8 mb-10">
              <div className="bg-white/95 p-6 rounded-3xl shadow-xl">
                <img src={cortexLogo} alt="CÓRTEX" className="w-28 h-auto" />
              </div>

              <div>
                <h1 className="text-6xl font-semibold tracking-wide">
                  CÓRTEX
                </h1>
                <p className="text-white/70 tracking-wide mt-2 uppercase text-sm">
                  Controle Operacional de Recursos, Tarefas e Execução
                </p>
              </div>
            </div>

            {/* Features list (igual a referência) */}
            <div className="flex flex-col gap-5 max-w-xl">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    Controle inteligente de estoque
                  </p>
                  <p className="text-white/70 text-sm">
                    Monitore e organize seu estoque de forma eficiente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    Alertas de reposição
                  </p>
                  <p className="text-white/70 text-sm">
                    Receba notificações quando itens estiverem abaixo do nível mínimo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur">
                  <ListChecks className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    Histórico completo de movimentações
                  </p>
                  <p className="text-white/70 text-sm">
                    Acompanhe entradas, saídas e reservas com detalhes precisos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================
              LADO DIREITO — LOGIN
             ========================== */}
          <form
            onSubmit={handleLogin}
            className="
           w-full max-w-md mx-auto
           rounded-3xl
           bg-white/80
           backdrop-blur-xl
           ring-1 ring-white/30
           shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)]
           p-10
           "
          >
            <h2 className="text-2xl font-semibold text-slate-900 text-center">
              Bem-vindo de volta!
            </h2>

            <p className="text-slate-500 text-sm text-center mt-1 mb-8">
              Entre com suas credenciais
            </p>

            {/* input usuário */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-5 h-5" />
              </span>

              <input
                className="
                  w-full
                  pl-12 pr-4 py-3
                  rounded-xl
                  border border-slate-200
                  bg-white/95
                  focus:outline-none
                  focus:ring-2 focus:ring-emerald-500/60
                "
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* input senha */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>

              <input
                type="password"
                className="
                  w-full
                  pl-12 pr-4 py-3
                  rounded-xl
                  border border-slate-200
                  bg-white
                  focus:outline-none
                  focus:ring-2 focus:ring-emerald-500/60
                "
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* lembrar + esqueceu */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-emerald-600"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Lembrar de mim
              </label>

              <button
                type="button"
                className="text-emerald-700 hover:text-emerald-800 font-medium"
                onClick={() => alert("Funcionalidade de recuperação ainda não implementada.")}
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* botão */}
            <button
              className="
                w-full
                py-3 rounded-xl
                font-semibold text-white
                bg-gradient-to-r from-emerald-600 to-teal-600
                hover:from-emerald-700 hover:to-teal-700
                shadow-lg shadow-emerald-600/20
                transition
              "
            >
              Entrar
            </button>

            <p className="text-center text-slate-500 text-sm mt-6">
              Precisa de ajuda?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
