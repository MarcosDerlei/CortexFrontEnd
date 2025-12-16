import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Layers,
  MapPin,
  Factory,
  DollarSign,
  Clock,
  ClipboardList,
  History
} from "lucide-react";

export default function ItemDetail({ item }) {

  const navigate = useNavigate();

  const [showMovModal, setShowMovModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // 🟢 Quando o item chegar, preenche os valores
  useEffect(() => {
    if (item) {
      setDescricao(item.descricao || "");
      setLocalizacao(item.localizacao || "");
      setFornecedor(item.fornecedor || "");
      setCustoUnitario(item.custoUnitario || 0);
      setPontoReposicao(item.pontoReposicao || 0);
      setObsItem(item.observacao || "");
      setAtivo(item.ativo ?? true);
    }
  }, [item]);

  if (!item) return <p>Carregando...</p>;

  // 🔸 Barra de estoque
  const estoqueMinimo = item.pontoReposicao ?? 0;
  const porcentagem =
    estoqueMinimo > 0 ? Math.min(100, (item.saldo / estoqueMinimo) * 100) : 100;

  const getBarColor = () => {
    if (porcentagem >= 80) return "bg-green-500";
    if (porcentagem >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  // ✔️ Registrar movimento
  const registrarMovimento = async () => {
    try {
      await api.post("/movimentos", {
        sku: item.sku,
        tipo,
        quantidade: Number(quantidade),
        observacao,
      });

      alert("Movimento registrado com sucesso!");
      setShowMovModal(false);
      window.location.reload();
    } catch (error) {
      alert("Erro ao registrar movimento!");
      console.error(error);
    }
  };

  // ✔️ Salvar edição do item
  const salvarEdicao = async () => {
    try {
      await api.put(`/itens/${item.sku}`, {
        descricao,
        localizacao,
        fornecedor,
        custoUnitario,
        pontoReposicao,
        observacao: obsItem,
        ativo,
      });

      alert("Item atualizado com sucesso!");
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      alert("Erro ao atualizar item!");
      console.error(error);
    }
  };

  return (
    <div className="p-8">

      {/* Cabeçalho */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Package className="text-blue-600" size={24} />
          <h2 className="text-2xl font-semibold text-gray-800">
            {item.descricao}
          </h2>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          SKU: <span className="font-medium text-gray-700">{item.sku}</span> |{" "}
          Categoria:{" "}
          <span className="font-medium text-gray-700">{item.categoria}</span>
        </p>
      </div>

      {/* Seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Estoque */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-blue-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Quantidade em Estoque
            </h3>
          </div>

          <p className="text-lg font-bold text-gray-800 mb-2">
            {item.saldo} unidades
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Valor Unitário
            </h3>
          </div>

          <p className="text-lg font-bold text-gray-800">
            R$ {item.custoUnitario?.toFixed(2)}
          </p>
        </div>

        {/* Localização */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-purple-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Localização
            </h3>
          </div>
          <p className="text-gray-700">{item.localizacao}</p>
        </div>

        {/* Fornecedor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="text-orange-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Fornecedor
            </h3>
          </div>
          <p className="text-gray-700">{item.fornecedor}</p>
        </div>

        {/* Última Atualização */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-gray-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Última Atualização
            </h3>
          </div>
          <p className="text-gray-700">
            {new Date(item.ultimaAtualizacao).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Observação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="text-gray-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-500">
              Observação
            </h3>
          </div>
          <p className="text-gray-700">
            {item.observacao || "Sem observações."}
          </p>
        </div>

      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          onClick={() => navigate(`/item/${item.sku}/historico`)}
        >
          <History size={16} />
          Histórico
        </button>

        <button
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={() => setShowEditModal(true)}
        >
          Editar Item
        </button>

        <button
          className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
          onClick={() => setShowMovModal(true)}
        >
          Movimentar Estoque
        </button>
      </div>

      {/* ================= MODAL MOVIMENTO ================= */}
      {showMovModal && (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Movimentar Estoque — {item.descricao}
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
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Editar Item — {item.sku}
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
