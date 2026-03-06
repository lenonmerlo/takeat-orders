import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="mx-auto max-w-6xl py-8">
      <div className="tk-panel tk-home-hero p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-7 md:p-9">
            <span className="tk-home-kicker">
              Atendimento rápido e organizado
            </span>
            <h2 className="tk-home-title">Sistema de Pedidos Takeat</h2>
            <p className="tk-home-copy">
              Registre pedidos de forma rápida, consulte o cardápio e acompanhe
              o histórico da mesa sem complicação.
            </p>

            <div className="mb-6 grid grid-cols-1 gap-2 text-sm text-slate-600 md:grid-cols-2">
              <div className="rounded-lg border border-solid border-slate-200 bg-white px-3 py-2">
                Cardápio completo e atualizado
              </div>
              <div className="rounded-lg border border-solid border-slate-200 bg-white px-3 py-2">
                Evita pedidos duplicados
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Link
                to="/products"
                className="tk-btn tk-btn-primary w-full py-3 text-lg"
              >
                Ir para Produtos
              </Link>
              <Link
                to="/orders"
                className="tk-btn tk-btn-ghost w-full py-3 text-lg"
              >
                Ver Pedidos
              </Link>
            </div>
          </div>

          <div className="tk-home-media">
            <img
              src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Combo de hambúrguer, batata frita e refrigerante"
              className="tk-home-image"
            />
            <div className="tk-home-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
