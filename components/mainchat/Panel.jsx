export default function Panel({ title }) {
  return (
    <div className="p-4 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">{title}</h2>
      <p className="text-emerald-300">这里显示面板内容。</p>
    </div>
  );
}
