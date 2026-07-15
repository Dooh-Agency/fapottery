# Backend — Supabase

El backend es **Supabase**: Postgres + Auth + Storage + Edge Functions. El proyecto
está identificado en `supabase/config.toml` (`project_id`).

## Estructura

```
supabase/
  config.toml       Config del proyecto (project_id, etc.)
  migrations/       Migraciones SQL versionadas
  functions/        Edge functions (Deno / TypeScript)
    create-class-checkout/    Checkout de Stripe para reservar clases
    create-piece-checkout/    Checkout de Stripe para comprar piezas del catálogo
    translate-content/        Traducción de contenido (es ↔ en)
```

## Cliente

- El frontend usa `src/integrations/supabase/client.ts`.
- Los tipos de las tablas están en `src/integrations/supabase/types.ts` (generados).
  Regeneralos cuando cambie el esquema en lugar de tipar a mano.

## Migraciones

- Toda modificación de esquema va como migración SQL en `supabase/migrations/`.
- No edites tablas a mano en producción sin dejar la migración correspondiente.
- Los scripts sueltos en la raíz (`migrate_data.sql`, `migrate_news.sql`,
  `migrate_site_images.sql`) son cargas puntuales de datos históricos, no el flujo normal.

## Edge Functions

- Corren en **Deno**, no Node. No asumas APIs de Node.
- Las claves secretas (Stripe secret key, service role) viven **solo** en las
  variables de entorno de las functions, nunca en el frontend.
- Los checkouts (`create-class-checkout`, `create-piece-checkout`) crean sesiones de
  Stripe; validá montos y datos del lado del servidor, no confíes en el cliente.

## Seguridad

- Respetá las Row Level Security (RLS) policies. El frontend usa la `anon key`; el
  acceso privilegiado pasa por edge functions con la `service role key`.
- Nunca expongas la service role key ni claves de Stripe en el bundle del cliente.
