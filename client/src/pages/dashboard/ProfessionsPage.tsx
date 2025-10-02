import { Pencil, Archive, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "./DashboardLayout";
import { createProfession, deleteProfession, forceDeleteProfession, getProfessions, restoreProfession, updateProfession, uploadProfessionImage, type Profession } from "../../services/professions";

export default function ProfessionsPage() {
  const [rows, setRows] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<'active' | 'archived' | 'all'>("active");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Profession | null>(null);
  const [form, setForm] = useState<{ name_ar: string; name_fr?: string | null; image?: string | null }>({ name_ar: "", name_fr: "", image: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<null | { id: number; type: 'archive' | 'force' }>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProfessions(status);
        setRows(data);
      } catch {
        setError("تعذر تحميل المهن");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>  r.name_ar.toLowerCase().includes(t) || (r.name_fr || '').toLowerCase().includes(t));
  }, [rows, q]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name_ar: "", name_fr: "", image: "" });
    setFile(null);
    setPreview(null);
    setModalOpen(true);
  };
  const openEdit = (p: Profession) => {
    setEditing(p);
    setForm({ name_ar: p.name_ar, name_fr: p.name_fr || "", image: p.image || "" });
    setFile(null);
    setPreview(p.image || null);
    setModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        let updated = await updateProfession(editing.id, { name_ar: form.name_ar, name_fr: form.name_fr, image: form.image });
        if (file) {
          const up = await uploadProfessionImage(editing.id, file);
          updated = up.profession;
        }
        setRows(prev => prev.map(r => (r.id === editing.id ? updated : r)));
        setEditing(null);
      } else {
        let created = await createProfession({ name_ar: form.name_ar, name_fr: form.name_fr, image: form.image });
        if (file) {
          const up = await uploadProfessionImage(created.id, file);
          created = up.profession;
        }
        setRows(prev => [...prev, created].sort((a,b)=>a.id-b.id));
      }
    } catch {
      alert("فشل الحفظ. تأكد من الصلاحيات وأن الخادم يعمل.");
    } finally {
      setSaving(false);
      setModalOpen(false);
      setFile(null);
      setPreview(null);
    }
  };

  const onDelete = (id: number) => setConfirm({ id, type: 'archive' });
  const onRestore = async (id: number) => {
    try {
      await restoreProfession(id);
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
        await deleteProfession(confirm.id);
      } else {
        await forceDeleteProfession(confirm.id);
      }
      setRows(prev => prev.filter(r => r.id !== confirm.id));
    } catch {
      alert(confirm.type === 'archive' ? "تعذر الأرشفة" : "تعذر الحذف النهائي");
    } finally {
      setConfirm(null);
    }
  };

  return (
    <DashboardLayout title="المهن">
      <section className="rounded-2xl border border-orange-200/60 bg-white p-0 shadow-sm" dir="rtl">
        <div className="flex items-center justify-between gap-2 rounded-t-2xl border-b border-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-3">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-orange-900">Professions</h3>
            <p className="text-xs text-gray-600">إدارة المهن</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 sm:flex">
              <svg className="size-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث..." className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-56" />
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              إضافة مهنة
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="rounded-lg border bg-white p-1 text-xs font-semibold text-gray-700">
            <button onClick={()=>setStatus('active')} className={`rounded-md px-3 py-1 ${status==='active'?'bg-orange-100 text-orange-800':'hover:bg-gray-50'}`}>نشطة</button>
            <button onClick={()=>setStatus('archived')} className={`rounded-md px-3 py-1 ${status==='archived'?'bg-orange-100 text-orange-800':'hover:bg-gray-50'}`}>مؤرشفة</button>
            <button onClick={()=>setStatus('all')} className={`rounded-md px-3 py-1 ${status==='all'?'bg-orange-100 text-orange-800':'hover:bg-gray-50'}`}>الكل</button>
          </div>
          <div className="sm:hidden flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1">
            <svg className="size-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث..." className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400" />
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
                  <th className="px-3 py-2 text-start font-semibold">الصورة</th>
                  <th className="px-3 py-2 text-start font-semibold">الاسم بالعربية</th>
                  <th className="px-3 py-2 text-start font-semibold">الاسم بالفرنسية</th>
                  <th className="px-3 py-2 text-end font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition hover:bg-orange-50/40">
                    <td className="px-3 py-3 text-gray-700">
                      {p.image ? (
                        <img src={p.image} alt={p.name_fr || p.name_ar} className="h-10 w-10 rounded object-cover ring-1 ring-gray-200" />
                      ) : (
                        <div className="h-10 w-10 select-none rounded-full bg-orange-100 text-orange-700 ring-1 ring-orange-200 flex items-center justify-center font-bold">
                          {(p.name_fr || p.name_ar).trim().charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-700">{p.name_ar}</td>
                    <td className="px-3 py-3 text-gray-700">{p.name_fr || '-'}</td>
                    <td className="px-3 py-3 text-end">
                      {status !== 'archived' ? (
                        <div className="inline-flex items-center gap-1">
                          <button title="تعديل" onClick={()=>openEdit(p)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-gray-700 hover:bg-gray-50">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button title="أرشفة" onClick={()=>onDelete(p.id)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-rose-700 hover:bg-rose-50">
                            <Archive className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <button title="استرجاع" onClick={()=>onRestore(p.id)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-emerald-700 hover:bg-emerald-50">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button title="حذف نهائي" onClick={()=>onForceDelete(p.id)} className="inline-flex items-center justify-center rounded-md border bg-white p-1 text-rose-700 hover:bg-rose-50">
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
          <form onSubmit={onSubmit} className="w-[min(92vw,720px)] max-w-2xl rounded-2xl border border-orange-200/70 bg-white p-6 shadow-2xl sm:p-7" dir="rtl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-gray-900">{editing ? "تعديل مهنة" : "إضافة مهنة"}</h3>
                <p className="mt-1 text-xs text-gray-500">أدخل بيانات المهنة</p>
              </div>
              <button type="button" onClick={()=>{ setEditing(null); setModalOpen(false); }} className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50">إغلاق</button>
            </div>

            <div className="grid gap-4 sm:gap-5">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-gray-200 bg-gray-50 flex items-center justify-center">
                  {preview || form.image ? (
                    <img src={preview || (form.image as string)} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">IMG</span>
                  )}
                </div>
                <label className="text-xs">
                  <span className="mb-1 block text-gray-700">تحميل صورة</span>
                  <input type="file" accept="image/*" onChange={(e)=>{
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    setPreview(f ? URL.createObjectURL(f) : null);
                  }} />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الاسم بالعربية</span>
                <input required value={form.name_ar} onChange={e=>setForm(v=>({ ...v, name_ar: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الاسم بالفرنسية</span>
                <input value={form.name_fr || ''} onChange={e=>setForm(v=>({ ...v, name_fr: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
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
