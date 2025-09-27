import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LogOut, User, LayoutGrid, Moon, Sun } from "lucide-react";
import type { StoredAuth } from "../services/auth";
import { resolveAssetUrl } from "../services/profile";

type Props = {
  auth: StoredAuth;
  onSignOut: () => void;
};

export default function UserMenu({ auth, onSignOut }: Props) {
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

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="relative h-12 w-12 rounded-full ring-2 ring-white/70 shadow hover:shadow-md transition overflow-visible"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="h-full w-full overflow-hidden rounded-full">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />)
          : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-200 to-amber-200 text-sm font-bold text-orange-800">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
      </button>

      {/* hover on desktop */}
      <div
        ref={popRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`absolute right-0 mt-3 w-72 origin-top-right rounded-2xl border border-orange-100/60 bg-white/95 backdrop-blur shadow-xl transition-all ${open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
        role="menu"
      >
        <div className="p-4 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-xl ring-1 ring-orange-100">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-200 to-amber-200 text-base font-bold text-orange-800">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold text-gray-900">{name}</p>
              {role && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">{role}</span>
              )}
            </div>
            <p className="truncate text-xs text-gray-600">{email}</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

        <nav className="p-1">
          <Link to="/account/profile" className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-orange-50">
            <span className="inline-flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              My Profile
            </span>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500" />
          </Link>

          <Link to="/dashboard" className="group mt-0.5 flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-orange-50">
            <span className="inline-flex items-center gap-2">
              <LayoutGrid size={16} className="text-orange-500" />
              Dashboard
            </span>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500" />
          </Link>

          <div className="my-1 h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

          <button type="button" onClick={() => setDark((d) => !d)} className="group mt-0.5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50">
            <span className="inline-flex items-center gap-2">
              {dark ? <Moon size={16} className="text-orange-500" /> : <Sun size={16} className="text-orange-500" />}
              Mode
            </span>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="group mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
