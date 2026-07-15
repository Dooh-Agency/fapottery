# AGENTS.md — Backoffice / CMS

Panel de administración bajo la ruta `/backoffice`. Complementa al
[`AGENTS.md` raíz](../../../AGENTS.md).

> 📚 Detalle completo → [docs/backoffice.md](../../../docs/backoffice.md)

## Contexto rápido

- Auth de Supabase (`src/hooks/useAuth`); login en `/backoffice/login`.
- Usa `BackofficeLayout` con su sidebar; **no** monta el shell público (Header/Footer).
- Managers en esta carpeta; componentes en `src/components/backoffice/`.
- Formularios: `react-hook-form` + `zod` dentro de diálogos (`*FormDialog.tsx`).
- Imágenes: `ImageUploader` → Supabase Storage.

## Reglas

- Todo dato va/viene de Supabase; tipá con `src/integrations/supabase/types.ts`.
- Los cambios acá impactan el contenido público: probá el flujo end-to-end.
- Respetá RLS; el frontend usa la `anon key`, nunca la service-role key.
