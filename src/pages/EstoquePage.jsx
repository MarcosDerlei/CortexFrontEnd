import React from "react";
import { useState } from "react";
import CategoriaList from "../components/CategoriaList";
import ItemList from "../components/ItemList";
import ItemDetail from "../components/ItemDetail";

export default function EstoquePage() {
  const [categoria, setCategoria] = useState(null);
  const [item, setItem] = useState(null);

  return (
    <div className="estoque-page flex gap-4 p-4">
      <div className="w-1/4">
        <CategoriaList onSelectCategoria={setCategoria} />
      </div>
      <div className="w-1/3">
        <ItemList categoria={categoria} onSelectItem={setItem} />
      </div>
      <div className="w-2/5">
        <ItemDetail item={item} />
      </div>
    </div>
  );
}
