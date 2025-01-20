export default function Panel({ title }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-emerald-900 mb-4">{title}</h2>
      <p className="text-emerald-900">这里显示面板内容。</p>
    </div>
  );
}