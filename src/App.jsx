import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

import CategoriaPage from "./pages/CategoriaPage";
import CategoriaEditPage from "./pages/CategoriaEditPage";
import SubcategoriaPage from "./pages/SubcategoriaPage";
import ItemPage from "./pages/ItemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MovimentoHistoricoPage from "./pages/MovimentoHistoricoPage";
import CategoriaSubcategorias from "./pages/CategoriaSubcategorias";



export default function App() {
  console.log("App React iniciado");

  return (
    <Router>
      <Routes>
        {/* LOGIN (PÚBLICO) */}
        <Route path="/login" element={<LoginPage />} />

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

        {/* ✏️ EDIÇÃO DE CATEGORIA */}
        <Route
          path="/categorias/:id/editar"
          element={
            <PrivateRoute>
              <CategoriaEditPage />
            </PrivateRoute>
          }
        />

        {/* SUBCATEGORIAS */}
        <Route
          path="/categoria/:categoriaId/subcategorias"
          element={
            <PrivateRoute>
              <CategoriaSubcategorias />
            </PrivateRoute>
          }
        />

        {/* ITENS */}
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
      </Routes>
    </Router>
  );
}
