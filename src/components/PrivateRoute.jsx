import { Navigate } from "react-router-dom";

/*
=====================================================
 PRIVATE ROUTE — DESATIVADO TEMPORARIAMENTE
 Autenticação (JWT / token) desligada
 Login fake ativo
=====================================================
*/

export default function PrivateRoute({ children }) {
  // const token = localStorage.getItem("token");

  // if (!token) {
  //   return <Navigate to="/login" />;
  // }

  // Enquanto não há autenticação, libera tudo
  return children;
}
