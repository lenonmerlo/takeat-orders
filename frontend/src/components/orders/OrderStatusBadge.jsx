function getStatusClass(status) {
  if (status === "CANCELED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getStatusLabel(status) {
  if (status === "CANCELED") return "Cancelado";
  if (status === "CREATED") return "Criado";
  return status || "-";
}

function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-solid px-2.5 py-1 text-sm font-semibold ${getStatusClass(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export default OrderStatusBadge;
