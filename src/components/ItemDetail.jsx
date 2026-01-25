import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Layers,
  MapPin,
  Factory,
  DollarSign,
  Clock,
  ClipboardList,
  History,
  ShoppingCart,
  Pencil,
  ArrowRightLeft,
} from "lucide-react";

// ✅ ajuste o caminho conforme teu projeto
import GerarPedidoTab from "./itens/pedido/GerarPedidoTab";
import ModalHistorico from "./ModalHistorico";

// ✅ Skeleton para cards de informação
function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 bg-slate-200 rounded" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
      <div className="h-6 w-24 bg-slate-200 rounded" />
    </div>
  );
}

// ✅ Skeleton completo
function ItemDetailSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ItemCardSkeleton key={i} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3 justify-end animate-pulse">
        <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function ItemDetail({ item }) {
  const navigate = useNavigate();

  const [showMovModal, setShowMovModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ Modal de histórico (popup)
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

  // ✅ Tabs (histórico NÃO é mais tab)
  const [tabAtiva, setTabAtiva] = useState("pedido");

  // 🔹 Estado do formulário do modal MOVIMENTO
  const [tipo, setTipo] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");

  // 🔹 Estado do formulário do modal EDITAR ITEM
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [custoUnitario, setCustoUnitario] = useState(0);
  const [pontoReposicao, setPontoReposicao] = useState(0);
  const [obsItem, setObsItem] = useState("");
  const [ativo, setAtivo] = useState(true);

  // ✅ estado interno do item (pra atualizar sem reload)
  const [itemAtual, setItemAtual] = useState(item);

  // 🟢 Quando o item chegar (props), sincroniza
  useEffect(() => {
    if (item) {
      setItemAtual(item);

      setDescricao(item.descricao || "");
      setLocalizacao(item.localizacao || "");
      setFornecedor(item.fornecedor || "");
      setCustoUnitario(item.custoUnitario || 0);
      setPontoReposicao(item.pontoReposicao || 0);
      setObsItem(item.observacao || "");
      setAtivo(item.ativo ?? true);
    }
  }, [item]);

  // ✅ recarrega do backend (pra refletir alterações sem reload)
  async function recarregarItem() {
    try {
      const { data } = await api.get(`/itens/sku/${itemAtual?.sku || item?.sku}`);
      setItemAtual(data);

      // sincroniza o form também
      setDescricao(data.descricao || "");
      setLocalizacao(data.localizacao || "");
      setFornecedor(data.fornecedor || "");
      setCustoUnitario(data.custoUnitario || 0);
      setPontoReposicao(data.pontoReposicao || 0);
      setObsItem(data.observacao || "");
      setAtivo(data.ativo ?? true);
    } catch (err) {
      console.error("Erro ao recarregar item:", err);
    }
  }

  // ✅ SKELETON em vez de "Carregando..."
  if (!itemAtual) return <ItemDetailSkeleton />;

  // 🔸 Barra de estoque
  const estoqueMinimo = itemAtual.pontoReposicao ?? 0;
  const porcentagem =
    estoqueMinimo > 0 ? Math.min(100, (itemAtual.saldo / estoqueMinimo) * 100) : 100;

  const getBarColor = () => {
    if (porcentagem >= 80) return "bg-green-500";
    if (porcentagem >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  const tabBtnBase =
    "px-4 py-2 text-sm rounded-xl flex items-center gap-2 border transition";
  const tabBtnAtivo = "bg-blue-600 text-white border-blue-600 shadow-sm";
  const tabBtnInativo =
    "bg-white hover:bg-slate-50 text-slate-700 border-slate-200";

  // ✔️ Registrar movimento (sem alert / sem reload)
  const registrarMovimento = async () => {
    const qtd = Number(quantidade);

    if (!qtd || qtd <= 0) {
      return toast.warning("Informe uma quantidade válida.");
    }

    const toastId = toast.loading("Registrando movimento...");

    try {
      await api.post("/movimentos", {
        sku: itemAtual.sku,
        tipo,
        quantidade: qtd,
        observacao,
      });

      toast.success("Movimento registrado com sucesso!", { id: toastId });

      setShowMovModal(false);

      // limpa form
      setQuantidade("");
      setObservacao("");
      setTipo("ENTRADA");

      // atualiza item (saldo / ultimaAtualizacao etc)
      await recarregarItem();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar movimento!", { id: toastId });
    }
  };

  // ✔️ Salvar edição do item (sem alert / sem reload)
  const salvarEdicao = async () => {
    const toastId = toast.loading("Salvando alterações...");

    try {
      await api.put(`/itens/${itemAtual.sku}`, {
        descricao,
        localizacao,
        fornecedor,
        custoUnitario: Number(custoUnitario),
        pontoReposicao: Number(pontoReposicao),
        observacao: obsItem,
        ativo,
      });

      toast.success("Item atualizado com sucesso!", { id: toastId });

      setShowEditModal(false);

      // atualiza item em tela
      await recarregarItem();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar item!", { id: toastId });
    }
  };

  return (
    <div>
      {/* Seções (cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estoque */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-blue-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Quantidade em Estoque
            </h3>
          </div>

          <p className="text-lg font-bold text-gray-800 mb-2">
            {itemAtual.saldo} unidades
          </p>

          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`${getBarColor()} h-3 rounded-full`}
              style={{ width: `${porcentagem}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Estoque mínimo: {estoqueMinimo} unidades
          </p>
        </div>

        {/* Valor */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Valor Unitário
            </h3>
          </div>

          <p className="text-lg font-bold text-gray-800">
            R$ {Number(itemAtual.custoUnitario || 0).toFixed(2)}
          </p>

          <p className="text-xs text-gray-500 mt-1">(valor interno do item)</p>
        </div>

        {/* Localização */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-purple-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">Localização</h3>
          </div>
          <p className="text-gray-700">{itemAtual.localizacao || "-"}</p>
        </div>

        {/* Fornecedor */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="text-orange-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">Fornecedor</h3>
          </div>
          <p className="text-gray-700">{itemAtual.fornecedor || "-"}</p>
        </div>

        {/* Última Atualização */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-gray-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Última Atualização
            </h3>
          </div>
          <p className="text-gray-700">
            {itemAtual.ultimaAtualizacao
              ? new Date(itemAtual.ultimaAtualizacao).toLocaleDateString("pt-BR")
              : "-"}
          </p>
        </div>

        {/* Observação */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="text-gray-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">Observação</h3>
          </div>
          <p className="text-gray-700">
            {itemAtual.observacao || "Sem observações."}
          </p>
        </div>
      </div>

      {/* ✅ Tabs reais */}
      <div className="mt-10 flex flex-wrap gap-3 justify-end">
        {/* ✅ Histórico virou modal (não é tab) */}
        <button
          className={`${tabBtnBase} ${tabBtnInativo}`}
          onClick={() => setShowHistoricoModal(true)}
        >
          <History size={16} />
          Histórico
        </button>

        <button
          className={`${tabBtnBase} ${
            tabAtiva === "editar" ? tabBtnAtivo : tabBtnInativo
          }`}
          onClick={() => setTabAtiva("editar")}
        >
          <Pencil size={16} />
          Editar item
        </button>

        <button
          className={`${tabBtnBase} ${
            tabAtiva === "movimentar" ? tabBtnAtivo : tabBtnInativo
          }`}
          onClick={() => setTabAtiva("movimentar")}
        >
          <ArrowRightLeft size={16} />
          Movimentar
        </button>

        <button
          className={`${tabBtnBase} ${
            tabAtiva === "pedido"
              ? tabBtnAtivo
              : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
          }`}
          onClick={() => setTabAtiva("pedido")}
        >
          <ShoppingCart size={16} />
          Gerar Pedido
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="mt-6">
        {tabAtiva === "editar" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">
                Editar informações do item
              </h3>
              <p className="text-xs text-slate-500">
                Alterar descrição, localização, custo, reposição etc.
              </p>
            </div>

            <button
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onClick={() => setShowEditModal(true)}
            >
              Abrir edição
            </button>
          </div>
        )}

        {tabAtiva === "movimentar" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">
                Movimentar estoque
              </h3>
              <p className="text-xs text-slate-500">
                Entrada, saída, ajuste, reserva, devolução.
              </p>
            </div>

            <button
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              onClick={() => setShowMovModal(true)}
            >
              Abrir movimentação
            </button>
          </div>
        )}

        {tabAtiva === "pedido" && <GerarPedidoTab item={itemAtual} />}
      </div>

      {/* ✅ MODAL HISTÓRICO */}
      {showHistoricoModal && (
        <ModalHistorico
          sku={itemAtual.sku}
          onClose={() => setShowHistoricoModal(false)}
        />
      )}

      {/* ================= MODAL MOVIMENTO ================= */}
      {showMovModal && (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Movimentar Estoque — {itemAtual.descricao}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label>Tipo de Movimento</label>
                <select
                  className="border rounded-lg px-3 py-2 mt-1"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                  <option value="AJUSTE">Ajuste</option>
                  <option value="DEVOLUCAO">Devolução</option>
                  <option value="RESERVADO">Reservar</option>
                  <option value="LIBERACAO">Liberar Reserva</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label>Quantidade</label>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 mt-1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label>Observação</label>
                <textarea
                  rows="3"
                  className="border rounded-lg px-3 py-2 mt-1"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowMovModal(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-green-600 rounded-lg text-white"
                onClick={registrarMovimento}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDITAR ================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Editar Item — {itemAtual.sku}
            </h3>

            <div className="flex flex-col gap-4">
              <label>Descrição</label>
              <input
                className="border rounded-lg px-3 py-2"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <label>Localização</label>
              <input
                className="border rounded-lg px-3 py-2"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
              />

              <label>Fornecedor</label>
              <input
                className="border rounded-lg px-3 py-2"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
              />

              <label>Custo Unitário</label>
              <input
                type="number"
                className="border rounded-lg px-3 py-2"
                value={custoUnitario}
                onChange={(e) => setCustoUnitario(e.target.value)}
              />

              <label>Ponto de Reposição</label>
              <input
                type="number"
                className="border rounded-lg px-3 py-2"
                value={pontoReposicao}
                onChange={(e) => setPontoReposicao(e.target.value)}
              />

              <label>Observação</label>
              <textarea
                rows="3"
                className="border rounded-lg px-3 py-2"
                value={obsItem}
                onChange={(e) => setObsItem(e.target.value)}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                />
                Item Ativo
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={salvarEdicao}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}