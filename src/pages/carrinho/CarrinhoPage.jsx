import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Navegacao from "../../components/Navegacao";
import MenuRapido from "../../components/MenuRapido";
import { ShoppingCart } from "lucide-react";

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
      {/* Header fornecedor */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded-xl" />
      </div>

      {/* Itens */}
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

      {/* Subtotal */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

// ✅ Skeleton completo do carrinho
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

export default function CarrinhoPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState(null);

  async function carregarCarrinho() {
    setLoading(true);
    try {
      const { data } = await api.get("/compras/carrinho");
      setCarrinho(data);
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

  // ✅ agrupar itens por fornecedor
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

  function abrirWhatsapp(whatsapp, mensagem) {
    const numero = (whatsapp || "").replace(/\D/g, "");
    if (!numero) return alert("Fornecedor sem WhatsApp cadastrado!");

    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }

  async function removerItem(itemCarrinhoId) {
    if (!window.confirm("Remover este item do carrinho?")) return;

    try {
      await api.delete(`/compras/carrinho/itens/${itemCarrinhoId}`);
      await carregarCarrinho();
    } catch (err) {
      console.error("Erro ao remover item:", err);
      alert("Erro ao remover item do carrinho.");
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
          // Carrinho não encontrado
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
                    Status: <b className="text-slate-700">{carrinho.status}</b> • Itens:{" "}
                    <b className="text-slate-700">{carrinho.itens?.length ?? 0}</b>
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

                    return (
                      <div
                        key={grupo.fornecedorId}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        {/* fornecedor */}
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h2 className="text-base font-bold text-slate-900">
                              {grupo.fornecedorNome}
                            </h2>
                            <p className="text-sm text-slate-500">
                              WhatsApp: {grupo.fornecedorWhatsapp}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              const msg = gerarMensagemFornecedor(
                                grupo.fornecedorNome,
                                grupo.itens
                              );
                              abrirWhatsapp(grupo.fornecedorWhatsapp, msg);
                            }}
                            className="px-5 py-3 rounded-xl text-white font-semibold shadow-sm transition bg-blue-600 hover:bg-blue-700"
                          >
                            Gerar pedido (WhatsApp)
                          </button>
                        </div>

                        {/* itens */}
                        <div className="mt-4 flex flex-col gap-3">
                          {grupo.itens.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50"
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

                                <button
                                  onClick={() => removerItem(item.id)}
                                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* subtotal */}
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
    </div>
  );
}