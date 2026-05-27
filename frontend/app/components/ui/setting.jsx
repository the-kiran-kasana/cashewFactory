export default function Setting({ title, onBack }) {
  return (
    <div className="p-10">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">← Back</button>
      <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-500">Settings coming soon.</p>
    </div>
  );
}