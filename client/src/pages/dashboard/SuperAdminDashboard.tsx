import type { LucideIcon } from "lucide-react";
import { Users, BadgeCheck, Activity, ShieldAlert, TrendingUp, MapPin, Server, HardDrive, Wifi, ArrowUpRight, Loader2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../auth/AuthContext";
import { getOverview, type StatsOverview } from "../../services/stats";

export default function SuperAdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr(null);
        const s = await getOverview();
        setStats(s);
      } catch {
        setErr("تعذر تحميل الإحصائيات — سيتم عرض بيانات تجريبية.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || user.role !== "SUPER_ADMIN") return <Navigate to="/" replace />;

  return (
    <DashboardLayout title="لوحة تحكم المشرف العام">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <KPI label="إجمالي المستخدمين" value={stats?.kpis.totalUsers ?? 0} icon={Users} tone="emerald" spark={stats ? stats.series.signups.slice(-16) : [12,18,14,19,21,20,24,27,26,29,31,33,36,38,37,41]} />
        <KPI label="حرفيون موثَّقون" value={stats?.kpis.verifiedArtisans ?? 0} icon={BadgeCheck} tone="sky" spark={stats ? stats.series.profiles.slice(-16) : [2,3,3,5,4,6,5,7,8,9,10,12,12,13,14,16]} />
        <KPI label="طلبات تنتظر المراجعة" value={stats?.kpis.pendingRequests ?? 0} icon={Activity} tone="amber" spark={[35,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19]} />
        <KPI label="أخطاء حرجة" value={stats?.kpis.criticalErrors ?? 0} icon={ShieldAlert} tone="rose" spark={[4,4,5,5,5,4,4,3,3,3,3,3,3,3,3,3]} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="نظرة عامة (آخر 30 يوماً)" desc={loading ? "جاري التحميل…" : "التسجيلات • ملفات الحرفيين"}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AreaChart label="التسجيلات" tone="sky" data={stats?.series.signups ?? demo.series.signups} />
              <LineChart label="ملفات حرفيين جديدة" tone="emerald" data={stats?.series.profiles ?? demo.series.signups} />
            </div>
          </Card>

          <Card title="طلبات بانتظار الموافقة" desc="يمكنك قبول/رفض مباشرة">
            <PendingApprovals />
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="الأهداف والتقدم" desc="متابعة الأداء" noPad>
              <div className="grid grid-cols-1 gap-4 p-4">
                <Goal title="إكمال الملفات" value={76} tone="emerald" />
                <Goal title="التحقق من الحرفيين" value={41} tone="sky" />
                <Goal title="الرد على الطلبات" value={62} tone="amber" />
              </div>
            </Card>

            <Card title="آخر الأنشطة" desc="مقتطف من سجل التدقيق (Audit)" noPad>
              <AuditList />
            </Card>
          </div>

          <Card title="إجراءات سريعة" desc="مهام متكررة">
            <QuickActions />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="صحة النظام" desc="حالة الخدمات" noPad>
            <SystemHealth />
          </Card>

          <Card title="توزيع حسب الجهة" desc="آخر 7 أيام">
            <DonutChart segments={(stats?.regions ?? []).length
              ? (stats!.regions.map((r, i) => ({ label: r.region, value: r.visitors, tone: (['emerald','sky','amber','rose'] as const)[i % 4] })) )
              : [
                { label: "الرباط", value: 32, tone: "emerald" as const },
                { label: "الدار البيضاء", value: 28, tone: "sky" as const },
                { label: "فاس", value: 18, tone: "amber" as const },
                { label: "طنجة", value: 22, tone: "rose" as const },
              ]} />
          </Card>

          <Card title="أداء الجهات (Top Regions)" desc="الأكثر زيارة">
            <RegionsTable rows={demo.regions} />
          </Card>

          {err ? <div className="rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-800">{err}</div> : <TipsCard />}
        </div>
      </section>
    </DashboardLayout>
  );
}

function Card({ title, desc, children, noPad }: { title?: string; desc?: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <section className="rounded-3xl border border-orange-200/70 bg-white/80 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-white/5">
      {(title || desc) && (
        <div className="flex items-center justify-between gap-3 border-b border-orange-200/50 px-5 py-4 dark:border-white/10">
          <div>
            {title && <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{title}</h2>}
            {desc && <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>}
          </div>
          <ArrowUpRight className="hidden text-gray-300 dark:text-gray-600 sm:block" size={16} />
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </section>
  );
}

function KPI({ label, value, delta, icon: Icon, tone = "emerald", spark = [] }: { label: string; value: number; delta?: string; icon: LucideIcon; tone?: Tone; spark?: number[]; }) {
  const toneMap: Record<Tone, string> = {
    emerald: "from-emerald-50 to-teal-50 text-emerald-600 dark:from-emerald-900/20 dark:to-teal-900/10 dark:text-emerald-300",
    sky: "from-sky-50 to-indigo-50 text-sky-600 dark:from-sky-900/20 dark:to-indigo-900/10 dark:text-sky-300",
    amber: "from-amber-50 to-orange-50 text-amber-600 dark:from-amber-900/20 dark:to-orange-900/10 dark:text-amber-300",
    rose: "from-rose-50 to-fuchsia-50 text-rose-600 dark:from-rose-900/20 dark:to-fuchsia-900/10 dark:text-rose-300",
  };
  return (
    <div className={`rounded-3xl border border-orange-200/70 bg-gradient-to-br p-4 shadow-sm backdrop-blur dark:border-white/10 ${toneMap[tone]}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
        <div className="inline-flex size-9 items-center justify-center rounded-2xl bg-white/70 text-gray-800 shadow-sm dark:bg-white/10 dark:text-gray-200">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-1 flex items-end justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{Intl.NumberFormat().format(value)}</div>
        {delta &&
         (() => {
          const isNeg = /^\s*[−-]/.test(delta);
          const chip = isNeg
            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
          return (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${chip}`}>
              <TrendingUp size={12} /> {delta}
            </span>
          );
        })()}
      </div>
      <Sparkline data={spark} tone={tone} />
    </div>
  );
}

function Sparkline({ data, tone }: { data: number[]; tone: Tone }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i/(data.length-1))*100},${100 - (v/max)*100}`).join(" ");
  const stroke = tone === "emerald" ? "stroke-emerald-500" : tone === "sky" ? "stroke-sky-500" : tone === "amber" ? "stroke-amber-500" : "stroke-rose-500";
  return (
    <div className="mt-2 h-12">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <polyline points={pts} className={`fill-none stroke-2 ${stroke} opacity-80`} />
      </svg>
    </div>
  );
}

function Goal({ title, value, tone = "emerald" }: { title: string; value: number; tone?: Tone }) {
  const bar = tone === "emerald" ? "bg-emerald-500" : tone === "sky" ? "bg-sky-500" : tone === "amber" ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="rounded-2xl border border-orange-200/60 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
        <span className="font-bold text-gray-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
        <div className={`h-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

type Tone = "emerald" | "sky" | "amber" | "rose";

function AreaChart({ label, data, tone = "sky" }: { label: string; data: number[]; tone?: Tone }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i/(data.length-1))*100},${100 - (v/max)*100}`).join(" ");
  const fill = tone === "emerald" ? "fill-emerald-300/35" : tone === "amber" ? "fill-amber-300/35" : tone === "rose" ? "fill-rose-300/35" : "fill-sky-300/35";
  const stroke = tone === "emerald" ? "stroke-emerald-500" : tone === "amber" ? "stroke-amber-500" : tone === "rose" ? "stroke-rose-500" : "stroke-sky-500";
  return (
    <div className="relative h-56 rounded-2xl border border-orange-200/60 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <polyline points={pts} className={`stroke-2 ${stroke} fill-none`} />
        <polygon points={`0,100 ${pts} 100,100`} className={`${fill}`} />
      </svg>
      <span className="pointer-events-none absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

function LineChart({ label, data, tone = "emerald" }: { label: string; data: number[]; tone?: Tone }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i/(data.length-1))*100},${100 - (v/max)*100}`).join(" ");
  const stroke = tone === "emerald" ? "stroke-emerald-500" : tone === "amber" ? "stroke-amber-500" : tone === "rose" ? "stroke-rose-500" : "stroke-sky-500";
  return (
    <div className="relative h-56 rounded-2xl border border-orange-200/60 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <polyline points={pts} className={`fill-none stroke-2 ${stroke} opacity-90`} />
      </svg>
      <span className="pointer-events-none absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; tone: Tone }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  const color = (t: Tone) => t === "emerald" ? "#10b981" : t === "sky" ? "#0ea5e9" : t === "amber" ? "#f59e0b" : "#e11d48";
  const slices = segments.map((s) => {
    const start = (acc/total) * 2 * Math.PI; acc += s.value; const end = (acc/total) * 2 * Math.PI;
    const large = end - start > Math.PI ? 1 : 0; const r = 45, cx = 50, cy = 50;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { d, s };
  });
  return (
    <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
      <div className="relative h-56 w-56 place-self-center rounded-2xl border border-orange-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {slices.map(({ d, s }, i) => (<path key={i} d={d} fill={color(s.tone)} opacity="0.9" />))}
          <circle cx="50" cy="50" r="25" className="fill-white dark:fill-gray-900" />
          <text x="50" y="53" textAnchor="middle" className="fill-gray-800 text-xs dark:fill-gray-200">الزيارات</text>
        </svg>
      </div>
      <ul className="space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between rounded-2xl border border-orange-200/60 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <span className="flex items-center gap-2"><span className="inline-block size-3 rounded-full" style={{ backgroundColor: color(s.tone) }} />{s.label}</span>
            <span className="text-gray-700 dark:text-gray-300">{Math.round((s.value/total)*100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PendingApprovals() {
  const [busyId, setBusyId] = useState<number | null>(null);
  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200/60 dark:border-white/10">
      <table className="min-w-full divide-y divide-orange-200/60 dark:divide-white/10">
        <thead className="bg-orange-50/60 dark:bg-white/5">
          <tr className="text-right text-xs text-gray-600 dark:text-gray-300">
            <th className="px-4 py-3">الإسم</th>
            <th className="px-4 py-3">النوع</th>
            <th className="px-4 py-3">الجهة</th>
            <th className="px-4 py-3">تاريخ الطلب</th>
            <th className="px-4 py-3">إجراء</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-200/60 bg-white/60 text-sm dark:divide-white/10 dark:bg-white/5">
          {demo.approvals.map((r) => (
            <tr key={r.id} className="hover:bg-orange-50/70 dark:hover:bg-white/10">
              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{r.name}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.type}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300"><MapPin className="ml-1 inline" size={14} />{r.region}</td>
              <td className="px-4 py-3 tabular-nums text-gray-600 dark:text-gray-300">{r.date}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => act(setBusyId, r.id)} className="inline-flex items-center gap-1 rounded-xl border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:brightness-110 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">{busyId === r.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} قبول</button>
                  <button onClick={() => act(setBusyId, r.id)} className="inline-flex items-center gap-1 rounded-xl border border-rose-200/60 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:brightness-110 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">{busyId === r.id ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />} رفض</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function act(setBusyId: (n: number | null) => void, id: number) {
  setBusyId(id);
  setTimeout(() => setBusyId(null), 900);
}

function AuditList() {
  return (
    <ul className="divide-y divide-orange-200/60 text-sm dark:divide-white/10">
      {demo.audit.map((a, i) => (
        <li key={i} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex size-2 rounded-full ${a.tone === "amber" ? "bg-amber-500" : a.tone === "rose" ? "bg-rose-500" : "bg-emerald-500"}`} />
            <span className="text-gray-800 dark:text-gray-200">{a.text}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{a.time}</span>
        </li>
      ))}
    </ul>
  );
}

function QuickActions() {
  const actions = ["إنشاء Admin", "إدارة الصلاحيات", "تعطيل مستخدم", "مراجعة التقارير", "تحديث الإعدادات", "تسجيل الخروج من الجميع"];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {actions.map((a) => (
        <button key={a} className="rounded-2xl border border-orange-200/60 bg-white/70 px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:scale-[1.01] dark:border-white/10 dark:bg-white/5 dark:text-gray-100">
          {a}
        </button>
      ))}
    </div>
  );
}

function SystemHealth() {
  const items = [
    { icon: Server, label: "API", status: "جيد", tone: "emerald" },
    { icon: HardDrive, label: "قاعدة البيانات", status: "جيد", tone: "emerald" },
    { icon: Wifi, label: "التخزين", status: "—", tone: "amber" },
    { icon: ShieldAlert, label: "المصادقة", status: "جيد", tone: "emerald" },
  ] as const;
  return (
    <div className="grid grid-cols-1">
      {items.map((it, i) => (
        <div key={i} className="flex items-center justify-between gap-3 border-b border-orange-200/60 px-4 py-3 last:border-0 dark:border-white/10">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            <it.icon size={16} className="opacity-70" /> {it.label}
          </div>
          <div className={`text-xs ${it.tone === "emerald" ? "text-emerald-600 dark:text-emerald-300" : it.tone === "amber" ? "text-amber-600 dark:text-amber-300" : "text-rose-600 dark:text-rose-300"}`}>{it.status}</div>
        </div>
      ))}
    </div>
  );
}

function RegionsTable({ rows }: { rows: { region: string; visitors: number; growth: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200/60 dark:border-white/10">
      <table className="min-w-full divide-y divide-orange-200/60 dark:divide-white/10">
        <thead className="bg-orange-50/60 dark:bg-white/5">
          <tr className="text-right text-xs text-gray-600 dark:text-gray-300">
            <th className="px-4 py-3">الجهة</th>
            <th className="px-4 py-3">الزيارات</th>
            <th className="px-4 py-3">النمو</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-200/60 bg-white/60 text-sm dark:divide-white/10 dark:bg-white/5">
          {rows.map((r) => (
            <tr key={r.region} className="hover:bg-orange-50/70 dark:hover:bg-white/10">
              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{r.region}</td>
              <td className="px-4 py-3 tabular-nums text-gray-700 dark:text-gray-300">{Intl.NumberFormat().format(r.visitors)}</td>
              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-300">{r.growth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TipsCard() {
  return (
    <section className="rounded-3xl border border-dashed border-orange-300/70 bg-gradient-to-br from-orange-50/60 to-amber-50/60 p-5 text-sm text-gray-800 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-white/0 dark:text-gray-200">
      <div className="mb-1 font-extrabold">نصيحة سريعة</div>
      <p className="leading-relaxed">اربط هذه المؤشرات ببيانات الـ API لاحقاً عبر SWR أو React Query. كذلك احفظ تفضيلات العرض (الوضع الداكن/الفاتح) في localStorage.</p>
    </section>
  );
}

const demo = {
  series: {
    visits: [12,18,14,22,28,24,30,27,35,31,38,36,40,42,39,45,43,48,46,52,49,55,58,60,63,61,65,68,70,73],
    signups: [2,3,3,5,4,6,5,7,6,7,8,7,9,10,9,11,10,12,11,13,12,13,14,15,15,16,17,18,18,19],
  },
  approvals: [
    { id: 1, name: "خالد بن صالح", type: "حرفي — سباكة", region: "مراكش", date: "2025-09-20" },
    { id: 2, name: "سارة المريني", type: "حرفي — حدادة", region: "فاس", date: "2025-09-21" },
    { id: 3, name: "زهير الهامل", type: "مزود خدمة", region: "الرباط", date: "2025-09-22" },
  ],
  audit: [
    { text: "تحديث سعر خدمة — حدادة", time: "قبل دقيقة", tone: "emerald" },
    { text: "محاولة دخول فاشلة (IP: 41.248.*)", time: "قبل 10 دقائق", tone: "amber" },
    { text: "ترقية صلاحية مستخدم → Moderator", time: "قبل 1 ساعة", tone: "emerald" },
    { text: "إيقاف حساب بسبب البلاغات", time: "قبل 3 ساعات", tone: "rose" },
  ],
  regions: [
    { region: "الرباط", visitors: 12450, growth: "+8%" },
    { region: "الدار البيضاء", visitors: 11020, growth: "+5%" },
    { region: "طنجة", visitors: 9340, growth: "+3%" },
    { region: "مراكش", visitors: 8120, growth: "+2%" },
  ],
};
