import React from "react";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function ModalHistorico({ sku, onClose }) {
  const [movimentos, setMovimentos] = useState([]);

  useEffect(() => {
    if (sku) {
      api.get(`/movimentos?sku=${sku}`).then(res => setMovimentos(res.data));
    }
  }, [sku]);

  return (
    <div className="modal">
      <div className="content">
        <h3>Histórico do Item</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {movimentos.map(m => (
              <tr key={m.id}>
                <td>{m.dataMovimento}</td>
                <td>{m.tipo}</td>
                <td>{m.quantidade}</td>
                <td>{m.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
