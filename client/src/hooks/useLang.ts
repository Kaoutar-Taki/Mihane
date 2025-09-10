import { useTranslation } from "react-i18next";
import type { Lang } from "../data/types";

export const useLang = (): { lang: Lang; dir: "rtl" | "ltr" } => {
  const { i18n } = useTranslation();
  const lng = (i18n.language as Lang) ?? "ar";
  return { lang: lng, dir: i18n.dir() as "rtl" | "ltr" };
};
