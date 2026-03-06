import {
  AlertTriangle,
  LayoutDashboard,
  LoaderCircle,
  RefreshCw,
  ShoppingCart,
  SquareStack,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  const cards = [
    {
      title: "Dashboard Principal",
      description:
        "Tela completa com todos os recursos e interações funcionais",
      Icon: LayoutDashboard,
      iconClass: "bg-[#c81e3a]",
      to: "/products",
    },
    {
      title: "Carrinho Vazio",
      description: "Estado inicial quando não há produtos no carrinho",
      Icon: ShoppingCart,
      iconClass: "bg-blue-500",
      to: "/products",
    },
    {
      title: "Modo Offline",
      description: "Fila de sincronização com pedidos pendentes",
      Icon: WifiOff,
      iconClass: "bg-amber-500",
      to: "/orders",
    },
    {
      title: "Erro de Estoque",
      description: "Alerta quando um produto não tem estoque suficiente",
      Icon: AlertTriangle,
      iconClass: "bg-red-500",
      to: "/orders",
    },
  ];

  const resources = [
    {
      title: "Gestão de Produtos",
      description: "Cards de produtos com status, preços e descrições",
      Icon: SquareStack,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Carrinho Dinâmico",
      description: "Adicionar, remover e ajustar quantidades em tempo real",
      Icon: ShoppingCart,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Tratamento de Erros",
      description: "Alertas elegantes para problemas de estoque",
      Icon: AlertTriangle,
      iconClass: "bg-red-100 text-red-500",
    },
    {
      title: "Modo Offline",
      description: "Fila de sincronização para pedidos sem conexão",
      Icon: WifiOff,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Estados de Loading",
      description: "Feedback visual durante operações assíncronas",
      Icon: LoaderCircle,
      iconClass: "bg-purple-100 text-purple-600",
    },
    {
      title: "Sincronização Automática",
      description: "Reenvio automático de pedidos quando online",
      Icon: RefreshCw,
      iconClass: "bg-indigo-100 text-indigo-500",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl py-4">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-6xl font-semibold text-slate-900">
          Sistema de Pedidos Takeat
        </h2>
        <p className="mx-auto max-w-4xl text-2xl leading-relaxed text-slate-500">
          Explore os diferentes estados e funcionalidades do sistema de
          gerenciamento de pedidos. Desenvolvido com React, inspirado no design
          da Takeat.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.title} className="tk-panel">
            <div className="mb-3 flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white ${card.iconClass}`}
              >
                <card.Icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-semibold text-slate-900">
                {card.title}
              </h3>
            </div>
            <p className="mb-5 text-xl text-slate-500">{card.description}</p>
            <Link to={card.to} className="tk-btn tk-btn-primary">
              Ver Demonstração
            </Link>
          </article>
        ))}
      </div>

      <section className="tk-panel">
        <h3 className="mb-5 text-3xl font-semibold text-slate-900">
          Recursos Implementados
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="flex items-center gap-3 rounded-lg border border-solid bg-white px-4 py-3"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${resource.iconClass}`}
              >
                <resource.Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-semibold text-slate-800">
                  {resource.title}
                </p>
                <p className="text-base text-slate-500">
                  {resource.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-lg text-slate-500">
        Desenvolvido com React • TypeScript • Tailwind CSS • React Router •
        Lucide Icons
      </p>
    </section>
  );
}

export default HomePage;
