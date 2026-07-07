import { useTranslation } from "react-i18next";
import { useSiteImage } from "@/hooks/useSiteImages";

interface Props {
  sectionKey: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  flush?: boolean;
  title?: string;
  aspectClassName?: string;
  titleClassName?: string;
  overlayClassName?: string;
}

const DynamicHeroBanner = ({
  sectionKey,
  fallbackSrc,
  fallbackAlt = "",
  flush = false,
  title,
  aspectClassName = "aspect-[3.6/1] md:aspect-[5/1]",
  titleClassName = "font-sans text-white text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.25em] font-light drop-shadow-md",
  overlayClassName = "bg-gradient-to-t from-black/50 via-black/30 to-black/15",
}: Props) => {
  const { data: siteImage, isLoading } = useSiteImage(sectionKey);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section className={`w-full ${flush ? "" : "pt-6 md:pt-10 pb-6 md:pb-10"}`} aria-label={t("heroBanner.aria")}>
        <div className={flush ? "" : "container mx-auto px-6"}>
          <div className={`relative w-full bg-muted animate-pulse ${aspectClassName}`} />
        </div>
      </section>
    );
  }

  const src = siteImage?.image_url || fallbackSrc;
  const bgColor = siteImage?.bg_color || undefined;
  const titleColor = siteImage?.title_color || undefined;
  const alt = siteImage?.alt_text || fallbackAlt;

  if (!src && !bgColor) return null;

  return (
    <section className={`w-full ${flush ? "" : "pt-6 md:pt-10 pb-6 md:pb-10"}`} aria-label={t("heroBanner.aria")}>
      <div className={flush ? "" : "container mx-auto px-6"}>
        <div className="relative w-full overflow-hidden">
          {src ? (
            <img
              src={src}
              alt={alt}
              className={`block w-full object-cover ${aspectClassName}`}
              loading="eager"
            />
          ) : (
            <div className={`w-full ${aspectClassName}`} style={{ backgroundColor: bgColor }} role="img" aria-label={alt} />
          )}
          {title && (
            src ? (
              <div className={`absolute inset-0 flex items-center justify-center ${overlayClassName}`}>
                <h1 className={titleClassName} style={titleColor ? { color: titleColor } : undefined}>
                  – {title} –
                </h1>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className={titleClassName} style={titleColor ? { color: titleColor } : undefined}>
                  – {title} –
                </h1>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicHeroBanner;
