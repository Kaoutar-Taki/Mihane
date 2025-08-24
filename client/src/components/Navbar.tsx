import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-white/90 shadow backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-primary flex items-center gap-2 text-xl font-bold"
        >
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `hover:text-primary text-sm font-medium transition ${
                  isActive ? "text-primary" : "text-gray-700"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}

          <span className="mx-1 text-gray-300">|</span>
          <LanguageSwitcher />

          <span className="mx-1 text-gray-300">|</span>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user.name} ·{" "}
                {user.role === "client" ? t("auth.client") : t("auth.pro")}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="hover:text-primary text-sm text-gray-700 transition"
              >
                {t("auth.signout")}
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-primary text-sm text-gray-700 transition"
              >
                {t("login.title")}
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/register"
                className="text-primary text-sm hover:underline"
              >
                {t("register.title")}
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label={t("navbar.toggleMenu")}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-orange-100 bg-white px-4 pt-3 pb-4 md:hidden"
        >
          <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            {navItems.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="hover:text-primary transition"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ))}

            <hr className="my-2 border-orange-100" />

            {user ? (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="hover:text-primary text-left text-sm text-gray-700 transition"
              >
                {t("auth.signout")}
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-primary text-sm text-gray-700 transition"
                  onClick={() => setOpen(false)}
                >
                  {t("login.title")}
                </Link>
                <Link
                  to="/register"
                  className="text-primary text-sm hover:underline"
                  onClick={() => setOpen(false)}
                >
                  {t("register.title")}
                </Link>
              </>
            )}

            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
