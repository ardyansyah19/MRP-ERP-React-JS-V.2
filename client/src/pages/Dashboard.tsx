import { useEffect, useState } from 'react';
import { Package, Layers, ClipboardList, AlertTriangle } from 'lucide-react';
import { api } from '../api';

export default function Dashboard() {
  const [d, setD] = useState<any>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    Promise.all([api('/items'), api('/boms'), api('/orders'), api('/mrp')])
      .then(([items, boms, orders, mrp]) => setD({ items, boms, orders, mrp }))
      .catch((e) => setErr(e.message));
  }, []);
  if (err) return <p className="text-red-600">{err}</p>;
  if (!d) return <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />;
  const open = d.orders.filter((o: any) => o.status !== 'Selesai');
  const short = d.mrp.filter((m: any) => m.shortage > 0).length;
  const cards = [
    { l: 'Total Barang', v: d.items.length, i: Package, c: 'from-indigo-500 to-indigo-600' },
    { l: 'Bill of Materials', v: d.boms.length, i: Layers, c: 'from-violet-500 to-purple-600' },
    { l: 'Order Aktif', v: open.length, i: ClipboardList, c: 'from-sky-500 to-blue-600' },
    { l: 'Bahan Kurang', v: short, i: AlertTriangle, c: short ? 'from-rose-500 to-red-600' : 'from-emerald-500 to-green-600' },
  ];
  const prod = (id: number) => d.items.find((i: any) => i.id === id)?.name || '-';
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Dashboard</h2><p className="text-sm text-slate-500">Ringkasan produksi dan kebutuhan material.</p></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ l, v, i: Icon, c }) => (
          <div key={l} className={`rounded-2xl bg-gradient-to-br ${c} p-5 text-white shadow-lg`}>
            <Icon className="mb-3 opacity-80" size={22} /><p className="text-3xl font-bold">{v}</p><p className="text-sm opacity-90">{l}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-x-auto p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Perencanaan Kebutuhan Material (MRP)</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400"><tr><th className="pb-3">Material</th><th>Kebutuhan</th><th className="w-40">Ketersediaan</th><th>Status</th></tr></thead>
            <tbody>
              {d.mrp.map((m: any) => {
                const pct = Math.min(100, Math.round((m.stock / m.required) * 100));
                return (
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className="py-3"><p className="font-medium">{m.name}</p><p className="text-xs text-slate-400">{m.code}</p></td>
                    <td>{m.required} {m.unit}</td>
                    <td><div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${m.shortage ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: pct + '%' }} /></div><p className="mt-1 text-xs text-slate-400">stok {m.stock} ({pct}%)</p></td>
                    <td><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.shortage ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{m.shortage ? `Beli ${m.shortage}` : 'Aman'}</span></td>
                  </tr>
                );
              })}
              {!d.mrp.length && <tr><td colSpan={4} className="py-8 text-center text-slate-400">Belum ada order aktif dengan BOM</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-semibold">Order Aktif</h3>
          <div className="space-y-3">
            {open.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div><p className="text-sm font-medium">{o.orderNo} · {prod(o.productId)}</p><p className="text-xs text-slate-400">Qty {o.qty} · {o.dueDate}</p></div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">{o.status}</span>
              </div>
            ))}
            {!open.length && <p className="text-sm text-slate-400">Tidak ada order aktif</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
