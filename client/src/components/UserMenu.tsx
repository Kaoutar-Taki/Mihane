import { ChevronRight, LogOut, User, LayoutGrid, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { StoredAuth } from "../services/auth";
import { resolveAssetUrl } from "../services/profile";

type Props = {
  auth: StoredAuth;
  onSignOut: () => void;
};

export default function UserMenu({ auth, onSignOut }: Props) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (popRef.current?.contains(target) || btnRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const avatar = auth.user?.avatar || "";
  const avatarUrl = resolveAssetUrl(avatar) || "";
  const name = auth.user?.name || "";
  const email = auth.user?.email || "";
  const role = auth.user?.role || "";
  const dir = i18n.dir() as "rtl" | "ltr";
  const isRTL = dir === "rtl";

  return (
    <div className="relative" dir={dir}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="relative w-12 h-12 overflow-visible transition rounded-full shadow ring-2 ring-white/70 hover:shadow-md"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-full h-full overflow-hidden rounded-full">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="object-cover w-full h-full" />)
          : (
            <div className="flex items-center justify-center w-full h-full text-sm font-bold text-orange-800 bg-gradient-to-br from-orange-200 to-amber-200">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
      </button>

      <div
        ref={popRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`absolute mt-3 w-72 origin-top-right rounded-2xl border border-orange-100/60 bg-white/95 backdrop-blur shadow-xl transition-all ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        } ${isRTL ? "left-0 origin-top-left" : "right-0 origin-top-right"}`}
        role="menu"
      >
        <div className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 overflow-hidden rounded-xl ring-1 ring-orange-100">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-base font-bold text-orange-800 bg-gradient-to-br from-orange-200 to-amber-200">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 truncate">{name}</p>
              {role && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                  {role === "CLIENT"
                    ? t("auth.client", { defaultValue: "Client" })
                    : role === "ARTISAN"
                      ? t("auth.pro", { defaultValue: "Artisan" })
                      : role}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 truncate">{email}</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

        <nav className="p-1">
          <Link
            to="/account/profile"
            className="group mt-0.5 flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-orange-50"
          >
            <span
              className={`inline-flex items-center gap-2 ${
                isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
              }`}
            >
              <User size={16} className="text-orange-500" />
              {t("navbar.profile", { defaultValue: t("My Profile") })}
            </span>
            <ChevronRight
              size={16}
              className={`text-gray-400 group-hover:text-orange-500 ${isRTL ? "rotate-180" : ""}`}
            />
          </Link>

          <Link
            to="/dashboard"
            className="group mt-0.5 flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-orange-50"
          >
            <span
              className={`inline-flex items-center gap-2 ${
                isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
              }`}
            >
              <LayoutGrid size={16} className="text-orange-500" />
              {t("navbar.dashboard", { defaultValue: "Dashboard" })}
            </span>
            <ChevronRight
              size={16}
              className={`text-gray-400 group-hover:text-orange-500 ${isRTL ? "rotate-180" : ""}`}
            />
          </Link>

          <div className="h-px my-1 bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="group mt-0.5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-orange-50"
          >
            <span
              className={`inline-flex items-center gap-2 ${
                isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
              }`}
            >
              {dark ? (
                <Moon size={16} className="text-orange-500" />
              ) : (
                <Sun size={16} className="text-orange-500" />
              )}
              {t("navbar.mode", { defaultValue: "Mode" })}
            </span>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center justify-between w-full px-3 py-2 mt-1 text-sm text-left text-red-600 group rounded-xl hover:bg-red-50"
          >
            <span
              className={`inline-flex items-center gap-2 ${
                isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
              }`}
            >
              <LogOut size={16} />
              {t("auth.signout", { defaultValue: "Sign Out" })}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
