import { Archive, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { createArtisan, deleteArtisan, forceDeleteArtisan, getArtisans, restoreArtisan, updateArtisan, type ArtisanProfile } from "../../services/artisans";
import { uploadImages } from "../../services/uploads";
import { getProfessions, type Profession } from "../../services/professions";
import { getCategories, type Category } from "../../services/categories";
import { getUsers, type User } from "../../services/users";

// stable day keys for hooks deps/type safety
const DAY_KEYS_DEF = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"] as const;

export default function ArtisansDashboardPage() {
  const [rows, setRows] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<'active' | 'archived' | 'all'>("active");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ArtisanProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<null | { id: number; type: 'archive' | 'force' }>(null);
  const [uploading, setUploading] = useState(false);

  const [profOptions, setProfOptions] = useState<Profession[]>([]);
  const [catOptions, setCatOptions] = useState<Category[]>([]);
  const [userOptions, setUserOptions] = useState<User[]>([]);

  const [form, setForm] = useState<{ user_id: number | '';
    profession_id?: number | null;
    category_id?: number | null;
    title_ar: string;
    title_fr?: string;
    description_ar?: string;
    description_fr?: string;
    gallery?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
    weekly?: Record<string, { closed: boolean; from: string; to: string }>;
    address_ar?: string;
    address_fr?: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    verify_status: 'PENDING' | 'VERIFIED' | 'REJECTED'; }>(
    { user_id: '', profession_id: null, category_id: null, title_ar: "", title_fr: "",
      description_ar: "", description_fr: "",
      gallery: "",
      facebook: "", instagram: "", website: "",
      weekly: undefined,
      address_ar: "", address_fr: "",
      visibility: 'PUBLIC', verify_status: 'PENDING' }
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [list, profs, cats, users] = await Promise.all([
          getArtisans(status),
          getProfessions('all'),
          getCategories('all'),
          getUsers('all'),
        ]);
        setRows(list);
        setProfOptions(profs);
        setCatOptions(cats);
        setUserOptions(users.filter(u=>u.role==='ARTISAN'));
      } catch {
        setError("تعذر تحميل الحرفيين");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>  r.title_ar.toLowerCase().includes(t) || (r.title_fr || '').toLowerCase().includes(t) || (r.user?.name || '').toLowerCase().includes(t));
  }, [rows, q]);

  const galleryList = useMemo(() => (form.gallery || "").split(',').map(s=>s.trim()).filter(Boolean), [form.gallery]);
  const apiOrigin = useMemo(() => {
    const raw = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:8000/api';
    // strip trailing /api to get origin
    return raw.replace(/\/api\/?$/, '');
  }, []);
  const resolveSrc = (src: string) => src.startsWith('/storage/') ? `${apiOrigin}${src}` : src;

  // ===== Availability helpers =====
  const DAY_KEYS = DAY_KEYS_DEF;
  const DAY_AR: Record<typeof DAY_KEYS[number], string> = {
    SUNDAY: 'الأحد',
    MONDAY: 'الإثنين',
    TUESDAY: 'الثلاثاء',
    WEDNESDAY: 'الأربعاء',
    THURSDAY: 'الخميس',
    FRIDAY: 'الجمعة',
    SATURDAY: 'السبت',
  };
  type DayInterval = { from: string; to: string };
  type DayRange = { closed: boolean; from: string; to: string; intervals?: DayInterval[] };
  
  function defaultWeekly(): Record<string, { closed: boolean; from: string; to: string }>{
    const obj: Record<string, { closed: boolean; from: string; to: string }> = {};
    DAY_KEYS.forEach(k => { obj[k] = { closed: false, from: '09:00', to: '17:00' }; });
    return obj;
  }
  function ensureWeekly(av?: { hours?: string[]; days?: string[]; weekly?: Record<string, {closed:boolean;from:string;to:string}> }|null|undefined) {
    if (av?.weekly) return av.weekly;
    const base = defaultWeekly();
    if (av?.days && av.days.length) {
      // إذا كانت الأيام محددة، اعتبر الأيام غير الموجودة مغلقة
      DAY_KEYS.forEach(k => { base[k].closed = !av.days!.includes(k); });
    }
    return base;
  }
  function buildAvailability(weekly: Record<string, { closed: boolean; from: string; to: string }>) {
    const days = DAY_KEYS.filter(k => !weekly[k].closed);
    return { weekly, days };
  }

  // ===== Simple availability builder (days + hours) =====
  const [selDays, setSelDays] = useState<Record<string, boolean>>({
    SUNDAY:false, MONDAY:true, TUESDAY:true, WEDNESDAY:true, THURSDAY:true, FRIDAY:true, SATURDAY:false
  });
  const [selHours, setSelHours] = useState<Record<number, boolean>>(() => {
    const obj: Record<number, boolean> = {};
    for (let h=0; h<24; h++) obj[h] = h>=8 && h<18; // 08→17
    return obj;
  });
  function pad(n:number){ return String(n).padStart(2,'0'); }
  const hoursToIntervals = useCallback((hours: number[]): {from:string; to:string}[] => {
    if (hours.length===0) return [];
    const sorted = Array.from(new Set(hours)).sort((a,b)=>a-b);
    const blocks: {from:string; to:string}[] = [];
    let start = sorted[0], prev = sorted[0];
    for (let i=1;i<sorted.length;i++){
      const h = sorted[i];
      if (h === prev+1){ prev = h; continue; }
      blocks.push({ from: `${pad(start)}:00`, to: `${pad(prev+1)}:00` });
      start = prev = h;
    }
    blocks.push({ from: `${pad(start)}:00`, to: `${pad(prev+1)}:00` });
    if (blocks.length===1 && blocks[0].from==='00:00' && blocks[0].to==='24:00') return [{from:'00:00', to:'24:00'}];
    return blocks;
  }, []);
  const selectionsToWeekly = useCallback((days: Record<string, boolean>, hours: Record<number, boolean>) => {
    const activeHours = Object.keys(hours).map(Number).filter(h=>hours[h]);
    const intervals = hoursToIntervals(activeHours);
    const weekly: Record<string, DayRange> = {};
    DAY_KEYS.forEach(k => {
      if (!days[k]) { weekly[k] = { closed: true, from: '00:00', to: '00:00' }; }
      else if (intervals.length===1 && intervals[0].from==='00:00' && intervals[0].to==='24:00') {
        weekly[k] = { closed:false, from:'00:00', to:'24:00' };
      } else if (intervals.length>0) {
        // حفظ كفواصل متعددة لليوم الواحد (للواجهة حالياً)
        weekly[k] = { closed:false, from: intervals[0].from, to: intervals[0].to, intervals };
      } else {
        weekly[k] = { closed:true, from:'00:00', to:'00:00' };
      }
    });
    return weekly as Record<string, { closed: boolean; from: string; to: string }>;
  }, []);
  

  // keep form.weekly in sync with selections
  useEffect(() => {
    const weekly = selectionsToWeekly(selDays, selHours);
    setForm(v => ({ ...v, weekly }));
  }, [selDays, selHours, selectionsToWeekly]);

  const openCreate = () => {
    setEditing(null);
    setForm({ user_id: '', profession_id: null, category_id: null, title_ar: "", title_fr: "",
      description_ar: "", description_fr: "",
      gallery: "",
      facebook: "", instagram: "", website: "",
      weekly: defaultWeekly(),
      address_ar: "", address_fr: "",
      visibility: 'PUBLIC', verify_status: 'PENDING' });
    setModalOpen(true);
    // reset selections
    setSelDays({ SUNDAY:false, MONDAY:true, TUESDAY:true, WEDNESDAY:true, THURSDAY:true, FRIDAY:true, SATURDAY:false });
    const nh: Record<number, boolean> = {}; for (let h=0; h<24; h++) nh[h]= h>=8 && h<18; setSelHours(nh);
  };
  const openEdit = (p: ArtisanProfile) => {
    setEditing(p);
    setForm({
      user_id: p.user_id,
      profession_id: p.profession_id ?? null,
      category_id: p.category_id ?? null,
      title_ar: p.title_ar,
      title_fr: p.title_fr || "",
      description_ar: p.description_ar || "",
      description_fr: p.description_fr || "",
      gallery: (p.gallery||[]).join(","),
      facebook: p.social?.facebook || "",
      instagram: p.social?.instagram || "",
      website: p.social?.website || "",
      weekly: ensureWeekly(p.availability),
      address_ar: p.address_ar || "",
      address_fr: p.address_fr || "",
      visibility: p.visibility,
      verify_status: p.verify_status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        user_id: Number(form.user_id),
        profession_id: form.profession_id || null,
        category_id: form.category_id || null,
        title_ar: form.title_ar,
        title_fr: form.title_fr || undefined,
        description_ar: form.description_ar || undefined,
        description_fr: form.description_fr || undefined,
        gallery: (form.gallery||"").split(',').map(s=>s.trim()).filter(Boolean),
        social: { facebook: form.facebook || undefined, instagram: form.instagram || undefined, website: form.website || undefined },
        availability: buildAvailability(form.weekly || defaultWeekly()),
        address_ar: form.address_ar || undefined,
        address_fr: form.address_fr || undefined,
        visibility: form.visibility,
        verify_status: form.verify_status,
      };
      if (editing) {
        const updated = await updateArtisan(editing.id, payload);
        setRows(prev => prev.map(r => (r.id === editing.id ? updated : r)));
        setEditing(null);
      } else {
        const created = await createArtisan(payload);
        setRows(prev => [...prev, created].sort((a,b)=>a.id-b.id));
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
      await restoreArtisan(id);
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
        await deleteArtisan(confirm.id);
      } else {
        await forceDeleteArtisan(confirm.id);
      }
      setRows(prev => prev.filter(r => r.id !== confirm.id));
    } catch {
      alert(confirm.type === 'archive' ? "تعذر الأرشفة" : "تعذر الحذف النهائي");
    } finally {
      setConfirm(null);
    }
  };

  return (
    <DashboardLayout title="الحرفيون">
      <section className="rounded-2xl border border-orange-200/60 bg-white p-0 shadow-sm" dir="rtl">
        <div className="flex items-center justify-between gap-2 rounded-t-2xl border-b border-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-3">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-orange-900">Artisans</h3>
            <p className="text-xs text-gray-600">إدارة بروفايلات الحرفيين</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 sm:flex">
              <svg className="size-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث..." className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-56" />
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              إضافة حرفي
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
                  <th className="px-3 py-2 text-start font-semibold">المستخدم</th>
                  <th className="px-3 py-2 text-start font-semibold">العنوان (AR)</th>
                  <th className="px-3 py-2 text-start font-semibold">العنوان (FR)</th>
                  <th className="px-3 py-2 text-start font-semibold">المهنة</th>
                  <th className="px-3 py-2 text-start font-semibold">التصنيف</th>
                  <th className="px-3 py-2 text-start font-semibold">الظهور</th>
                  <th className="px-3 py-2 text-start font-semibold">التحقق</th>
                  <th className="px-3 py-2 text-end font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition hover:bg-orange-50/40">
                    <td className="px-3 py-3 text-gray-700">{p.user?.name || `#${p.user_id}`}</td>
                    <td className="px-3 py-3 text-gray-700">{p.title_ar}</td>
                    <td className="px-3 py-3 text-gray-700">{p.title_fr || '-'}</td>
                    <td className="px-3 py-3 text-gray-700">{p.profession?.name_fr || p.profession?.name_ar || '-'}</td>
                    <td className="px-3 py-3 text-gray-700">{p.category?.name_fr || p.category?.name_ar || '-'}</td>
                    <td className="px-3 py-3 text-gray-700">{p.visibility}</td>
                    <td className="px-3 py-3 text-gray-700">{p.verify_status}</td>
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
          <form onSubmit={onSubmit} className="w-[min(92vw,900px)] max-w-4xl rounded-2xl border border-orange-200/70 bg-white p-6 shadow-2xl sm:p-7" dir="rtl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-gray-900">{editing ? "تعديل بروفايل" : "إضافة بروفايل"}</h3>
                <p className="mt-1 text-xs text-gray-500">أدخل بيانات الحرفي</p>
              </div>
              <button type="button" onClick={()=>{ setEditing(null); setModalOpen(false); }} className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50">إغلاق</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">المستخدم (حرفي)</span>
                <select required value={form.user_id} onChange={e=>setForm(v=>({ ...v, user_id: e.target.value as unknown as number | '' }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                  <option value="">اختر المستخدم</option>
                  {userOptions.filter(u=>u.role==='ARTISAN').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">المهنة</span>
                <select value={form.profession_id ?? ''} onChange={e=>setForm(v=>({ ...v, profession_id: e.target.value ? Number(e.target.value) : null }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                  <option value="">غير محدد</option>
                  {profOptions.map(p => (
                    <option key={p.id} value={p.id}>{p.name_fr || p.name_ar}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">التصنيف</span>
                <select value={form.category_id ?? ''} onChange={e=>setForm(v=>({ ...v, category_id: e.target.value ? Number(e.target.value) : null }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                  <option value="">غير محدد</option>
                  {catOptions.map(c => (
                    <option key={c.id} value={c.id}>{c.name_fr || c.name_ar}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">العنوان بالعربية</span>
                <input required value={form.title_ar} onChange={e=>setForm(v=>({ ...v, title_ar: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">العنوان بالفرنسية</span>
                <input value={form.title_fr || ''} onChange={e=>setForm(v=>({ ...v, title_fr: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>

              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block text-gray-700">الوصف بالعربية</span>
                <textarea value={form.description_ar || ''} onChange={e=>setForm(v=>({ ...v, description_ar: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" rows={3} />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block text-gray-700">الوصف بالفرنسية</span>
                <textarea value={form.description_fr || ''} onChange={e=>setForm(v=>({ ...v, description_fr: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" rows={3} />
              </label>

              <label className="block text-sm sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="block text-gray-700">معرض الصور (فواصل ,)</span>
                  <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs hover:bg-gray-50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        if (files.length === 0) return;
                        try {
                          setUploading(true);
                          const urls = await uploadImages(files, 'artisans');
                          setForm(v=>{
                            const existing = (v.gallery || '').split(',').map(s=>s.trim()).filter(Boolean);
                            const next = Array.from(new Set([...existing, ...urls]));
                            return { ...v, gallery: next.join(',') };
                          });
                        } catch {
                          alert('فشل رفع الصور');
                        } finally {
                          setUploading(false);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-gray-700">{uploading ? 'جاري الرفع…' : 'إضافة صور'}</span>
                  </label>
                </div>
                <input value={form.gallery || ''} onChange={e=>setForm(v=>({ ...v, gallery: e.target.value }))} placeholder="/assets/1.jpg,/assets/2.jpg" className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                {galleryList.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {galleryList.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img src={resolveSrc(src)} alt="gallery" className="h-24 w-full object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={()=> setForm(v=>{
                            const next = galleryList.filter((_,i)=>i!==idx);
                            return { ...v, gallery: next.join(',') };
                          })}
                          className="absolute top-1 right-1 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow hover:bg-white"
                        >إزالة</button>
                      </div>
                    ))}
                  </div>
                )}
              </label>

              <div className="grid gap-4 sm:grid-cols-3 sm:col-span-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block text-gray-700">Facebook</span>
                  <input value={form.facebook || ''} onChange={e=>setForm(v=>({ ...v, facebook: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-gray-700">Instagram</span>
                  <input value={form.instagram || ''} onChange={e=>setForm(v=>({ ...v, instagram: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-gray-700">Website</span>
                  <input value={form.website || ''} onChange={e=>setForm(v=>({ ...v, website: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
              </div>

              {/* Availability builder: days then hours */}
              <div className="sm:col-span-2">
                <div className="mb-1.5 text-sm font-semibold text-gray-800">أيام العمل</div>
                <div className="flex flex-wrap gap-2">
                  {DAY_KEYS.map((k) => (
                    <label key={k} className="inline-flex items-center gap-2 rounded border px-3 py-1 text-sm">
                      <input type="checkbox" checked={!!selDays[k]} onChange={e=>setSelDays(prev=>({ ...prev, [k]: e.target.checked }))} />
                      {DAY_AR[k]}
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-800">ساعات العمل</div>
                  <div className="flex items-center gap-2 text-xs">
                    <button type="button" onClick={()=>{
                      const nh: Record<number, boolean> = {}; for (let h=0; h<24; h++) nh[h]=true; setSelHours(nh);
                    }} className="rounded-md border px-2 py-1 hover:bg-gray-50">24h/24</button>
                    <button type="button" onClick={()=>{
                      const nh: Record<number, boolean> = {}; for (let h=0; h<24; h++) nh[h]= h>=8 && h<18; setSelHours(nh);
                    }} className="rounded-md border px-2 py-1 hover:bg-gray-50">دوام إداري</button>
                    <button type="button" onClick={()=>{
                      const nh: Record<number, boolean> = {}; for (let h=0; h<24; h++) nh[h]= false; setSelHours(nh);
                    }} className="rounded-md border px-2 py-1 hover:bg-gray-50">مسح الكل</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({length:24}).map((_,h)=> (
                    <label key={h} className="inline-flex items-center gap-2 rounded border px-2 py-1 text-xs">
                      <input type="checkbox" checked={!!selHours[h]} onChange={e=>setSelHours(prev=>({ ...prev, [h]: e.target.checked }))} />
                      {String(h).padStart(2,'0')}:00
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">اختر الأيام ثم حدّد الساعات؛ تُحفظ تلقائياً في البروفايل.</p>
              </div>

              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">العنوان بالعربية</span>
                <input value={form.address_ar || ''} onChange={e=>setForm(v=>({ ...v, address_ar: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">العنوان بالفرنسية</span>
                <input value={form.address_fr || ''} onChange={e=>setForm(v=>({ ...v, address_fr: e.target.value }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">الظهور</span>
                <select value={form.visibility} onChange={e=>setForm(v=>({ ...v, visibility: e.target.value as 'PUBLIC'|'PRIVATE' }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVATE">PRIVATE</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-gray-700">التحقق</span>
                <select value={form.verify_status} onChange={e=>setForm(v=>({ ...v, verify_status: e.target.value as 'PENDING'|'VERIFIED'|'REJECTED' }))} className="w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                  <option value="PENDING">PENDING</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
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
