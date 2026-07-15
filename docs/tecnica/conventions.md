# Convenciones

## Estilo de código

- **TypeScript** en todo el frontend. Evitá `any`; tipá props y respuestas de Supabase
  (usá `src/integrations/supabase/types.ts`).
- Seguí el estilo del código que rodea a tu cambio: naming, densidad de comentarios,
  idioma de los comentarios.
- Los **comentarios se escriben en español** (así está el resto del repo) y explican
  el _por qué_, no el _qué_.
- Componentes de UI: preferí los primitivos de `src/components/ui/` (shadcn/ui) antes
  que reimplementar. No edites los primitivos a mano salvo que sea necesario.
- Estilos con **Tailwind**. Respetá los tokens definidos en `tailwind.config.ts`
  (colores, tipografía) en lugar de valores mágicos.
- Corré `npm run lint` antes de commitear.

## Internacionalización (i18n)

- Todo texto visible al usuario va en `src/i18n/locales/{es,en}.json`, nunca hardcodeado.
- Agregá la clave en **ambos** locales (`es` y `en`).
- Para navegar preservando idioma usá `LocalizedLink` / `localizePath`, no `<a>` ni
  rutas con `/en` hardcodeado.

## Commits y PRs

- Mensajes de commit **imperativos y descriptivos**, en el idioma del historial
  (mirá `git log`; el repo usa mensajes claros y concisos).
- Un commit = un cambio coherente.
- No commitees secretos, `.env`, ni artefactos de build (`dist/`).
- Commiteá o pusheá **solo cuando el usuario lo pida**. Si estás en `main`, creá una
  rama primero.

## Rutas y SEO

- Al renombrar/mover rutas públicas, dejá redirects (ver ejemplo `/clases` → `/actividades`
  en `src/App.tsx`) para no romper links guardados ni posicionamiento.
- El componente `SEO` maneja metadatos por página; actualizalo si agregás páginas.
