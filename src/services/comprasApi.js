import api from "../api/api";

// ===============================
// ITEM -> FORNECEDORES VINCULADOS
// ===============================
export async function listarFornecedoresDoItem(itemId) {
  const res = await api.get(`/compras/item/${itemId}/fornecedores`);
  return res.data;
}

// ===============================
// FORNECEDORES (CRUD)
// ===============================
export async function listarFornecedoresAtivos() {
  const res = await api.get("/compras/fornecedores?somenteAtivos=true");
  return res.data;
}

// ===============================
// VINCULO ITEM-FORNECEDOR
// ===============================
export async function vincularFornecedorAoItem(payload) {
  // payload esperado:
  // { itemId, fornecedorId, precoReferencia, unidadeCompra, ativo }
  const res = await api.post("/compras/item-fornecedor", payload);
  return res.data;
}

export async function atualizarVinculoItemFornecedor(id, payload) {
  const res = await api.put(`/compras/item-fornecedor/${id}`, payload);
  return res.data;
}


// ===============================
// CARRINHO
// ===============================
export async function adicionarNoCarrinho(itemFornecedorId, quantidade) {
  await api.post(`/compras/carrinho/itens`, {
    itemFornecedorId,
    quantidade,
  });
}
