# AGENTS.md — FA Pottery Studio

Sitio de FA Pottery Studio (producción, clases y catálogo de cerámica) con backoffice
de gestión de contenidos. SPA de **Vite + React + TypeScript + shadcn/ui + Tailwind**
sobre **Supabase**, desplegada en Netlify (`fapottery.com`).

> 📚 **La documentación completa del equipo vive en [`/docs`](docs/README.md).**
> Este archivo es un puntero: cuando necesites detalle, seguí los links.

## Empezá acá

- Arquitectura y estructura → [docs/tecnica/architecture.md](docs/tecnica/architecture.md)
- Setup y comandos → [docs/tecnica/development.md](docs/tecnica/development.md)
- Convenciones (código, i18n, commits) → [docs/tecnica/conventions.md](docs/tecnica/conventions.md)
- Backend Supabase (BD, migraciones, functions) → [docs/tecnica/backend.md](docs/tecnica/backend.md)
- Backoffice / CMS → [docs/tecnica/backoffice.md](docs/tecnica/backoffice.md)
- Deploy → [docs/tecnica/deployment.md](docs/tecnica/deployment.md)
- Agentes y especialistas → [docs/tecnica/ai-agents.md](docs/tecnica/ai-agents.md)

## Comandos esenciales

```sh
npm i             # instalar dependencias
npm run dev       # dev server (Vite)
npm run lint      # ESLint
npm run test      # tests (Vitest)
npm run build     # build de producción a dist/
```

## Reglas rápidas

- **Antes de terminar:** `npm run lint` y `npm run test`. Verificá el cambio en el navegador.
- **i18n:** todo texto visible va en `src/i18n/locales/{es,en}.json` (en ambos). Navegá
  con `LocalizedLink` / `localizePath`, nunca hardcodees `/en`.
- **UI:** reutilizá los primitivos de `src/components/ui/` (shadcn/ui). Estilos con Tailwind
  usando los tokens de `tailwind.config.ts`.
- **Datos:** todo pasa por Supabase; tipá con `src/integrations/supabase/types.ts`. No expongas
  secretos ni service-role/Stripe keys en el frontend.
- **Comentarios en español**, explicando el _por qué_.
- **Git:** commiteá/pusheá solo cuando el usuario lo pida; si estás en `main`, ramificá primero.

## Especialistas disponibles

- **Meta Ads:** ante tareas de pauta en Facebook/Instagram, estrategia de campañas,
  creatividades, audiencias, presupuesto, Pixel/CAPI, CPA o ROAS, leé y seguí
  [`.agents/skills/meta-ads-specialist/SKILL.md`](.agents/skills/meta-ads-specialist/SKILL.md).

## AGENTS.md anidados

Gana el `AGENTS.md` más cercano al archivo editado. Además de este hay:
`src/pages/backoffice/AGENTS.md` y `supabase/AGENTS.md`. Cómo está configurado todo
esto (Claude Code, Antigravity, Cursor, Codex…) → [docs/tecnica/ai-agents.md](docs/tecnica/ai-agents.md).
