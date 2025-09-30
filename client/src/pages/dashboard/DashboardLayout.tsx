import {  LayoutDashboard, MapPin, Building2, Users, User, MessageSquare, Tag, Layers, Briefcase, HelpCircle, Search, Menu, Home, Sun, Moon, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";

export default function DashboardLayout({ title, children }: { title: string; children: React.ReactNode }) {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            <div className="mx-auto grid grid-cols-1 gap-4 px-3 py-4 sm:px-4 sm:py-6 lg:grid-cols-[260px_1fr]">
                <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] rounded-2xl border border-orange-200/60 bg-white/80 p-4 shadow-sm backdrop-blur lg:block">
                    <div className="mb-4 flex items-center justify-between px-2">
                        <div className="text-lg font-extrabold text-orange-900">Mihane</div>
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700 ring-1 ring-orange-200/70">Super</span>
                    </div>
                    <nav className="space-y-1 text-sm">
                        <DashLink to="/dashboard/super" label="Default" icon={<LayoutDashboard className="size-4" />} />
                        <DashLink to="/dashboard/super/regions" label="Regions" icon={<MapPin className="size-4" />} />
                        <DashLink to="/dashboard/super/cities" label="Cities" icon={<Building2 className="size-4" />} />
                        <DashLink to="/dashboard/super/artisans" label="Artisans" icon={<Users className="size-4" />} />
                        <DashLink to="/dashboard/super/users" label="Users" icon={<User className="size-4" />} />
                        <DashLink to="/dashboard/super/testimonials" label="Testimonials" icon={<MessageSquare className="size-4" />} />
                        <DashLink to="/dashboard/super/genders" label="Genders" icon={<Tag className="size-4" />} />
                        <DashLink to="/dashboard/super/categories" label="Categories" icon={<Layers className="size-4" />} />
                        <DashLink to="/dashboard/super/professions" label="Professions" icon={<Briefcase className="size-4" />} />
                        <DashLink to="/dashboard/super/faqs" label="FAQs" icon={<HelpCircle className="size-4" />} />
                    </nav>
                </aside>

                {menuOpen && (
                    <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
                        <div className="relative ml-0 flex h-full w-72 flex-col bg-white/95 p-4 shadow-xl backdrop-blur">
                            <div className="mb-4 flex items-center justify-between px-2">
                                <div className="text-lg font-extrabold text-orange-900">Mihane</div>
                                <button onClick={() => setMenuOpen(false)} className="rounded-lg border px-2 py-1 text-sm">إغلاق</button>
                            </div>
                            <nav className="space-y-1 text-sm">
                                <DashLink to="/dashboard/super" label="Default" icon={<LayoutDashboard className="size-4" />} />
                                <DashLink to="/dashboard/super/regions" label="Regions" icon={<MapPin className="size-4" />} />
                                <DashLink to="/dashboard/super/cities" label="Cities" icon={<Building2 className="size-4" />} />
                                <DashLink to="/dashboard/super/artisans" label="Artisans" icon={<Users className="size-4" />} />
                                <DashLink to="/dashboard/super/users" label="Users" icon={<User className="size-4" />} />
                                <DashLink to="/dashboard/super/testimonials" label="Testimonials" icon={<MessageSquare className="size-4" />} />
                                <DashLink to="/dashboard/super/genders" label="Genders" icon={<Tag className="size-4" />} />
                                <DashLink to="/dashboard/super/categories" label="Categories" icon={<Layers className="size-4" />} />
                                <DashLink to="/dashboard/super/professions" label="Professions" icon={<Briefcase className="size-4" />} />
                                <DashLink to="/dashboard/super/faqs" label="FAQs" icon={<HelpCircle className="size-4" />} />
                            </nav>
                        </div>
                    </div>
                )}

                <main className="space-y-4">
                    <div className="sticky top-2 z-30 flex items-center justify-between rounded-2xl border border-orange-200/40 bg-gradient-to-br from-orange-50/90 to-amber-50/90 px-2 py-2 shadow-sm ring-1 ring-white/50 backdrop-blur sm:px-3 sm:py-2 dark:border-gray-700/60 dark:from-gray-900/70 dark:to-gray-800/70 dark:ring-black/20" dir="rtl">
                        <div className="leading-tight">
                            <h1 className="text-xl font-extrabold tracking-tight text-orange-900 sm:text-2xl dark:text-amber-200">{title}</h1>
                            <p className="mt-0.5 text-xs text-gray-600 sm:text-sm dark:text-gray-300">مرحباً {user?.name || ""}</p>
                        </div>
                        <Topbar onMenu={() => setMenuOpen(true)} />
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}

function DashLink({ to, label, active = false, icon }: { to: string; label: string; active?: boolean; icon?: React.ReactNode }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                "flex items-center gap-2 rounded-lg px-3 py-2 font-semibold transition " +
                ((isActive || active) ? "bg-orange-100 text-orange-900" : "text-gray-700 hover:bg-orange-50")
            }
            end
        >
            {icon && <span className="text-orange-700">{icon}</span>}
            <span>{label}</span>
        </NavLink>
    );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
    const { i18n } = useTranslation();
    const [dark, setDark] = useState<boolean>(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false));
    const [lang, setLang] = useState<string>(() => (typeof window !== 'undefined' ? (localStorage.getItem('lang') || i18n.language || 'ar') : 'ar'));
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    useEffect(() => {
        i18n.changeLanguage(lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('lang', lang);
    }, [lang, i18n]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
    return (
        <div className="flex items-center gap-2" dir="rtl">
            <button onClick={onMenu} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200/60 bg-white text-gray-700 hover:bg-orange-50 lg:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" aria-label="فتح القائمة">
                <Menu className="size-4" />
            </button>

            <div className="flex items-center gap-2 rounded-full border border-orange-200/60 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <NavLink to="/account/profile" className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-amber-200 text-sm font-bold text-orange-900 ring-1 ring-orange-300/60" title="الملف الشخصي">
                    {String((useAuth().user?.name || 'U').charAt(0)).toUpperCase()}
                </NavLink>
                <NavLink to="/" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/60 bg-white text-gray-700 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" title="الصفحة الرئيسية">
                    <Home className="size-4" />
                </NavLink>
                <button onClick={() => setLang(l => (l === 'ar' ? 'fr' : 'ar'))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-orange-200/60 bg-white px-2 text-gray-700 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" title="تغيير اللغة">
                    <Languages className="size-4" />
                    <span className="text-xs font-semibold">{lang === 'ar' ? 'FR' : 'AR'}</span>
                </button>
                <button onClick={() => setDark(v => !v)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/60 bg-white text-gray-700 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}>
                    {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
            </div>

            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-orange-200/60 bg-white p-2 pl-3 pr-2 sm:flex dark:border-gray-700 dark:bg-gray-900">
                <span className="hidden shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 md:inline dark:bg-gray-800 dark:text-gray-300">Ctrl + K</span>
                <input
                    ref={searchRef}
                    placeholder="بحث..."
                    aria-label="بحث"
                    className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-200/60 bg-white text-gray-700 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                    <Search className="size-4" />
                </div>
            </div>
        </div>
    );
}