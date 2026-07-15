# Documentación del equipo — FA Pottery Studio

Esta carpeta (`/docs`) es la **fuente única de verdad** para toda la documentación
del equipo: humanos y agentes de IA leen lo mismo.

> Los archivos `AGENTS.md` del repositorio son deliberadamente breves y **apuntan
> a esta carpeta**. Cuando necesites detalle, vení acá. Cuando cambie una
> convención, actualizá el documento correspondiente acá (no en cada `AGENTS.md`).

La documentación está separada en dos áreas:

- **[`tecnica/`](tecnica/)** — para desarrolladores: arquitectura, código, backend, deploy.
- **[`negocio/`](negocio/)** — funcional y operativa: campañas, marketing, decisiones de negocio.

## Documentación técnica (desarrolladores)

| Documento | Contenido |
|-----------|-----------|
| [tecnica/architecture.md](tecnica/architecture.md) | Arquitectura, stack, estructura de carpetas, ruteo e i18n |
| [tecnica/development.md](tecnica/development.md) | Setup local, comandos, flujo de trabajo, testing |
| [tecnica/conventions.md](tecnica/conventions.md) | Estilo de código, i18n, convenciones de commits/PR |
| [tecnica/backend.md](tecnica/backend.md) | Supabase: base de datos, migraciones, edge functions, Stripe |
| [tecnica/backoffice.md](tecnica/backoffice.md) | Panel de administración / CMS (`/backoffice`) |
| [tecnica/deployment.md](tecnica/deployment.md) | Deploy en Netlify y dominio |
| [tecnica/ai-agents.md](tecnica/ai-agents.md) | Cómo funcionan los `AGENTS.md` y la configuración por herramienta |

## Documentación de negocio / funcional

| Documento | Contenido |
|-----------|-----------|
| [negocio/campana-meta-breakfast-and-paint-mija.md](negocio/campana-meta-breakfast-and-paint-mija.md) | Registro de continuidad de la campaña Meta de Breakfast & Paint (La Cala de Mijas) |

## Cómo mantener esta documentación

- **Separá técnica de negocio.** Lo que un desarrollador necesita para tocar el código
  va en `tecnica/`; lo funcional, de marketing u operativo va en `negocio/`.
- **Un tema por archivo.** Si un documento supera lo razonable, dividilo.
- **Comandos exactos antes que prosa.** Un agente copia y pega; escribí el comando real.
- **Actualizá acá, no en los `AGENTS.md`.** Los `AGENTS.md` son punteros.
- **Escribí en español** (el equipo y el producto son en español; el sitio es bilingüe es/en).
