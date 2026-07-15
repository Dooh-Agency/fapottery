# Backoffice / CMS

Panel de administración de contenidos, servido bajo la ruta **`/backoffice`**.

## Acceso y layout

- Login en `/backoffice/login` (auth de Supabase, ver `src/hooks/useAuth`).
- El resto del panel está protegido y usa `BackofficeLayout`
  (`src/components/backoffice/BackofficeLayout.tsx`) con su propio sidebar.
- El backoffice **no** monta el shell público (Header/Footer/WhatsApp). La detección
  es por `location.pathname.startsWith("/backoffice")` en `src/App.tsx`.

## Secciones

| Ruta | Manager | Administra |
|------|---------|-----------|
| `/backoffice` | `Dashboard` | Resumen |
| `/backoffice/catalogo` | `CatalogManager` | Piezas del catálogo/tienda |
| `/backoffice/clases` | `ClassManager` | Tipos de clase, horarios, reservas |
| `/backoffice/novedades` | `NewsManager` | Novedades / blog |
| `/backoffice/imagenes` | `SiteImagesManager` | Imágenes del sitio |
| `/backoffice/servicios-home` | `HomeServicesManager` | Bloques de servicios de la home |
| `/backoffice/usuarios` | `Placeholder` | (Próximamente) usuarios y roles |

Páginas en `src/pages/backoffice/`, componentes en `src/components/backoffice/`.

## Convenciones

- Formularios con `react-hook-form` + `zod`, en diálogos (`*FormDialog.tsx`).
- Subida de imágenes vía `ImageUploader` → Supabase Storage.
- Todos los datos van y vienen de Supabase; usá los tipos de
  `src/integrations/supabase/types.ts`.
- Los cambios en el backoffice impactan directo en el contenido público: probá el
  flujo end-to-end antes de dar por terminado.
