// Google Tag Manager integration
// Set your Container ID below (format: GTM-XXXXXXX)
const GTM_ID = "GTM-N7HF8BTQ";

export const initGTM = () => {
  if (!GTM_ID || typeof window === "undefined") return;

  // GTM script
  const script = document.createElement("script");
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(script);

  // noscript fallback
  const noscript = document.createElement("noscript");
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.display = "none";
  iframe.style.visibility = "hidden";
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);
};

export const trackEvent = (event: string, data?: Record<string, unknown>) => {
  if (!GTM_ID || typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...data });
};
