import { useTranslation } from "react-i18next";

export default function Loader() {
  const { t } = useTranslation();
  return <div className="p-6">{t("common.loading")}</div>;
}
