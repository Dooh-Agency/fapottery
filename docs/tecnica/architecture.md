# Arquitectura

Sitio de **FA Pottery Studio**: producción, clases y catálogo de cerámica, con un
backoffice de gestión de contenidos. Single-page app que consume Supabase.

## Stack

| Capa | Tecnología |
|------|-----------|
| Build / dev server | [Vite](https://vitejs.dev) |
| Lenguaje | TypeScript |
| UI | React 18 + [shadcn/ui](https://ui.shadcn.com) (Radix) + Tailwind CSS |
| Ruteo | `react-router-dom` |
| Estado servidor | TanStack Query (`@tanstack/react-query`) |
| Formularios | `react-hook-form` + `zod` |
| i18n | `react-i18next` (es/en) |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Pagos | Stripe (vía edge functions) |
| Deploy | Netlify → `fapottery.com` |

## Estructura de carpetas

```
src/
  pages/            Páginas públicas (Index, Catalogo, Clases, Novedades, …)
    backoffice/     Páginas del panel de administración
  components/       Componentes compartidos
    ui/             Primitivos de shadcn/ui (no editar a mano salvo necesidad)
    home/           Secciones de la home
    backoffice/     Componentes del panel (layout, sidebar, diálogos, listas)
  hooks/            Hooks (ej. useAuth)
  i18n/             Config de i18next + locales/{es,en}.json
  integrations/
    supabase/       client.ts (cliente) y types.ts (tipos generados)
  lib/              Utilidades (analytics, helpers)
  test/             Setup de tests
supabase/
  functions/        Edge functions (Deno)
  migrations/       Migraciones SQL
  config.toml       Config del proyecto Supabase
public/             Assets estáticos
docs/               Documentación del equipo (este directorio)
```

## Ruteo e i18n

- El idioma se determina por el **prefijo de la URL**: las rutas bajo `/en/*` son
  inglés; el resto es español (idioma por defecto). Ver `src/i18n/index.ts` y
  `getLanguageFromPathname`.
- Usá el helper `localizePath` / el componente `LocalizedLink` para construir
  links que preserven el idioma activo. **No** hardcodees prefijos `/en`.
- Rutas legacy `/clases` → redirigen a `/actividades` sin perder idioma. Al mover
  o renombrar rutas públicas, mantené redirects para no romper links ni SEO.
- El backoffice vive bajo `/backoffice` y **no** usa el shell público (Header/Footer).
  Ver [backoffice.md](backoffice.md).

## Datos

Todo el contenido dinámico (piezas, clases, novedades, imágenes del sitio) vive en
Supabase y se administra desde el backoffice. Ver [backend.md](backend.md).
