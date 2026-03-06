import { RefreshCw, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isProducts = location.pathname === "/products";
  const isOrders =
    location.pathname === "/orders" || location.pathname.startsWith("/orders/");

  const subtitle = useMemo(() => {
    if (location.pathname === "/") return "Início";
    if (isProducts) return "Painel de Pedidos";
    if (isOrders) return "Gestão de Pedidos";
    return "Sistema";
  }, [isOrders, isProducts, location.pathname]);

  const isOnline = typeof navigator === "undefined" ? true : navigator.onLine;

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <header className="tk-topbar">
        <div className="tk-container flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div className="tk-brand">
            <div className="tk-brand-badge">T</div>

            <div>
              <h1 className="tk-title">Takeat Orders</h1>
              <p className="tk-subtitle">{subtitle}</p>
            </div>
          </div>

          {isProducts || isOrders ? (
            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end md:gap-3">
              <Link
                to="/"
                className="tk-btn tk-btn-ghost px-3 py-1.5 text-sm md:text-base"
              >
                Início
              </Link>
              <Link
                to="/products"
                className="tk-btn tk-btn-ghost px-3 py-1.5 text-sm md:text-base"
              >
                Produtos
              </Link>
              <Link
                to="/orders"
                className="tk-btn tk-btn-ghost px-3 py-1.5 text-sm md:text-base"
              >
                Pedidos
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900 md:text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                  <Wifi
                    className={`h-3.5 w-3.5 ${isOnline ? "text-emerald-600" : "text-amber-500"}`}
                  />
                </span>
                {isOnline ? "Online" : "Offline"}
              </span>
              <button
                type="button"
                className="tk-btn tk-btn-ghost px-3 py-1.5 text-sm md:text-base"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="tk-container py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
