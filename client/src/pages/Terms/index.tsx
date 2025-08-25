import { useTranslation } from "react-i18next";
import {
  FileText,
  Users,
  Gavel,
  AlertTriangle,
  CheckCircle,
  Mail,
} from "lucide-react";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-100 p-4">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            {t("terms.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("terms.lastUpdated")} : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.acceptance.title")}
              </h2>
            </div>
            <p className="leading-relaxed text-gray-600">
              {t("terms.sections.acceptance.content")}
            </p>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.serviceDescription.title")}
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              {t("terms.sections.serviceDescription.content")}
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  {t("terms.sections.serviceDescription.forClients.title")}
                </h3>
                <ul className="list-inside list-disc space-y-1 text-gray-600">
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forClients.features.search",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forClients.features.profiles",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forClients.features.contact",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forClients.features.reviews",
                    )}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  {t("terms.sections.serviceDescription.forArtisans.title")}
                </h3>
                <ul className="list-inside list-disc space-y-1 text-gray-600">
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forArtisans.features.profile",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forArtisans.features.showcase",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forArtisans.features.requests",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.serviceDescription.forArtisans.features.reputation",
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.userObligations.title")}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  {t("terms.sections.userObligations.general.title")}
                </h3>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>
                    {t(
                      "terms.sections.userObligations.general.obligations.accuracy",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.general.obligations.law",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.general.obligations.legal",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.general.obligations.respect",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.general.obligations.content",
                    )}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  {t("terms.sections.userObligations.artisans.title")}
                </h3>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>
                    {t(
                      "terms.sections.userObligations.artisans.obligations.qualifications",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.artisans.obligations.deadlines",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.artisans.obligations.professional",
                    )}
                  </li>
                  <li>
                    {t(
                      "terms.sections.userObligations.artisans.obligations.response",
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Gavel className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.liability.title")}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                {t("terms.sections.liability.content")}
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>{t("terms.sections.liability.limitations.quality")}</li>
                <li>{t("terms.sections.liability.limitations.disputes")}</li>
                <li>{t("terms.sections.liability.limitations.damages")}</li>
                <li>{t("terms.sections.liability.limitations.accuracy")}</li>
                <li>{t("terms.sections.liability.limitations.technical")}</li>
              </ul>
            </div>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.intellectualProperty.title")}
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              {t("terms.sections.intellectualProperty.content")}
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>
                {t("terms.sections.intellectualProperty.rules.reproduction")}
              </li>
              <li>
                {t("terms.sections.intellectualProperty.rules.userContent")}
              </li>
              <li>{t("terms.sections.intellectualProperty.rules.license")}</li>
            </ul>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.modifications.title")}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  {t("terms.sections.modifications.termsModification.title")}
                </h3>
                <p className="text-gray-600">
                  {t("terms.sections.modifications.termsModification.content")}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  {t("terms.sections.modifications.termination.title")}
                </h3>
                <p className="text-gray-600">
                  {t("terms.sections.modifications.termination.content")}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-orange-100 p-8">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("terms.sections.legalContact.title")}
              </h2>
            </div>
            <p className="text-gray-600">
              {t("terms.sections.legalContact.content")}{" "}
              <strong>{t("terms.sections.legalContact.email")}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              {t("terms.sections.legalContact.jurisdiction")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
