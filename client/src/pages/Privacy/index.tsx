import { useTranslation } from "react-i18next";
import {
  Shield,
  Eye,
  Database,
  Cog,
  Lock,
  UserCheck,
  Mail,
} from "lucide-react";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-100 p-4">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            {t("privacy.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("privacy.lastUpdated")} :{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Eye className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("privacy.sections.introduction.title")}
              </h2>
            </div>
            <p className="leading-relaxed text-gray-600">
              {t("privacy.sections.introduction.content")}
            </p>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Database className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("privacy.sections.dataCollection.title")}
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              {t("privacy.sections.dataCollection.content")}
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>{t("privacy.sections.dataCollection.types.personal")}</li>
              <li>{t("privacy.sections.dataCollection.types.professional")}</li>
              <li>{t("privacy.sections.dataCollection.types.usage")}</li>
              <li>{t("privacy.sections.dataCollection.types.technical")}</li>
            </ul>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Cog className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("privacy.sections.dataUsage.title")}
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              {t("privacy.sections.dataUsage.content")}
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>{t("privacy.sections.dataUsage.purposes.service")}</li>
              <li>{t("privacy.sections.dataUsage.purposes.communication")}</li>
              <li>{t("privacy.sections.dataUsage.purposes.matching")}</li>
              <li>{t("privacy.sections.dataUsage.purposes.support")}</li>
              <li>{t("privacy.sections.dataUsage.purposes.analytics")}</li>
            </ul>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("privacy.sections.dataProtection.title")}
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              {t("privacy.sections.dataProtection.content")}
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>
                {t("privacy.sections.dataProtection.measures.encryption")}
              </li>
              <li>{t("privacy.sections.dataProtection.measures.access")}</li>
              <li>
                {t("privacy.sections.dataProtection.measures.monitoring")}
              </li>
              <li>{t("privacy.sections.dataProtection.measures.updates")}</li>
            </ul>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("privacy.sections.userRights.title")}
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              {t("privacy.sections.userRights.content")}
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>{t("privacy.sections.userRights.rights.access")}</li>
              <li>{t("privacy.sections.userRights.rights.rectification")}</li>
              <li>{t("privacy.sections.userRights.rights.deletion")}</li>
              <li>{t("privacy.sections.userRights.rights.portability")}</li>
              <li>{t("privacy.sections.userRights.rights.objection")}</li>
            </ul>
          </section>

          <section className="rounded-xl bg-orange-100 p-8">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("privacy.sections.contact.title")}
              </h2>
            </div>
            <p className="text-gray-600">
              {t("privacy.sections.contact.content")}{" "}
              <strong>{t("privacy.sections.contact.email")}</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
