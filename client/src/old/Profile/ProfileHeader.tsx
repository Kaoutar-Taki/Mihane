import { useProfile } from "../ProfileContext";
import { MapPin, Phone, Mail, MessageCircle, Star } from "lucide-react";
import professions from "../../data/artisan-professions.json";
import cities from "../../data/moroccan-cities.json";
import regions from "../../data/moroccan-regions.json";
import { useTranslation } from "react-i18next";
import SectionCard from "../../components/ui/SectionCard";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";

export default function ProfileHeader() {
  const { i18n } = useTranslation();
  const lang = (i18n.language as "ar" | "fr") ?? "ar";
  const profile = useProfile();
  const { user } = useAuth();

  const profession = professions.find((p) => p.id === profile.profession);
  const city = cities.find((c) => c.id === profile.city);
  const region = city
    ? regions.find((r) => r.id === city.region_id)
    : undefined;

  const cityLabel = city ? city[lang] : "—";
  const regionLabel = region ? region[lang] : "";

  const avg =
    profile.reviews.length > 0
      ? profile.reviews.reduce((s, r) => s + r.rating, 0) /
        profile.reviews.length
      : 0;

  const wa = profile.contact.whatsapp?.replace(/[^\d+]/g, "");
  const tel = profile.contact.phone?.replace(/[^\d+]/g, "");

  return (
    <SectionCard className="relative overflow-hidden rounded-t-xl">
      {/* زخرفة هادئة موحّدة */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-100/60 blur-2xl" />

      <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
        <img
          src={profile.image}
          alt={profile.fullName.ar}
          className="h-28 w-28 flex-shrink-0 rounded-full border-2 border-white object-cover shadow ring-2 ring-orange-200"
        />

        <div className="grid w-full gap-2 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl leading-tight font-extrabold text-gray-900">
                {profile.fullName.ar}
              </h1>
              {profile.reviews.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm text-yellow-700 ring-1 ring-yellow-200">
                  <Star size={16} />
                  {avg.toFixed(1)} · {profile.reviews.length}
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              {profession?.title?.[lang] && (
                <span className="rounded-full bg-gray-50 px-3 py-1 font-medium text-gray-800 ring-1 ring-gray-200">
                  {profession.title[lang]}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-700 ring-1 ring-gray-200">
                <MapPin size={16} />
                {cityLabel}
                {regionLabel ? ` — ${regionLabel}` : ""}
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-gray-700 md:max-w-2xl">
              {profile.description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-end">
            {tel && (
              <a
                href={`tel:${tel}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
              >
                <Phone size={16} />
                {profile.contact.phone}
              </a>
            )}
            {wa && (
              <a
                href={`https://wa.me/${wa.replace(/^\+/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            )}
            {profile.contact.email && (
              <a
                href={`mailto:${profile.contact.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
              >
                <Mail size={16} />
                Email
              </a>
            )}
          </div>
          {user?.role === "client" && (
            <Link
              to={`/chat/${profile.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700"
            >
              ابدأ محادثة
            </Link>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
