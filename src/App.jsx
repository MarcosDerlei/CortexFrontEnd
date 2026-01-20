import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import api from "./api/api";

import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

import CategoriaPage from "./pages/CategoriaPage";
import CategoriaEditPage from "./pages/CategoriaEditPage";
import CategoriaSubcategorias from "./pages/CategoriaSubcategorias";

import ItemPage from "./pages/ItemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MovimentoHistoricoPage from "./pages/MovimentoHistoricoPage";

import CarrinhoPage from "./pages/carrinho/CarrinhoPage";
import FornecedoresPage from "./pages/FornecedoresPage";

import SubcategoriasPage from "./pages/SubcategoriasPage";
import ItensPage from "./pages/ItensPage";

export default function App() {
  console.log("App React iniciado");

  // ✅ Warmup (acorda backend e reduz cold start)
  useEffect(() => {
    api.get("/health").catch(() => {});
  }, []);

  return (
    <Router>
      <Routes>
        {/* LOGIN (PÚBLICO) */}
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ COMPATIBILIDADE: caso algum lugar use /compras/carrinho */}
        <Route
          path="/compras/carrinho"
          element={<Navigate to="/carrinho" replace />}
        />

        {/* ROTA RAIZ → HOME REAL */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/categorias" />
            </PrivateRoute>
          }
        />

        {/* HOME DO SISTEMA */}
        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <CategoriaPage />
            </PrivateRoute>
          }
        />

        {/* ✅ SUBCATEGORIAS (GLOBAL / MENU RÁPIDO) */}
        <Route
          path="/subcategorias"
          element={
            <PrivateRoute>
              <SubcategoriasPage />
            </PrivateRoute>
          }
        />

        {/* ✅ ITENS (GLOBAL / MENU RÁPIDO) */}
        <Route
          path="/itens"
          element={
            <PrivateRoute>
              <ItensPage />
            </PrivateRoute>
          }
        />

        {/* ✅ FORNECEDORES */}
        <Route
          path="/fornecedores"
          element={
            <PrivateRoute>
              <FornecedoresPage />
            </PrivateRoute>
          }
        />

        {/* ✏️ EDIÇÃO DE CATEGORIA */}
        <Route
          path="/categorias/:id/editar"
          element={
            <PrivateRoute>
              <CategoriaEditPage />
            </PrivateRoute>
          }
        />

        {/* SUBCATEGORIAS POR CATEGORIA */}
        <Route
          path="/categoria/:categoriaId/subcategorias"
          element={
            <PrivateRoute>
              <CategoriaSubcategorias />
            </PrivateRoute>
          }
        />

        {/* ITENS POR SUBCATEGORIA */}
        <Route
          path="/subcategoria/:id/itens"
          element={
            <PrivateRoute>
              <ItemPage />
            </PrivateRoute>
          }
        />

        {/* DETALHE DO ITEM */}
        <Route
          path="/item/:sku"
          element={
            <PrivateRoute>
              <ItemDetailPage />
            </PrivateRoute>
          }
        />

        {/* HISTÓRICO DE MOVIMENTAÇÕES */}
        <Route
          path="/item/:sku/historico"
          element={
            <PrivateRoute>
              <MovimentoHistoricoPage />
            </PrivateRoute>
          }
        />

        {/* ✅ CARRINHO */}
        <Route
          path="/carrinho"
          element={
            <PrivateRoute>
              <CarrinhoPage />
            </PrivateRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/categorias" replace />} />
      </Routes>
    </Router>
  );
}
