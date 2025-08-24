import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  Star,
  Shield,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { BRAND } from "../config/brand";
import { useStats } from "../hooks/useStats";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const { stats, formatNumber, getVerificationPercentage } = useStats();

  return (
    <footer className="relative mt-12 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-gray-700">
      <div className="relative z-10 border-b border-orange-200/50 py-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {formatNumber(stats.craftsmen.total)}
              </div>
              <div className="text-sm text-gray-600">
                {t("footer.stats.craftsmen")}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-amber-100 p-3">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.ratings.average}/5
              </div>
              <div className="text-sm text-gray-600">
                {t("footer.stats.rating")}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {getVerificationPercentage()}%
              </div>
              <div className="text-sm text-gray-600">
                {t("footer.stats.verified")}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.support.availability}
              </div>
              <div className="text-sm text-gray-600">
                {t("footer.stats.support")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 container mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-2xl font-bold text-transparent">
              {BRAND.name}
            </h3>
            <Sparkles size={20} className="text-orange-500" />
          </div>
          <p className="mb-6 leading-relaxed text-gray-600">
            {t("footer.tagline")}
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 rounded-full bg-orange-100/60 px-3 py-1 text-xs font-medium text-orange-700">
              <Shield size={12} />
              <span>{t("footer.badges.trusted")}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-100/60 px-3 py-1 text-xs font-medium text-amber-700">
              <Award size={12} />
              <span>{t("footer.badges.professional")}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-bold text-gray-800">
            {t("footer.quickLinks.title")}
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-orange-600"
                to="/"
              >
                <div className="h-1 w-1 rounded-full bg-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                {t("footer.quickLinks.home")}
              </Link>
            </li>
            <li>
              <Link
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-orange-600"
                to="/professions"
              >
                <div className="h-1 w-1 rounded-full bg-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                {t("footer.quickLinks.professions")}
              </Link>
            </li>
            <li>
              <Link
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-orange-600"
                to="/about"
              >
                <div className="h-1 w-1 rounded-full bg-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                {t("footer.quickLinks.about")}
              </Link>
            </li>
            <li>
              <Link
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-orange-600"
                to="/register"
              >
                <div className="h-1 w-1 rounded-full bg-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                {t("footer.quickLinks.register")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-bold text-gray-800">
            {t("footer.contact.title")}
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="group flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
              <div className="mt-0.5 rounded-full bg-orange-100 p-2">
                <MapPin size={16} className="text-orange-600" />
              </div>
              <span className="leading-relaxed text-gray-600 group-hover:text-gray-800">
                {t("footer.contact.address")}
              </span>
            </li>
            <li className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
              <div className="rounded-full bg-orange-100 p-2">
                <Phone size={16} className="text-orange-600" />
              </div>
              <a
                className="text-gray-600 transition-colors duration-300 hover:text-orange-600"
                href="tel:+212600000000"
              >
                +212 6 00 00 00 00
              </a>
            </li>
            <li className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
              <div className="rounded-full bg-orange-100 p-2">
                <Mail size={16} className="text-orange-600" />
              </div>
              <a
                className="text-gray-600 transition-colors duration-300 hover:text-orange-600"
                href="mailto:contact@projectmihan.com"
              >
                contact@projectmihan.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-bold text-gray-800">
            {t("footer.newsletter.title")}
          </h4>
          <p className="mb-6 leading-relaxed text-gray-600">
            {t("footer.newsletter.subtitle")}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="mb-6 flex items-center gap-2"
            dir={i18n.dir() === "rtl" ? "ltr" : undefined}
          >
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.newsletter.placeholder") as string}
                className="h-12 w-full rounded-xl border-2 border-orange-200/50 bg-white/80 px-4 text-sm transition-all duration-300 outline-none placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-orange-200/50"
              />
            </div>
            <button
              type="submit"
              className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg"
              aria-label={t("footer.newsletter.button") as string}
            >
              <Send
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
              {t("footer.newsletter.button")}
            </button>
          </form>

          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-800">
              {t("footer.followUs")}
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 transition-all duration-300 hover:scale-110 hover:from-orange-200 hover:to-amber-200 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <Facebook size={20} className="relative" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 transition-all duration-300 hover:scale-110 hover:from-orange-200 hover:to-amber-200 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <Instagram size={20} className="relative" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative border-t border-orange-200/50 bg-gradient-to-r from-orange-100/30 to-amber-100/30 py-6">
        <div className="relative z-10 container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-gray-600 sm:flex-row">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} {BRAND.name} — {t("footer.rights")}.
            </span>
            <Star size={14} className="text-orange-500" />
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="font-medium transition-colors duration-300 hover:text-orange-600"
            >
              {t("footer.legal.privacy")}
            </Link>
            <div className="h-4 w-px bg-orange-300"></div>
            <Link
              to="/terms"
              className="font-medium transition-colors duration-300 hover:text-orange-600"
            >
              {t("footer.legal.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
