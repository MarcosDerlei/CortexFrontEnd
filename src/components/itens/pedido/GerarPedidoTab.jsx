import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  listarFornecedoresDoItem,
  adicionarNoCarrinho,
  listarFornecedoresAtivos,
  vincularFornecedorAoItem,
  atualizarVinculoItemFornecedor,
} from "../../../services/comprasApi";

import {
  ShoppingCart,
  Store,
  DollarSign,
  PlusCircle,
  Link2,
  Pencil,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function GerarPedidoTab({ item }) {
  const navigate = useNavigate();

  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresAtivos, setFornecedoresAtivos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [itemFornecedorId, setItemFornecedorId] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  // ✅ evita duplo clique ao adicionar
  const [adicionando, setAdicionando] = useState(false);

  // ✅ modo vínculo
  const [modoVinculo, setModoVinculo] = useState(false);
  const [novoFornecedorId, setNovoFornecedorId] = useState("");
  const [novoPrecoReferencia, setNovoPrecoReferencia] = useState("");
  const [novaUnidadeCompra, setNovaUnidadeCompra] = useState("UN");
  const [vinculando, setVinculando] = useState(false);

  // ✅ modo edição vínculo
  const [editandoId, setEditandoId] = useState(null);
  const [editPreco, setEditPreco] = useState("");
  const [editUnidade, setEditUnidade] = useState("UN");
  const [editAtivo, setEditAtivo] = useState(true);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  async function load() {
    if (!item?.id) return;

    try {
      setLoading(true);

      const [dataVinculos, dataFornecedoresAtivos] = await Promise.all([
        listarFornecedoresDoItem(item.id),
        listarFornecedoresAtivos(),
      ]);

      setFornecedores(dataVinculos || []);
      setFornecedoresAtivos(dataFornecedoresAtivos || []);

      // auto-seleciona o primeiro fornecedor
      if (dataVinculos?.length > 0) {
        setItemFornecedorId(dataVinculos[0].itemFornecedorId);
        setModoVinculo(false);
      } else {
        setItemFornecedorId(null);
        setModoVinculo(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar fornecedores do item.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [item?.id]);

  const fornecedorSelecionado = useMemo(() => {
    return fornecedores.find((f) => f.itemFornecedorId === itemFornecedorId);
  }, [fornecedores, itemFornecedorId]);

  const subtotal = useMemo(() => {
    const preco = fornecedorSelecionado?.precoReferencia || 0;
    const qtd = Number(quantidade) || 0;
    return preco * qtd;
  }, [fornecedorSelecionado, quantidade]);

  async function handleAdicionarCarrinho() {
    if (adicionando) return;

    if (!itemFornecedorId) {
      return toast.warning("Selecione um fornecedor.");
    }

    const qtd = Number(quantidade);
    if (!qtd || qtd <= 0) {
      return toast.warning("Quantidade inválida.");
    }

    const toastId = toast.loading("Adicionando ao carrinho...");

    try {
      setAdicionando(true);

      await adicionarNoCarrinho(itemFornecedorId, qtd);

      toast.success("Item adicionado ao carrinho!", {
        id: toastId,
        action: {
          label: "Ver carrinho",
          onClick: () => navigate("/carrinho"),
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar item ao carrinho.", { id: toastId });
    } finally {
      setAdicionando(false);
    }
  }

  async function handleVincularFornecedor() {
    if (vinculando) return;

    if (!novoFornecedorId) return toast.warning("Selecione um fornecedor.");
    if (!novoPrecoReferencia) return toast.warning("Informe o preço referência.");

    const preco = Number(novoPrecoReferencia);
    if (isNaN(preco) || preco <= 0) return toast.warning("Preço inválido.");

    const toastId = toast.loading("Vinculando fornecedor...");

    try {
      setVinculando(true);

      await vincularFornecedorAoItem({
        itemId: item.id,
        fornecedorId: Number(novoFornecedorId),
        precoReferencia: preco,
        unidadeCompra: novaUnidadeCompra,
        ativo: true,
      });

      toast.success("Fornecedor vinculado com sucesso!", { id: toastId });

      // reset form
      setNovoFornecedorId("");
      setNovoPrecoReferencia("");
      setNovaUnidadeCompra("UN");

      await load();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao vincular fornecedor.", { id: toastId });
    } finally {
      setVinculando(false);
    }
  }

  function abrirEdicao(v) {
    setEditandoId(v.itemFornecedorId);
    setEditPreco(String(v.precoReferencia ?? ""));
    setEditUnidade(v.unidadeCompra ?? "UN");
    setEditAtivo(v.ativo ?? true);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditPreco("");
    setEditUnidade("UN");
    setEditAtivo(true);
  }

  async function salvarEdicao(v) {
    if (salvandoEdicao) return;

    const preco = Number(editPreco);
    if (!editPreco || isNaN(preco) || preco <= 0) {
      return toast.warning("Preço inválido.");
    }
    if (!editUnidade || editUnidade.trim().length === 0) {
      return toast.warning("Informe a unidade de compra.");
    }

    const toastId = toast.loading("Salvando vínculo...");

    try {
      setSalvandoEdicao(true);

      await atualizarVinculoItemFornecedor(v.itemFornecedorId, {
        precoReferencia: preco,
        unidadeCompra: editUnidade.trim(),
        ativo: Boolean(editAtivo),
      });

      toast.success("Vínculo atualizado com sucesso!", { id: toastId });

      cancelarEdicao();
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar vínculo.", { id: toastId });
    } finally {
      setSalvandoEdicao(false);
    }
  }

  if (!item) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Gerar Pedido</h3>
      <p className="text-sm text-slate-500 mb-6">
        Escolha o fornecedor e informe a quantidade para adicionar ao carrinho.
      </p>

      {/* fornecedor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-orange-500" />
            <h4 className="text-sm font-semibold text-slate-600">
              Fornecedores disponíveis
            </h4>
          </div>

          {/* ✅ botão para abrir modo vínculo */}
          {!modoVinculo && (
            <button
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2"
              onClick={() => setModoVinculo(true)}
            >
              <Link2 size={16} />
              Vincular fornecedor
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Carregando fornecedores...</p>
        ) : fornecedores.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Nenhum fornecedor vinculado para este item.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Para gerar pedido, primeiro vincule um fornecedor.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {fornecedores.map((f) => {
              const selecionado = itemFornecedorId === f.itemFornecedorId;
              const editando = editandoId === f.itemFornecedorId;

              return (
                <div
                  key={f.itemFornecedorId}
                  className={`p-3 rounded-xl border ${
                    selecionado
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {/* Linha principal */}
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={selecionado}
                        onChange={() => setItemFornecedorId(f.itemFornecedorId)}
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {f.fornecedorNome}
                        </p>
                        <p className="text-xs text-slate-500">
                          WhatsApp: {f.fornecedorWhatsapp || "-"} • Unidade:{" "}
                          {f.unidadeCompra || "-"}
                        </p>

                        <div className="mt-2">
                          {f.ativo ? (
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ATIVO
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
                              INATIVO
                            </span>
                          )}
                        </div>
                      </div>
                    </label>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        R$ {Number(f.precoReferencia || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">preço referência</p>

                      {!editando && (
                        <button
                          onClick={() => abrirEdicao(f)}
                          className="mt-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-2"
                        >
                          <Pencil size={14} />
                          Editar vínculo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ✅ Editor inline */}
                  {editando && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600">
                            Preço referência
                          </p>
                          <input
                            type="number"
                            value={editPreco}
                            onChange={(e) => setEditPreco(e.target.value)}
                            className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-600">
                            Unidade compra
                          </p>
                          <input
                            value={editUnidade}
                            onChange={(e) => setEditUnidade(e.target.value)}
                            className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2"
                            placeholder="UN / CX / KG..."
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-600">
                            Status
                          </p>

                          <button
                            onClick={() => setEditAtivo((prev) => !prev)}
                            className={`w-full mt-1 border rounded-xl px-3 py-2 text-sm font-semibold transition ${
                              editAtivo
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "bg-slate-100 border-slate-200 text-slate-700"
                            }`}
                          >
                            {editAtivo ? "Ativo" : "Inativo"}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          onClick={cancelarEdicao}
                          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>

                        <button
                          onClick={() => salvarEdicao(f)}
                          disabled={salvandoEdicao}
                          className={`px-5 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 ${
                            salvandoEdicao
                              ? "bg-slate-400"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          {salvandoEdicao ? "Salvando..." : "Salvar edição"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ FORM VINCULAR */}
        {modoVinculo && (
          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <PlusCircle size={18} className="text-blue-600" />
                <p className="text-sm font-bold text-slate-900">
                  Vincular fornecedor ao item
                </p>
              </div>

              <button
                onClick={() => setModoVinculo(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-600">Fornecedor</p>
                <select
                  value={novoFornecedorId}
                  onChange={(e) => setNovoFornecedorId(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="">Selecione...</option>
                  {fornecedoresAtivos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome} ({f.whatsapp})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Preço referência
                </p>
                <input
                  type="number"
                  value={novoPrecoReferencia}
                  onChange={(e) => setNovoPrecoReferencia(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2"
                  placeholder="Ex: 39.90"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Unidade compra
                </p>
                <input
                  value={novaUnidadeCompra}
                  onChange={(e) => setNovaUnidadeCompra(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2"
                  placeholder="UN / CX / KG..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleVincularFornecedor}
                disabled={vinculando}
                className={`px-5 py-2 rounded-xl text-white text-sm font-semibold ${
                  vinculando ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {vinculando ? "Vinculando..." : "Salvar vínculo"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* quantidade + subtotal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-600 mb-2">Quantidade</p>

          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />

          <p className="text-xs text-slate-500 mt-2">
            Item: <span className="font-medium">{item.descricao}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-600" />
            <p className="text-sm font-semibold text-slate-600">
              Subtotal estimado
            </p>
          </div>

          <p className="text-2xl font-extrabold text-slate-900">
            R$ {subtotal.toFixed(2)}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            (quantidade × preço do fornecedor)
          </p>
        </div>
      </div>

      {/* ação */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleAdicionarCarrinho}
          disabled={adicionando || fornecedores.length === 0 || loading}
          className={`px-5 py-3 rounded-xl text-white flex items-center gap-2 shadow-sm transition ${
            adicionando || fornecedores.length === 0 || loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <ShoppingCart size={18} />
          {adicionando ? "Adicionando..." : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}
