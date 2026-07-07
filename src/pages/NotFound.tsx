import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-serif">404</h1>
        <p className="mb-4 text-xl text-muted-foreground font-sans">{t("notFound.title")}</p>
        <Link to="/" className="text-foreground underline hover:text-foreground/80 font-sans">
          {t("notFound.volver")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
