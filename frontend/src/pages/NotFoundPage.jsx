import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl py-20">
      <div className="tk-panel text-center">
        <p className="mb-3 text-2xl text-slate-500">Erro 404</p>
        <h2 className="mb-4 text-6xl font-semibold text-slate-900">
          Página não encontrada
        </h2>
        <p className="mb-6 text-2xl text-slate-500">
          A rota que você tentou acessar não existe.
        </p>
        <Link to="/products" className="tk-btn tk-btn-primary">
          Voltar para Produtos
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
