import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { getLanguageFromPathname } from "@/i18n";

const COPY = {
  es: {
    title: "Política de privacidad",
    intro: "Esta información explica cómo FA Pottery Studio trata los datos recogidos en la preinscripción de sus actividades.",
    sections: [
      ["Responsable y contacto", "FA Pottery Studio. Para consultas, acceso, corrección, eliminación o para retirar tu consentimiento, escribinos a hola@fapottery.com."],
      ["Datos y finalidad", "Recogemos el nombre si lo facilitás, tu email y datos técnicos de origen de la campaña (por ejemplo, UTM o página de entrada). Los usamos para enviarte información y gestionar tu interés en el evento al que te anotaste."],
      ["Novedades", "Sólo recibirás novedades de FA Pottery si marcaste expresamente la casilla correspondiente. Puedes retirar ese consentimiento en cualquier momento escribiendo a hola@fapottery.com."],
      ["Conservación y acceso", "Guardamos los datos del evento durante el tiempo necesario para gestionarlo y el seguimiento comercial razonable posterior. El acceso está limitado al equipo autorizado de FA Pottery Studio; no vendemos tus datos."],
    ],
  },
  en: {
    title: "Privacy policy",
    intro: "This information explains how FA Pottery Studio handles data collected through activity pre-registration.",
    sections: [
      ["Controller and contact", "FA Pottery Studio. For questions, access, correction, deletion or to withdraw consent, email hola@fapottery.com."],
      ["Data and purpose", "We collect your name if provided, your email and technical campaign-source data (such as UTMs or entry page). We use them to send information and manage your interest in the event you registered for."],
      ["News", "You will only receive FA Pottery news if you expressly ticked the relevant box. You can withdraw that consent at any time by writing to hola@fapottery.com."],
      ["Retention and access", "We keep event data for as long as needed to manage it and for reasonable follow-up afterwards. Access is limited to authorized FA Pottery Studio staff; we do not sell your data."],
    ],
  },
} as const;

const Privacy = () => {
  const location = useLocation();
  const lang = getLanguageFromPathname(location.pathname);
  const c = COPY[lang];

  return (
    <Layout>
      <SEO title={c.title} description={c.intro} path="/privacidad" />
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl px-6">
          <h1 className="font-serif text-4xl md:text-5xl">{c.title}</h1>
          <p className="body-text mt-6">{c.intro}</p>
          <div className="mt-10 space-y-8">
            {c.sections.map(([heading, body]) => (
              <section key={heading}>
                <h2 className="font-serif text-2xl">{heading}</h2>
                <p className="body-text mt-2">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
