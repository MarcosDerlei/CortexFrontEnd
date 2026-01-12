export default function CategoriaStatusBadge({ status }) {
  const statusMap = {
    NORMAL: {
      label: "Normal",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    ATENCAO: {
      label: "Atenção",
      className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    CRITICO: {
      label: "Crítico",
      className: "bg-red-100 text-red-700 border border-red-200",
    },
  };

  const key = String(status ?? "NORMAL").toUpperCase();
  const config = statusMap[key] ?? statusMap.NORMAL;

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5 rounded-full
        text-xs font-medium
        ${config.className}
      `}
    >
      <span className="text-[12px] leading-none">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
