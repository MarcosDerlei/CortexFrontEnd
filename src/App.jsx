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
import SubcategoriaPage from "./pages/SubcategoriaPage";
import ItemPage from "./pages/ItemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MovimentoHistoricoPage from "./pages/MovimentoHistoricoPage";

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

        {/* SUBCATEGORIAS */}
        <Route
          path="/categoria/:id/subcategorias"
          element={
            <PrivateRoute>
              <SubcategoriaPage />
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
