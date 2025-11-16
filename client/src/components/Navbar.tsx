import { Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";

import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { apiLogout, getStoredAuth, clearStoredAuth, type StoredAuth } from "../services/auth";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<StoredAuth | null>(getStoredAuth());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onStorage = () => setAuth(getStoredAuth());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSignOut = async () => {
    try {
      if (auth?.token) {
        await apiLogout(auth.token).catch(() => { });
      }
    } finally {
      clearStoredAuth();
      setAuth(null);
      navigate("/", { replace: true });
    }
  };

  const navItems = [
    { to: "/", label: t("navbar.home") },
    { to: "/about", label: t("navbar.about") },
    { to: "/contact", label: t("contact.title") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white/95 via-orange-50/90 to-amber-50/95 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-900/90 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-orange-100/20 to-amber-100/20 dark:from-orange-900/10 dark:to-amber-900/10"></div>

      <div className="container relative z-10 flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold transition-all duration-300 group hover:scale-105"
        >
          <div className="relative">
            <Logo />
            <div className="absolute transition-opacity duration-300 rounded-full opacity-0 -inset-1 bg-gradient-to-r from-orange-400/20 to-amber-400/20 blur group-hover:opacity-100"></div>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles
              size={16}
              className="text-orange-500 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        <nav className="items-center hidden gap-8 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-700 hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
                }`
              }
            >
              {it.label}
              <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 group-hover:w-full dark:from-orange-400 dark:to-amber-400"></div>
            </NavLink>
          ))}

          <div className="w-px h-6 mx-2 bg-gradient-to-b from-orange-200 to-amber-200 dark:from-slate-700 dark:to-slate-700"></div>
          <LanguageSwitcher />

          <div className="w-px h-6 mx-2 bg-gradient-to-b from-orange-200 to-amber-200 dark:from-slate-700 dark:to-slate-700"></div>

          {auth?.user ? (
            <UserMenu auth={auth} onSignOut={handleSignOut} />
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
              >
                {t("login.title")}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg dark:from-orange-500 dark:to-amber-400"
              >
                {t("register.title")}
              </Link>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="relative p-2 text-gray-700 transition-all duration-300 rounded-lg group hover:bg-orange-50 hover:text-orange-600 md:hidden dark:text-slate-100 dark:hover:bg-slate-800/70 dark:hover:text-orange-400"
          onClick={() => setOpen((s) => !s)}
          aria-label={t("navbar.toggleMenu")}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-gradient-to-r from-orange-100/50 to-amber-100/50 group-hover:opacity-100"></div>
          <div className="relative">
            {open ? <X size={20} /> : <Menu size={20} />}
          </div>
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden dark:bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div id="mobile-menu" className="fixed inset-x-0 z-50 top-14 md:hidden">
            <div className="p-4 mx-3 bg-white border shadow-xl rounded-2xl border-orange-200/60 ring-1 ring-white/40 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800/60">
              <div className="relative z-10 flex flex-col gap-2 overflow-y-auto text-sm font-semibold text-gray-800 max-h-[75vh] dark:text-slate-100">
                {auth?.user && (
                  <div className="flex items-center justify-between p-3 mb-2 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-slate-800 dark:to-slate-900">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-gray-900 dark:text-slate-50">{auth.user.name}</p>
                      {auth.user.email && (
                        <p className="truncate text-[12px] font-normal text-gray-500 dark:text-slate-300">{auth.user.email}</p>
                      )}
                    </div>
                    {auth.user.role && (
                      <span className="ml-3 shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200">
                        {auth.user.role === "CLIENT" ? t("auth.client") : t("auth.pro")}
                      </span>
                    )}
                  </div>
                )}
                {navItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 transition-all duration-300 ${
                        isActive ? "bg-orange-100/70 text-orange-700" : "hover:bg-orange-100/50 hover:text-orange-600"
                      }`
                    }
                  >
                    {it.label}
                  </NavLink>
                ))}

                <div className="h-px my-3 bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-slate-700"></div>

                {auth?.user ? (
                  <div className="space-y-3">
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-orange-100/70 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                            : "text-gray-700 hover:bg-orange-100/50 hover:text-orange-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-orange-300"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {t("navbar.dashboard", { defaultValue: "لوحة التحكم" })}
                    </NavLink>
                    <NavLink
                      to="/account/profile"
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                          isActive ? "bg-orange-100/70 text-orange-700" : "text-gray-700 hover:bg-orange-100/50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {t("navbar.profile", { defaultValue: "حسابي" })}
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm font-semibold text-left text-gray-800 transition-all duration-300 bg-white rounded-lg hover:bg-orange-100/50 hover:text-orange-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-orange-300"
                    >
                      {t("auth.signout")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                          isActive ? "bg-orange-100/70 text-orange-700" : "text-gray-700 hover:bg-orange-100/50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {t("login.title")}
                    </NavLink>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm font-semibold text-center text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-500 dark:to-amber-400"
                      onClick={() => setOpen(false)}
                    >
                      {t("register.title")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

