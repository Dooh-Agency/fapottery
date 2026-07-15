# AGENTS.md — Supabase (backend)

Base de datos, migraciones y edge functions. Complementa al
[`AGENTS.md` raíz](../AGENTS.md).

> 📚 Detalle completo → [docs/backend.md](../docs/backend.md)

## Contexto rápido

- `migrations/` — cambios de esquema versionados en SQL.
- `functions/` — edge functions en **Deno** (no Node):
  `create-class-checkout`, `create-piece-checkout` (Stripe) y `translate-content`.
- `config.toml` — config del proyecto (`project_id`).

## Reglas

- Todo cambio de esquema va como **migración** en `migrations/`. No edites prod a mano.
- Secretos (Stripe secret, service-role key) viven **solo** en env vars de las functions,
  nunca en el frontend.
- En los checkouts, validá montos y datos del lado del servidor; no confíes en el cliente.
- Respetá las policies RLS.
- Las functions corren en Deno: no asumas APIs de Node.
