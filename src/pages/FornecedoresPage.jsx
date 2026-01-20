import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import Navegacao from "../components/Navegacao";
import MenuRapido from "../components/MenuRapido";
import { Plus, Search, Phone, Trash2, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={
        "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white/80 " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 " +
        "text-slate-900 placeholder:text-slate-400"
      }
    />
  );
}

function BadgeAtivo({ ativo }) {
  return (
    <span
      className={
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border " +
        (ativo
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-slate-50 text-slate-600 border-slate-200")
      }
    >
      {ativo ? "ATIVO" : "INATIVO"}
    </span>
  );
}

function ModalFornecedor({ open, onClose, onSave, initial }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (open) {
      setNome(initial?.nome || "");
      setWhatsapp(initial?.whatsapp || "");
      setAtivo(initial?.ativo ?? true);
    }
  }, [open, initial]);

  if (!open) return null;

  function limparNumero(v) {
    return (v || "").replace(/\D/g, "");
  }

  async function handleSalvar() {
    if (!nome.trim()) return alert("Informe o nome do fornecedor.");
    if (!whatsapp.trim()) return alert("Informe o WhatsApp do fornecedor.");
    const numero = limparNumero(whatsapp);

    await onSave({
      nome: nome.trim(),
      whatsapp: numero,
      ativo,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-slate-200/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-200/70 flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              {initial?.id ? "Editar fornecedor" : "Novo fornecedor"}
            </h2>
            <p className="text-sm text-slate-500">
              Cadastre para permitir pedidos via WhatsApp.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
          >
            Fechar
          </button>
        </div>

        <div className="px-8 py-6 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Nome</label>
            <div className="mt-2">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Vonder" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">WhatsApp</label>
            <div className="mt-2">
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex: 5551988887777"
              />
              <p className="text-xs text-slate-500 mt-2">
                Dica: pode colar com símbolos, o sistema limpa automaticamente.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Status</p>
              <p className="text-xs text-slate-500">Fornecedor disponível para pedidos</p>
            </div>

            <button
              onClick={() => setAtivo((v) => !v)}
              className={
                "px-4 py-2 rounded-xl font-semibold border transition " +
                (ativo
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200")
              }
            >
              {ativo ? "Ativo" : "Inativo"}
            </button>
          </div>
        </div>

        <div className="px-8 pb-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
          >
            Cancelar
          </button>

          <button
            onClick={handleSalvar}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FornecedoresPage() {
  const [loading, setLoading] = useState(true);
  const [fornecedores, setFornecedores] = useState([]);

  const [search, setSearch] = useState("");
  const [somenteAtivos, setSomenteAtivos] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  async function carregar() {
    setLoading(true);
    try {
      const { data } = await api.get(`/compras/fornecedores?somenteAtivos=${somenteAtivos}`);
      setFornecedores(data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar fornecedores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [somenteAtivos]);

  const fornecedoresFiltrados = useMemo(() => {
    const s = (search || "").trim().toLowerCase();
    if (!s) return fornecedores;

    return fornecedores.filter((f) => {
      const nome = (f.nome || "").toLowerCase();
      const whatsapp = (f.whatsapp || "").toLowerCase();
      return nome.includes(s) || whatsapp.includes(s);
    });
  }, [fornecedores, search]);

  async function salvarFornecedor(payload) {
    try {
      if (editing?.id) {
        await api.put(`/compras/fornecedores/${editing.id}`, payload);
      } else {
        await api.post(`/compras/fornecedores`, payload);
      }

      setOpenModal(false);
      setEditing(null);
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar fornecedor.");
    }
  }

  async function toggleAtivo(f) {
    try {
      await api.put(`/compras/fornecedores/${f.id}`, {
        nome: f.nome,
        whatsapp: f.whatsapp,
        ativo: !f.ativo,
      });
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status.");
    }
  }

  async function deletar(f) {
    if (!window.confirm(`Excluir fornecedor "${f.nome}"?`)) return;

    try {
      await api.delete(`/compras/fornecedores/${f.id}`);
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir fornecedor.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Navegação + Menu Rapido */}
        <Navegacao backPath={-1} homePath="/" />

        <div className="mt-6">
          <MenuRapido />
        </div>

        {/* Header */}
        <div className="mt-8 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Fornecedores
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Cadastre fornecedores para vincular itens e gerar pedidos por WhatsApp.
              </p>
            </div>

            <button
              onClick={() => {
                setEditing(null);
                setOpenModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
            >
              <Plus size={18} />
              Novo fornecedor
            </button>
          </div>

          {/* Busca + filtro */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar fornecedor por nome ou WhatsApp..."
                style={{ paddingLeft: 44 }}
              />
            </div>

            <button
              onClick={() => setSomenteAtivos((v) => !v)}
              className={
                "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-semibold transition " +
                (somenteAtivos
                  ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
              }
              title="Filtrar"
            >
              {somenteAtivos ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {somenteAtivos ? "Somente ativos" : "Mostrar todos"}
            </button>
          </div>
        </div>

        {/* Listagem */}
        <div className="mt-8">
          {loading ? (
            <div className="text-slate-600">Carregando fornecedores...</div>
          ) : fornecedoresFiltrados.length === 0 ? (
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200/70 p-8">
              <p className="text-slate-700 font-semibold">Nenhum fornecedor encontrado.</p>
              <p className="text-sm text-slate-500 mt-1">
                Clique em <b>Novo fornecedor</b> para cadastrar o primeiro.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {fornecedoresFiltrados.map((f) => (
                <div
                  key={f.id}
                  className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200/70 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base md:text-lg font-bold text-slate-900">
                        {f.nome}
                      </h3>
                      <BadgeAtivo ativo={f.ativo} />
                    </div>

                    <div className="mt-2 text-sm text-slate-600 flex flex-wrap gap-4">
                      <span className="inline-flex items-center gap-2">
                        <Phone size={16} className="text-slate-400" />
                        {f.whatsapp}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      onClick={() => toggleAtivo(f)}
                      className="px-4 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700"
                      title="Ativar/Inativar"
                    >
                      {f.ativo ? "Inativar" : "Ativar"}
                    </button>

                    <button
                      onClick={() => {
                        setEditing(f);
                        setOpenModal(true);
                      }}
                      className="px-4 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 inline-flex items-center gap-2"
                      title="Editar"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => deletar(f)}
                      className="px-4 py-2 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-semibold inline-flex items-center gap-2"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <ModalFornecedor
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditing(null);
          }}
          onSave={salvarFornecedor}
          initial={editing}
        />
      </div>
    </div>
  );
}
