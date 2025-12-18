import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
// import PrivateRoute from "./components/PrivateRoute";

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
        {/* LOGIN (VISUAL / FAKE) */}
        <Route path="/login" element={<LoginPage />} />

        {/* ROTA RAIZ → HOME */}
        <Route path="/" element={<Navigate to="/categorias" />} />

        {/* HOME DO SISTEMA */}
        <Route path="/categorias" element={<CategoriaPage />} />

        {/* SUBCATEGORIAS */}
        <Route
          path="/categoria/:id/subcategorias"
          element={<SubcategoriaPage />}
        />

        {/* ITENS */}
        <Route
          path="/subcategoria/:id/itens"
          element={<ItemPage />}
        />

        {/* DETALHE DO ITEM */}
        <Route
          path="/item/:sku"
          element={<ItemDetailPage />}
        />

        {/* HISTÓRICO DE MOVIMENTAÇÕES */}
        <Route
          path="/item/:sku/historico"
          element={<MovimentoHistoricoPage />}
        />
      </Routes>
    </Router>
  );
}
