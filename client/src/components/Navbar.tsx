import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = [
    { to: "/", label: t("navbar.home") },
    { to: "/about", label: t("navbar.about") },
    { to: "/contact", label: t("contact.title") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white/95 via-orange-50/90 to-amber-50/95 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20 opacity-50"></div>

      <div className="relative z-10 container mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="group flex items-center gap-3 text-xl font-bold transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <Logo />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles
              size={16}
              className="text-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                }`
              }
            >
              {it.label}
              <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 group-hover:w-full"></div>
            </NavLink>
          ))}

          <div className="mx-2 h-6 w-px bg-gradient-to-b from-orange-200 to-amber-200"></div>
          <LanguageSwitcher />

          <div className="mx-2 h-6 w-px bg-gradient-to-b from-orange-200 to-amber-200"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {user.name} ·{" "}
                <span className="text-orange-600">
                  {user.role === "client" ? t("auth.client") : t("auth.pro")}
                </span>
              </span>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg"
              >
                {t("auth.signout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:text-orange-600"
              >
                {t("login.title")}
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg"
              >
                {t("register.title")}
              </Link>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="group relative rounded-lg p-2 text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label={t("navbar.toggleMenu")}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-100/50 to-amber-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative">
            {open ? <X size={20} /> : <Menu size={20} />}
          </div>
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="relative border-t border-orange-200/50 bg-gradient-to-br from-white/95 to-orange-50/90 px-4 pt-4 pb-6 backdrop-blur-md md:hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
          <div className="relative z-10 flex flex-col gap-4 text-sm font-semibold text-gray-700">
            {navItems.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="rounded-lg px-3 py-2 transition-all duration-300 hover:bg-orange-100/50 hover:text-orange-600"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ))}

            <div className="my-3 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>

            {user ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  {user.name} ·{" "}
                  <span className="text-orange-600">
                    {user.role === "client" ? t("auth.client") : t("auth.pro")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-left text-sm font-semibold text-white transition-all duration-300 hover:from-orange-600 hover:to-amber-600"
                >
                  {t("auth.signout")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-orange-100/50 hover:text-orange-600"
                  onClick={() => setOpen(false)}
                >
                  {t("login.title")}
                </Link>
                <Link
                  to="/register"
                  className="block rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-center text-sm font-semibold text-white transition-all duration-300 hover:from-orange-600 hover:to-amber-600"
                  onClick={() => setOpen(false)}
                >
                  {t("register.title")}
                </Link>
              </div>
            )}

            <div className="pt-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
