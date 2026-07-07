import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageFromPathname } from "@/i18n";

interface Props {
  className?: string;
}

const LanguageSwitcher = ({ className = "" }: Props) => {
  const location = useLocation();
  const { t } = useTranslation();
  const lang = getLanguageFromPathname(location.pathname);

  const restPath = lang === "en" ? location.pathname.slice(3) || "/" : location.pathname;
  const esPath = `${restPath}${location.search}`;
  const enPath = `/en${restPath === "/" ? "" : restPath}${location.search}`;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-sans font-medium tracking-[0.1em] ${className}`}>
      <Link
        to={esPath}
        aria-current={lang === "es" ? "true" : undefined}
        aria-label={t("languageSwitcher.switchToEs")}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          lang === "es" ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("languageSwitcher.es")}
      </Link>
      <span className="text-muted-foreground" aria-hidden="true">/</span>
      <Link
        to={enPath}
        aria-current={lang === "en" ? "true" : undefined}
        aria-label={t("languageSwitcher.switchToEn")}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          lang === "en" ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("languageSwitcher.en")}
      </Link>
    </div>
  );
};

export default LanguageSwitcher;
