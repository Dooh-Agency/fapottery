# Agentes de IA — cómo está configurado el repo

Este repo está preparado para trabajar con **cualquier IA agéntica** (Claude Code,
Google Antigravity, Cursor, OpenAI Codex, GitHub Copilot, Gemini CLI, etc.) sin
duplicar instrucciones.

## El modelo de tres capas

```
Config por herramienta   →   AGENTS.md   →   /docs
(CLAUDE.md, GEMINI.md,       (instrucción      (documentación
 .cursor, copilot…)          para agentes)      del equipo)
```

1. **`/docs`** — fuente única de verdad. Documentación detallada para humanos y agentes.
2. **`AGENTS.md`** — el [estándar abierto](https://agents.md/) que leen la mayoría de
   los agentes. Es breve y **apunta a `/docs`**. Hay uno en la raíz y otros anidados.
3. **Archivos de config propios de cada IDE/agente** — no contienen reglas; solo
   **redirigen a `AGENTS.md`** para no mantener el contenido en varios lugares.

Regla de oro: **la documentación vive en `/docs`; `AGENTS.md` apunta a `/docs`; las
skills viven en `/.agents/skills`; la config de cada herramienta solo redirige a
esas fuentes.** Nunca dupliques instrucciones sustantivas.

## Especialistas portables

Los roles reutilizables se implementan como **Agent Skills** en
`.agents/skills/<nombre>/SKILL.md`. Es el formato compartido por Codex, Cursor y
Antigravity y permite cargar instrucciones y referencias solo cuando hacen falta.

Especialistas actuales:

| Especialista | Fuente canónica | Uso |
|---|---|---|
| Meta Ads | `.agents/skills/meta-ads-specialist/SKILL.md` | Campañas, anuncios, audiencias, presupuesto, Pixel/CAPI, CPA y ROAS |

Para herramientas que ofrecen subagentes propios hay adaptadores breves. Estos no
repiten el conocimiento: ordenan leer la skill canónica y aplican un modo de solo
lectura para evitar cambios de campaña o gasto sin aprobación.

| Herramienta | Descubrimiento de la skill | Adaptador de subagente |
|---|---|---|
| OpenAI Codex | `.agents/skills/meta-ads-specialist/` | `.codex/agents/meta-ads-specialist.toml` |
| Cursor | `.agents/skills/meta-ads-specialist/` | `.cursor/agents/meta-ads-specialist.md` |
| Google Antigravity | `.agents/skills/meta-ads-specialist/` | No hace falta |
| Claude Code | Vía el adaptador | `.claude/agents/meta-ads-specialist.md` |
| Otras IAs que leen `AGENTS.md` | Puntero en `/AGENTS.md` | No hace falta |

Invocación sugerida: `Usá el especialista meta-ads-specialist para...`. Codex,
Cursor y Antigravity también permiten invocar la skill desde sus selectores; Claude
Code puede delegar al subagente por nombre.

## AGENTS.md anidados

Se sigue el estándar: **gana el `AGENTS.md` más cercano** al archivo que se está
editando (los de subcarpeta complementan al de la raíz). Los que hay:

| Archivo | Alcance |
|---------|---------|
| `/AGENTS.md` | Todo el repo: stack, comandos, convenciones globales |
| `/src/pages/backoffice/AGENTS.md` | Panel de administración |
| `/supabase/AGENTS.md` | Base de datos y edge functions |

Mantenelos **cortos** (punteros, no prosa). Si algo necesita explicación, va en `/docs`.

## Soporte por herramienta

| Herramienta | Lee `AGENTS.md` | Archivo puente en el repo |
|-------------|:---------------:|---------------------------|
| OpenAI Codex | ✅ nativo | — (no hace falta) |
| Cursor | ✅ nativo | `.cursor/rules/agents.mdc` (por compatibilidad) |
| Google Antigravity | ✅ nativo | `GEMINI.md` (opcional, redirige) |
| Gemini CLI | ⚠️ vía `GEMINI.md` | `GEMINI.md` → `AGENTS.md` |
| GitHub Copilot | ✅ nativo | `.github/copilot-instructions.md` (redirige) |
| Claude Code | ❌ lee `CLAUDE.md` | `CLAUDE.md` con `@AGENTS.md` (import) |

### Claude Code

Claude Code no lee `AGENTS.md`; lee `CLAUDE.md`. Por eso hay un `CLAUDE.md` en la raíz
(y junto a cada `AGENTS.md` anidado) cuyo contenido es un import:

```
@AGENTS.md
```

Eso importa el `AGENTS.md` hermano y mantiene una sola fuente. (El `@import` es la
opción recomendada por Anthropic y funciona también en Windows, donde los symlinks
requieren permisos de administrador.)

## Al agregar un nuevo `AGENTS.md` anidado

1. Creá el `AGENTS.md` en la subcarpeta (breve, apuntando a `/docs`).
2. Creá un `CLAUDE.md` hermano con una sola línea: `@AGENTS.md`.
3. Actualizá la tabla de arriba.

## Fuentes / referencia

- Estándar oficial: https://agents.md/
- Antigravity + AGENTS.md/GEMINI.md: https://antigravity.google/docs/rules-workflows
