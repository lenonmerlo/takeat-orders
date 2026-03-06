import { RefreshCw, Wifi } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen">
      <header className="tk-topbar">
        <div className="tk-container flex items-center justify-between py-4">
          <div className="tk-brand">
            <div className="tk-brand-badge">T</div>

            <div>
              <h1 className="tk-title">Takeat Orders</h1>
              <p className="tk-subtitle">
                {isHome ? "Demonstrações do Sistema" : "Painel de Pedidos"}
              </p>
            </div>
          </div>

          {!isHome ? (
            <div className="flex items-center gap-3">
              <span className="tk-btn tk-btn-ghost">
                <Wifi className="h-4 w-4" />
                Online
              </span>
              <button type="button" className="tk-btn tk-btn-ghost">
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
