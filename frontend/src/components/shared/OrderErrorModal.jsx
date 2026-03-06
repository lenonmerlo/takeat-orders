import { AlertTriangle, X } from "lucide-react";

function OrderErrorModal({ isOpen, message, onClose, onAdjust }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-error-title"
      onClick={onClose}
    >
      <div
        className="tk-panel w-full max-w-xl p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-solid px-5 py-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <h3 id="order-error-title" className="text-xl font-semibold">
              Não foi possível concluir o pedido
            </h3>
          </div>

          <button
            type="button"
            className="tk-btn tk-btn-ghost px-3 py-1"
            onClick={onClose}
            aria-label="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-solid px-5 py-4">
          <button
            type="button"
            className="tk-btn tk-btn-ghost"
            onClick={onAdjust || onClose}
          >
            Ajustar pedido
          </button>
          <button
            type="button"
            className="tk-btn tk-btn-primary"
            onClick={onClose}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderErrorModal;
