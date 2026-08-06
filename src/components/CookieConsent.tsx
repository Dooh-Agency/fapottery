import { useEffect, useState } from "react";
import { initGTM } from "@/lib/analytics";

export type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "fa-pottery-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "fa-pottery:open-cookie-settings";

const readConsent = (): CookieConsent | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as CookieConsent : null;
  } catch {
    return null;
  }
};

export const openCookieSettings = () => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));

const CookieConsentBanner = () => {
  const [hasDecision, setHasDecision] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [draft, setDraft] = useState<CookieConsent>({ analytics: false, marketing: false });
  const isEnglish = document.documentElement.lang === "en";

  useEffect(() => {
    const saved = readConsent();
    setHasDecision(Boolean(saved));
    if (saved?.analytics) initGTM();

    const openSettings = () => {
      const current = readConsent() ?? { analytics: false, marketing: false };
      setDraft(current);
      setIsConfiguring(true);
      setHasDecision(false);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const save = (next: CookieConsent) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setHasDecision(true);
    setIsConfiguring(false);
    if (next.analytics) initGTM();
  };

  if (hasDecision && !isConfiguring) return null;

  const copy = isEnglish
    ? {
        title: "Your privacy matters",
        text: "We use essential cookies to make the site work. Analytics and marketing cookies are optional and only load with your permission.",
        accept: "Accept", reject: "Reject", configure: "Configure", save: "Save choices",
        necessary: "Necessary (always active)", analytics: "Analytics", marketing: "Marketing",
        necessaryText: "They enable basic website functions.", analyticsText: "They help us understand how the website is used.", marketingText: "They enable campaign measurement and relevant advertising.",
        policy: "Cookie policy",
      }
    : {
        title: "Tu privacidad importa",
        text: "Usamos cookies necesarias para que el sitio funcione. Las de analítica y marketing son opcionales y solo se cargan con tu permiso.",
        accept: "Aceptar", reject: "Rechazar", configure: "Configurar", save: "Guardar selección",
        necessary: "Necesarias (siempre activas)", analytics: "Analítica", marketing: "Marketing",
        necessaryText: "Permiten las funciones básicas del sitio.", analyticsText: "Nos ayudan a entender cómo se usa la web.", marketingText: "Permiten medir campañas y publicidad relevante.",
        policy: "Política de cookies",
      };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6" role="region" aria-label={copy.title}>
      <div className="mx-auto max-w-2xl border border-border bg-background p-5 shadow-2xl">
        <h2 className="font-serif text-2xl">{copy.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.text} <a className="underline" href={isEnglish ? "/en/cookies" : "/cookies"}>{copy.policy}</a>.</p>
        {isConfiguring && (
          <div className="mt-5 space-y-3 border-y border-border py-4 text-sm">
            <div><p className="font-medium">{copy.necessary}</p><p className="text-muted-foreground">{copy.necessaryText}</p></div>
            <label className="flex cursor-pointer items-start justify-between gap-4"><span><span className="font-medium">{copy.analytics}</span><span className="block text-muted-foreground">{copy.analyticsText}</span></span><input type="checkbox" checked={draft.analytics} onChange={(event) => setDraft({ ...draft, analytics: event.target.checked })} /></label>
            <label className="flex cursor-pointer items-start justify-between gap-4"><span><span className="font-medium">{copy.marketing}</span><span className="block text-muted-foreground">{copy.marketingText}</span></span><input type="checkbox" checked={draft.marketing} onChange={(event) => setDraft({ ...draft, marketing: event.target.checked })} /></label>
          </div>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {isConfiguring ? <button className="border border-foreground px-4 py-2 text-sm" onClick={() => save(draft)}>{copy.save}</button> : <>
            <button className="border border-foreground px-4 py-2 text-sm" onClick={() => save({ analytics: false, marketing: false })}>{copy.reject}</button>
            <button className="border border-foreground px-4 py-2 text-sm" onClick={() => { setDraft(readConsent() ?? { analytics: false, marketing: false }); setIsConfiguring(true); }}>{copy.configure}</button>
            <button className="bg-foreground px-4 py-2 text-sm text-background" onClick={() => save({ analytics: true, marketing: true })}>{copy.accept}</button>
          </>}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
