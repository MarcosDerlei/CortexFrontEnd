export default function CategoriaResumoModal({ categoria, onClose }) {
  if (!categoria) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {categoria.nome}
        </h2>

        <div className="space-y-2 text-sm">
          <p><b>Itens:</b> {categoria.totalItens}</p>
          <p><b>Valor em estoque:</b> R$ {categoria.valorEstoque}</p>
          <p><b>Abaixo do mínimo:</b> {categoria.itensAbaixoMinimo}</p>
          <p><b>Status:</b> {categoria.status}</p>
          <p><b>Variação 30d:</b> {categoria.variacao30d}%</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
