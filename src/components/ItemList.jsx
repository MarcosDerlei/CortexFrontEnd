import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ItemList({ subcategoriaId, onSelectItem }) {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    if (subcategoriaId) {
      api
        .get(`/itens/subcategoria/${subcategoriaId}`)
        .then((res) => setItens(res.data))
        .catch((err) => console.error("Erro ao carregar itens:", err));
    }
  }, [subcategoriaId]);

  if (!subcategoriaId) return <p>Selecione uma subcategoria.</p>;

  const getColorByStatus = (alerta) => {
    switch (alerta) {
      case "OK":
        return { color: "#15803d", background: "#dcfce7" };
      case "ATENÇÃO":
        return { color: "#92400e", background: "#fef3c7" };
      case "CRÍTICO":
        return { color: "#b91c1c", background: "#fee2e2" };
      default:
        return { color: "#374151", background: "#e5e7eb" };
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
       
      </h2>

      {itens.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {itens.map((item) => (
            <div
              key={item.sku}
              onClick={() => onSelectItem?.(item)}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "0.2s ease",
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {item.descricao}
              </h4>

              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  marginBottom: "10px",
                  minHeight: "36px",
                }}
              >
                {item.observacao || "Sem observações."}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                  <p>
                    <strong>Saldo:</strong> {item.saldo}
                  </p>
                  <p>
                    <strong>Reservado:</strong> {item.reservado}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    ...getColorByStatus(item.alerta),
                  }}
                >
                  {item.alerta}
                </span>
              </div>

              <p
                style={{
                  marginTop: "8px",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}
              >
                Unidade: {item.unidade} | Fornecedor: {item.fornecedor}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum item encontrado nesta subcategoria.</p>
      )}
    </div>
  );
}
