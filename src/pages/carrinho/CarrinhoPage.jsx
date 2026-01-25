import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Navegacao from "../../components/Navegacao";
import MenuRapido from "../../components/MenuRapido";
import { ShoppingCart, Check, X, Send, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// ✅ Skeleton para header do carrinho
function CarrinhoHeaderSkeleton() {
  return (
    <div className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-7 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-36 bg-slate-200 rounded" />
        </div>
        <div className="text-right">
          <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
          <div className="h-7 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// ✅ Skeleton para grupo de fornecedor
function FornecedorGrupoSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded-xl" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <div className="h-5 w-40 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-56 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-20 bg-slate-200 rounded" />
              <div className="h-10 w-20 bg-slate-200 rounded-xl" />
              <div className="h-10 w-24 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

function CarrinhoSkeleton() {
  return (
    <>
      <CarrinhoHeaderSkeleton />
      <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70">
        <div className="flex flex-col gap-6">
          <FornecedorGrupoSkeleton />
          <FornecedorGrupoSkeleton />
        </div>
      </div>
    </>
  );
}

// ✅ Modal de confirmação após enviar pedido
function ModalConfirmarEnvio({ open, onClose, onConfirm, fornecedorNome }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-slate-200/70 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Send size={32} className="text-green-600" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Pedido enviado!
          </h2>

          <p className="text-slate-600 mb-6">
            O WhatsApp foi aberto com o pedido para <b>{fornecedorNome}</b>.
            <br />
            Deseja marcar este pedido como <b>enviado</b>?
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
            >
              Não, manter rascunho
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold inline-flex items-center gap-2"
            >
              <Check size={18} />
              Sim, marcar como enviado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Badge de status do pedido por fornecedor
function StatusBadge({ status }) {
  const styles = {
    RASCUNHO: "bg-slate-100 text-slate-600 border-slate-200",
    ENVIADO: "bg-blue-100 text-blue-700 border-blue-200",
    CONFIRMADO: "bg-green-100 text-green-700 border-green-200",
  };

  const icons = {
    RASCUNHO: <Clock size={14} />,
    ENVIADO: <Send size={14} />,
    CONFIRMADO: <CheckCircle size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
        styles[status] || styles.RASCUNHO
      }`}
    >
      {icons[status]}
      {status}
    </span>
  );
}

export default function CarrinhoPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState(null);

  // ✅ Estado para controlar status por fornecedor (local)
  const [statusPorFornecedor, setStatusPorFornecedor] = useState({});

  // ✅ Modal de confirmação de envio
  const [modalEnvio, setModalEnvio] = useState({
    open: false,
    fornecedorId: null,
    fornecedorNome: "",
  });

  async function carregarCarrinho() {
    setLoading(true);
    try {
      const { data } = await api.get("/compras/carrinho");
      setCarrinho(data);

      // Inicializa status por fornecedor como RASCUNHO
      if (data?.itens?.length) {
        const fornecedorIds = [...new Set(data.itens.map((i) => i.fornecedorId))];
        const statusInicial = {};
        fornecedorIds.forEach((id) => {
          statusInicial[id] = statusPorFornecedor[id] || "RASCUNHO";
        });
        setStatusPorFornecedor(statusInicial);
      }
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      setCarrinho(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  function formatMoney(v) {
    return (v ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // ✅ Agrupar itens por fornecedor
  const grupos = useMemo(() => {
    if (!carrinho?.itens?.length) return [];

    const map = new Map();

    carrinho.itens.forEach((item) => {
      if (!map.has(item.fornecedorId)) {
        map.set(item.fornecedorId, {
          fornecedorId: item.fornecedorId,
          fornecedorNome: item.fornecedorNome,
          fornecedorWhatsapp: item.fornecedorWhatsapp,
          itens: [],
        });
      }
      map.get(item.fornecedorId).itens.push(item);
    });

    return Array.from(map.values());
  }, [carrinho]);

  function gerarMensagemFornecedor(fornecedorNome, itens) {
    const linhas = itens.map((i) => {
      return `• ${i.descricao} (${i.sku}) - ${i.quantidade} ${i.unidadeItem} - ${formatMoney(i.preco)} = ${formatMoney(i.subtotal)}`;
    });

    const totalFornecedor = itens.reduce((acc, i) => acc + (i.subtotal || 0), 0);

    return (
      `Olá, ${fornecedorNome}! Tudo bem?\n` +
      `Gostaria de fazer o pedido:\n\n` +
      linhas.join("\n") +
      `\n\nTotal: ${formatMoney(totalFornecedor)}`
    );
  }

  // ✅ Abrir WhatsApp e mostrar modal de confirmação
  function enviarPedidoWhatsApp(grupo) {
    const numero = (grupo.fornecedorWhatsapp || "").replace(/\D/g, "");
    if (!numero) {
      toast.error("Fornecedor sem WhatsApp cadastrado!");
      return;
    }

    const mensagem = gerarMensagemFornecedor(grupo.fornecedorNome, grupo.itens);
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");

    // Abre modal perguntando se quer marcar como enviado
    setModalEnvio({
      open: true,
      fornecedorId: grupo.fornecedorId,
      fornecedorNome: grupo.fornecedorNome,
    });
  }

  // ✅ Marcar pedido como ENVIADO
  function marcarComoEnviado() {
    setStatusPorFornecedor((prev) => ({
      ...prev,
      [modalEnvio.fornecedorId]: "ENVIADO",
    }));

    toast.success(`Pedido para ${modalEnvio.fornecedorNome} marcado como enviado!`);
    setModalEnvio({ open: false, fornecedorId: null, fornecedorNome: "" });
  }

  // ✅ Confirmar recebimento do pedido (fornecedor confirmou)
  async function confirmarPedido(grupo) {
    const confirmar = window.confirm(
      `Confirmar que o fornecedor "${grupo.fornecedorNome}" confirmou o pedido?\n\nIsso irá remover os itens do carrinho.`
    );

    if (!confirmar) return;

    try {
      // Remove todos os itens desse fornecedor do carrinho
      for (const item of grupo.itens) {
        await api.delete(`/compras/carrinho/itens/${item.id}`);
      }

      toast.success(`Pedido de ${grupo.fornecedorNome} confirmado e removido do carrinho!`);

      // Recarrega carrinho
      await carregarCarrinho();
    } catch (err) {
      console.error("Erro ao confirmar pedido:", err);
      toast.error("Erro ao confirmar pedido.");
    }
  }

  // ✅ Cancelar pedido (volta para rascunho)
  function cancelarPedido(grupo) {
    setStatusPorFornecedor((prev) => ({
      ...prev,
      [grupo.fornecedorId]: "RASCUNHO",
    }));
    toast.info(`Pedido de ${grupo.fornecedorNome} voltou para rascunho.`);
  }

  async function removerItem(itemCarrinhoId) {
    if (!window.confirm("Remover este item do carrinho?")) return;

    try {
      await api.delete(`/compras/carrinho/itens/${itemCarrinhoId}`);
      toast.success("Item removido do carrinho!");
      await carregarCarrinho();
    } catch (err) {
      console.error("Erro ao remover item:", err);
      toast.error("Erro ao remover item do carrinho.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100/80 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Navegação */}
        <Navegacao backPath={-1} homePath="/categorias" />

        {/* ✅ Menu rápido */}
        <div className="mt-6">
          <MenuRapido />
        </div>

        {/* ✅ SKELETON durante loading */}
        {loading ? (
          <CarrinhoSkeleton />
        ) : !carrinho ? (
          <div className="mt-8 bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70 text-center">
            <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Carrinho
            </h1>
            <p className="mt-2 text-slate-500">Nenhum carrinho encontrado.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-3xl px-8 py-6 shadow-sm border border-slate-200/70">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                    Carrinho de Compras
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Itens: <b className="text-slate-700">{carrinho.itens?.length ?? 0}</b>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500 font-semibold">
                    Total estimado
                  </p>
                  <p className="text-xl font-extrabold text-slate-900">
                    {formatMoney(carrinho.totalEstimado)}
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-sm border border-slate-200/70">
              {grupos.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {grupos.map((grupo) => {
                    const subtotalFornecedor = grupo.itens.reduce(
                      (acc, i) => acc + (i.subtotal || 0),
                      0
                    );

                    const status = statusPorFornecedor[grupo.fornecedorId] || "RASCUNHO";

                    return (
                      <div
                        key={grupo.fornecedorId}
                        className={`rounded-2xl border p-5 ${
                          status === "ENVIADO"
                            ? "border-blue-200 bg-blue-50/50"
                            : status === "CONFIRMADO"
                            ? "border-green-200 bg-green-50/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        {/* Header do fornecedor */}
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div>
                              <h2 className="text-base font-bold text-slate-900">
                                {grupo.fornecedorNome}
                              </h2>
                              <p className="text-sm text-slate-500">
                                WhatsApp: {grupo.fornecedorWhatsapp}
                              </p>
                            </div>
                            <StatusBadge status={status} />
                          </div>

                          {/* Botões de ação baseado no status */}
                          <div className="flex gap-2 flex-wrap">
                            {status === "RASCUNHO" && (
                              <button
                                onClick={() => enviarPedidoWhatsApp(grupo)}
                                className="px-5 py-3 rounded-xl text-white font-semibold shadow-sm transition bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2"
                              >
                                <Send size={16} />
                                Gerar pedido (WhatsApp)
                              </button>
                            )}

                            {status === "ENVIADO" && (
                              <>
                                <button
                                  onClick={() => confirmarPedido(grupo)}
                                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold inline-flex items-center gap-2"
                                >
                                  <CheckCircle size={16} />
                                  Confirmar Recebimento
                                </button>

                                <button
                                  onClick={() => enviarPedidoWhatsApp(grupo)}
                                  className="px-4 py-2 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold inline-flex items-center gap-2"
                                >
                                  <Send size={16} />
                                  Reenviar
                                </button>

                                <button
                                  onClick={() => cancelarPedido(grupo)}
                                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold inline-flex items-center gap-2"
                                >
                                  <X size={16} />
                                  Cancelar
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Itens */}
                        <div className="mt-4 flex flex-col gap-3">
                          {grupo.itens.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white"
                            >
                              <div>
                                <p className="font-bold text-slate-900">
                                  {item.descricao}
                                </p>

                                <p className="text-sm text-slate-500">
                                  SKU: {item.sku} • {item.quantidade} {item.unidadeItem} •{" "}
                                  {formatMoney(item.preco)}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <p className="font-extrabold text-slate-900">
                                  {formatMoney(item.subtotal)}
                                </p>

                                <button
                                  onClick={() => navigate(`/item/${item.sku}`)}
                                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
                                >
                                  Ver item
                                </button>

                                {status === "RASCUNHO" && (
                                  <button
                                    onClick={() => removerItem(item.id)}
                                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                                  >
                                    Remover
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Subtotal */}
                        <div className="mt-4 flex items-center justify-between font-bold text-slate-900">
                          <span>Subtotal fornecedor</span>
                          <span>{formatMoney(subtotalFornecedor)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ✅ Modal de confirmação de envio */}
      <ModalConfirmarEnvio
        open={modalEnvio.open}
        onClose={() => setModalEnvio({ open: false, fornecedorId: null, fornecedorNome: "" })}
        onConfirm={marcarComoEnviado}
        fornecedorNome={modalEnvio.fornecedorNome}
      />
    </div>
  );
}