import { useSiteImage } from "@/hooks/useSiteImages";

interface Props {
  sectionKey: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  flush?: boolean;
  title?: string;
}

const DynamicHeroBanner = ({ sectionKey, fallbackSrc, fallbackAlt = "", flush = false, title }: Props) => {
  const { data: siteImage, isLoading } = useSiteImage(sectionKey);

  const src = siteImage?.image_url || fallbackSrc;
  const alt = siteImage?.alt_text || fallbackAlt;

  if (!src && isLoading) {
    return (
      <section className={`w-full ${flush ? "" : "pt-6 md:pt-10 pb-6 md:pb-10"}`} aria-label="Imagen de cabecera">
        <div className={flush ? "" : "container mx-auto px-6"}>
          <div className="relative w-full bg-muted animate-pulse aspect-[3.6/1] md:aspect-[5/1]" />
        </div>
      </section>
    );
  }

  if (!src) return null;

  return (
    <section className={`w-full ${flush ? "" : "pt-6 md:pt-10 pb-6 md:pb-10"}`} aria-label="Imagen de cabecera">
      <div className={flush ? "" : "container mx-auto px-6"}>
        <div className="relative w-full overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="block w-full object-cover aspect-[3.6/1] md:aspect-[5/1]"
            loading="eager"
          />
          {title && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/30 to-black/15">
              <h1 className="font-sans text-white text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.25em] font-light drop-shadow-md">
                – {title} –
              </h1>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicHeroBanner;
