import { useTranslation } from "react-i18next";

type Props = { className?: string };

export default function Logo({ className = "w-auto h-7" }: Props) {
  const { t } = useTranslation();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/favicon.svg" alt={t("logo.alt")} className="w-6 h-6" />
      <span className="font-extrabold tracking-tight">
        <span className="text-gray-900 dark:text-slate-100">{t("logo.firstName")}<span className="text-primary">{t("logo.secondName")}</span></span>
      </span>
    </div>
  );
}
