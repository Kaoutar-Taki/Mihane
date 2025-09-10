import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MainLayout from "../pages/layouts/MainLayout";
import { Shield, Clock, Users, ArrowRight, Mail, Phone } from "lucide-react";

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {t("about.title", "من نحن")}
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
            {t(
              "about.description",
              "منصة ميهان هي الوجهة الأولى للحرفيين والمهنيين في المغرب. نربط بين أصحاب المهن والحرف التقليدية مع العملاء الباحثين عن خدمات عالية الجودة.",
            )}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
            >
              {t("about.cta.browse", "تصفح الحرفيين")}
              <ArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
            <Link
              to="/register"
              className="rounded-lg border-2 border-orange-600 px-8 py-3 font-semibold text-orange-600 transition-colors hover:bg-orange-600 hover:text-white"
            >
              {t("about.cta.join", "انضم كحرفي")}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t("about.features.title", "لماذا تختار ميهان؟")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-orange-100 p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("about.features.trust.title", "موثوقية عالية")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "about.features.trust.desc",
                  "جميع الحرفيين معتمدون ومراجعون من قبل فريقنا لضمان أعلى مستوى من الجودة والمهنية.",
                )}
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("about.features.speed.title", "سرعة في الخدمة")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "about.features.speed.desc",
                  "نوفر لك إمكانية العثور على الحرفي المناسب والتواصل معه في أسرع وقت ممكن.",
                )}
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("about.features.community.title", "مجتمع متنوع")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "about.features.community.desc",
                  "شبكة واسعة من الحرفيين في مختلف المجالات والمدن المغربية.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t("about.stats.title", "أرقامنا")}
          </h2>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-4xl font-bold text-orange-600">
                500+
              </div>
              <div className="text-gray-600">
                {t("about.stats.artisans", "حرفي")}
              </div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-orange-600">30+</div>
              <div className="text-gray-600">
                {t("about.stats.cities", "مدينة")}
              </div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-orange-600">
                1000+
              </div>
              <div className="text-gray-600">
                {t("about.stats.reviews", "تقييم")}
              </div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-orange-600">98%</div>
              <div className="text-gray-600">
                {t("about.stats.satisfaction", "رضا العملاء")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {t("about.mission.title", "مهمتنا")}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              {t(
                "about.mission.description",
                "نسعى إلى الحفاظ على التراث المغربي العريق في الحرف والصناعات التقليدية، وفي نفس الوقت نوفر للحرفيين منصة حديثة للوصول إلى عملاء جدد وتنمية أعمالهم. هدفنا هو بناء جسر بين الأصالة والحداثة.",
              )}
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-orange-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t("about.mission.artisans.title", "للحرفيين")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "about.mission.artisans.desc",
                    "نوفر لك منصة مجانية لعرض أعمالك والوصول إلى عملاء جدد في جميع أنحاء المغرب.",
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t("about.mission.clients.title", "للعملاء")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "about.mission.clients.desc",
                    "نساعدك في العثور على أفضل الحرفيين المحترفين بسهولة وثقة تامة.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              {t("about.contact.title", "تواصل معنا")}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center">
                  <Mail className="mr-3 h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("about.contact.email.title", "البريد الإلكتروني")}
                  </h3>
                </div>
                <p className="mb-4 text-gray-600">
                  {t("about.contact.email.desc", "للاستفسارات والدعم الفني")}
                </p>
                <a
                  href="mailto:contact@mihan.ma"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  contact@mihan.ma
                </a>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center">
                  <Phone className="mr-3 h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("about.contact.phone.title", "الهاتف")}
                  </h3>
                </div>
                <p className="mb-4 text-gray-600">
                  {t(
                    "about.contact.phone.desc",
                    "للدعم المباشر والاستفسارات العاجلة",
                  )}
                </p>
                <a
                  href="tel:+212600000000"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  +212 6 00 00 00 00
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-orange-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">
            {t("about.final_cta.title", "ابدأ رحلتك معنا اليوم")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-orange-100">
            {t(
              "about.final_cta.desc",
              "انضم إلى مجتمع ميهان واكتشف عالم الحرف المغربية الأصيلة",
            )}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-orange-600 transition-colors hover:bg-gray-100"
            >
              {t("about.final_cta.register", "سجل كحرفي")}
            </Link>
            <Link
              to="/profiles"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-orange-600"
            >
              {t("about.final_cta.browse", "تصفح الحرفيين")}
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
