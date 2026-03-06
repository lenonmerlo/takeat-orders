function DemoControlsPanel() {
  return (
    <section className="tk-panel">
      <h3 className="mb-3 text-lg text-slate-500">Demo Controls</h3>
      <div className="space-y-2">
        <button type="button" className="tk-btn tk-btn-ghost w-full">
          Ver Todas as Demonstrações
        </button>
        <button type="button" className="tk-btn tk-btn-ghost w-full">
          Toggle Online/Offline
        </button>
        <button type="button" className="tk-btn tk-btn-ghost w-full">
          Simular Conflito
        </button>
      </div>
    </section>
  );
}

export default DemoControlsPanel;
