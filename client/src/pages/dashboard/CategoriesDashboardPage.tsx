import { Archive, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "./DashboardLayout";
import { createCategory, deleteCategory, forceDeleteCategory, getCategories, getCategory, restoreCategory, updateCategory, type Category, type CategoryPayload } from "../../services/categories";
import { getProfessions, type Profession } from "../../services/professions";

export default function CategoriesDashboardPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<'active' | 'archived' | 'all'>("active");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [profOptions, setProfOptions] = useState<Profession[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<null | { id: number; type: 'archive' | 'force' }>(null);

  const [form, setForm] = useState<CategoryPayload & { professionIds: number[] }>({
    name_ar: "",
    name_fr: "",
    description_ar: "",
    description_fr: "",
    icon: "",
    color: "#FF6B35",
    is_active: true,
    display_order: 1,
    professionIds: [],
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [cats, profs] = await Promise.all([
          getCategories(status),
          getProfessions('all'),
        ]);
        setRows(cats);
        setProfOptions(profs);
      } catch {
        setError("تعذر تحميل التصنيفات");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r => r.name_ar.toLowerCase().includes(t) || (r.name_fr || '').toLowerCase().includes(t));
  }, [rows, q]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name_ar: "", name_fr: "", description_ar: "", description_fr: "", icon: "", color: "#FF6B35", is_active: true, display_order: (rows.length+1), professionIds: [] });
    setModalOpen(true);
  };
  const openEdit = async (c: Category) => {
    setEditing(c);
    try {
      const detail = await getCategory(c.id);
      setForm({
        name_ar: detail.name_ar,
        name_fr: detail.name_fr || "",
        description_ar: detail.description_ar || "",
        description_fr: detail.description_fr || "",
        icon: detail.icon || "",
        color: detail.color || "#FF6B35",
        is_active: detail.is_active,
        display_order: detail.display_order ?? 1,
        professionIds: detail.professions?.map((p)=>p.id) ?? [],
      });
    } catch {
      // fallback to current row values
      setForm({
        name_ar: c.name_ar,
        name_fr: c.name_fr || "",
        description_ar: c.description_ar || "",
        description_fr: c.description_fr || "",
        icon: c.icon || "",
        color: c.color || "#FF6B35",
        is_active: c.is_active,
        display_order: c.display_order ?? 1,
        professionIds: [],
      });
    }
    setModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        const updated = await updateCategory(editing.id, form);
        setRows(prev => prev.map(r => (r.id === editing.id ? updated : r)));
        setEditing(null);
      } else {
        const created = await createCategory(form);
        setRows(prev => [...prev, created].sort((a,b)=> (a.display_order ?? a.id) - (b.display_order ?? b.id)));
      }
    } catch {
      alert("فشل الحفظ. تأكد من الصلاحيات وأن الخادم يعمل.");
    } finally {
      setSaving(false);
      setModalOpen(false);
    }
  };

  const onDelete = (id: number) => setConfirm({ id, type: 'archive' });
  const onRestore = async (id: number) => {
    try {
      await restoreCategory(id);
      if (status !== 'archived') return;
      setRows(prev => prev.filter(r => r.id !== id));
    } catch {
      alert("تعذر الاسترجاع");
    }
  };
  const onForceDelete = (id: number) => setConfirm({ id, type: 'force' });

  const confirmAction = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === 'archive') {
        await deleteCategory(confirm.id);
      } else {
        await forceDeleteCategory(confirm.id);
      }
      setRows(prev => prev.filter(r => r.id !== confirm.id));
    } catch {
      alert(confirm.type === 'archive' ? "تعذر الأرشفة" : "تعذر الحذف النهائي");
    } finally {
      setConfirm(null);
    }
  };

  return (
    <DashboardLayout title="التصنيفات">
      <section className="rounded-2xl border border-orange-200/60 bg-white p-0 shadow-sm" dir="rtl">
        <div className="flex items-center justify-between gap-2 rounded-t-2xl border-b border-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-3">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-orange-900">Categories</h3>
            <p className="text-xs text-gray-600">إدارة التصنيفات المرتبطة بالمهن</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 sm:flex">
              <svg className="size-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث..." className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-56" />
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              إضافة تصنيف
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="rounded-lg border bg-white p-1 text-xs font-semibold text-gray-700">
            <button onClick={()=>setStatus('active')} className={`rounded-md px-3 py-1 ${status==='active'?'bg-orange-100 text-orange-800':'hover:bg-gray-50'}`}>نشطة</button>
            <button onClick={()=>setStatus('archived')} className={`rounded-md px-3 py-1 ${status==='archived'?'bg-orange-100 text-orange-800':'hover:bg-gray-50'}`}>مؤرشفة</button>
            <button onClick={()=>setStatus('all')} className={`rounded-md px-3 py-1 ${status==='all'?'bg-orange-100 text-orange-800':'hover:bg-gray-50'}`}>الكل</button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600">جاري التحميل…</div>
        ) : error ? (
          <div className="py-12 text-center text-rose-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="px-4 pb-6">
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-600">
              لا توجد بيانات مطابقة. جرّب تغيير البحث أو تبديل التبويب.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto px-4 pb-4">
            <table className="min-w-full text-sm">
              <thead className="text-gray-600">
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-start font-semibold">الرمز</th>
                  <th className="px-3 py-2 text-start font-semibold">الاسم بالعربية</th>
                  <th className="px-3 py-2 text-start font-semibold">الاسم بالفرنسية</th>
                  <th className="px-3 py-2 text-start font-semibold">عدد المهن</th>
                  <th className="px-3 py-2 text-start font-semibold">الحالة</th>
                  <th className="px-3 py-2 text-end font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr key={c.id} className="transition hover:bg-orange-50/40">
                    <td className="px-3 py-3 text-gray-700">
                      <div className="h-10 w-10 select-none rounded-full ring-1 ring-orange-200 flex items-center justify-center text-base" style={{ backgroundColor: (c.color||'#FFEAD8'), color: '#7A3E1D' }}>
                        {c.icon || '📁'}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{c.name_ar}</td>
                    <td className="px-3 py-3 text-gray-700">{c.name_fr || '-'}</td>
                    <td className="px-3 py-3 text-gray-700">{c.professions_count ?? '-'}</td>
                    <td className="px-3 py-3 text-gray-700">{c.is_active ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-700">نشطة</span> : <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">معطلة</span>}</td>
                    <td className="px-3 py-3 text-end">
                      {status !== 'archived' ? (
                        <div className="inline-flex items-center gap-1">
                          <button title="تعديل" onClick={()=>openEdit(c)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-gray-700 hover:bg-gray-50">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button title="أرشفة" onClick={()=>onDelete(c.id)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-rose-700 hover:bg-rose-50">
                            <Archive className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <button title="استرجاع" onClick={()=>onRestore(c.id)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-emerald-700 hover:bg-emerald-50">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button title="حذف نهائي" onClick={()=>onForceDelete(c.id)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-rose-700 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <dialog open className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm rounded-2xl">
          <form onSubmit={onSubmit} className="w-[min(92vw,820px)] max-w-3xl rounded-2xl border border-orange-200/70 bg-white p-6 shadow-2xl sm:p-7" dir="rtl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-gray-900">{editing ? "تعديل تصنيف" : "إضافة تصنيف"}</h3>
                <p className="mt-1 text-xs text-gray-500">أدخل بيانات التصنيف</p>
              </div>
              <button type="button" onClick={()=>{ setEditing(null); setModalOpen(false); }} className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50">إغلاق</button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الاسم بالعربية</span>
                <input required value={form.name_ar} onChange={e=>setForm(v=>({ ...v, name_ar: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الاسم بالفرنسية</span>
                <input value={form.name_fr || ''} onChange={e=>setForm(v=>({ ...v, name_fr: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block text-gray-700">الوصف بالعربية</span>
                <textarea value={form.description_ar || ''} onChange={e=>setForm(v=>({ ...v, description_ar: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" rows={3} />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block text-gray-700">الوصف بالفرنسية</span>
                <textarea value={form.description_fr || ''} onChange={e=>setForm(v=>({ ...v, description_fr: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" rows={3} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الأيقونة (Emoji)</span>
                <input value={form.icon || ''} onChange={e=>setForm(v=>({ ...v, icon: e.target.value }))} placeholder="🏗️" className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">اللون</span>
                <input type="color" value={form.color || '#FF6B35'} onChange={e=>setForm(v=>({ ...v, color: e.target.value }))} className="h-10 w-20 cursor-pointer rounded border" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الحالة</span>
                <select value={form.is_active ? '1':'0'} onChange={e=>setForm(v=>({ ...v, is_active: e.target.value==='1' }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                  <option value="1">نشطة</option>
                  <option value="0">معطلة</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الترتيب</span>
                <input type="number" value={form.display_order ?? 1} onChange={e=>setForm(v=>({ ...v, display_order: Number(e.target.value) }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-sm text-gray-700">المهن المرتبطة</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {profOptions.map(p => (
                    <label key={p.id} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${form.professionIds.includes(p.id) ? 'border-orange-400 bg-orange-50' : 'hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={form.professionIds.includes(p.id)} onChange={() => {
                        setForm(v=>{
                          const exists = v.professionIds.includes(p.id);
                          return { ...v, professionIds: exists ? v.professionIds.filter(x=>x!==p.id) : [...v.professionIds, p.id] };
                        });
                      }} />
                      <span className="truncate">{p.name_fr || p.name_ar}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={()=>{ setEditing(null); setModalOpen(false); }} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">إلغاء</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-50">
                {saving?"جارٍ الحفظ…":"حفظ"}
              </button>
            </div>
          </form>
        </dialog>
      )}

      {confirm && (
        <dialog open className="fixed inset-0 z-[60] flex items-center justify-center rounded-2xl backdrop-blur-sm">
          <div className="w-[min(92vw,520px)] max-w-md rounded-2xl border border-orange-200/70 bg-white p-5 shadow-xl" dir="rtl">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="text-base font-extrabold text-gray-900">
                  {confirm.type === 'archive' ? 'تأكيد الأرشفة' : 'تأكيد الحذف النهائي'}
                </h4>
                <p className="mt-1 text-xs text-gray-600">
                  {confirm.type === 'archive' ? 'سيتم نقل السجل إلى المؤرشفة ويمكن استرجاعه لاحقاً.' : 'هذا الإجراء نهائي ولا يمكن التراجع عنه.'}
                </p>
              </div>
              <button onClick={()=>setConfirm(null)} className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50">إغلاق</button>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={()=>setConfirm(null)} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">إلغاء</button>
              <button onClick={confirmAction} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow ${confirm.type==='archive' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
                {confirm.type==='archive' ? (<><Archive className="h-4 w-4"/>أرشفة</>) : (<><Trash2 className="h-4 w-4"/>حذف نهائي</>)}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </DashboardLayout>
  );
}
