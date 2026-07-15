# Documentación del equipo — FA Pottery Studio

Esta carpeta (`/docs`) es la **fuente única de verdad** para toda la documentación
del equipo: humanos y agentes de IA leen lo mismo.

> Los archivos `AGENTS.md` del repositorio son deliberadamente breves y **apuntan
> a esta carpeta**. Cuando necesites detalle, vení acá. Cuando cambie una
> convención, actualizá el documento correspondiente acá (no en cada `AGENTS.md`).

## Índice

| Documento | Contenido |
|-----------|-----------|
| [architecture.md](architecture.md) | Arquitectura, stack, estructura de carpetas, ruteo e i18n |
| [development.md](development.md) | Setup local, comandos, flujo de trabajo, testing |
| [conventions.md](conventions.md) | Estilo de código, i18n, convenciones de commits/PR |
| [backend.md](backend.md) | Supabase: base de datos, migraciones, edge functions, Stripe |
| [backoffice.md](backoffice.md) | Panel de administración / CMS (`/backoffice`) |
| [deployment.md](deployment.md) | Deploy en Netlify y dominio |
| [ai-agents.md](ai-agents.md) | Cómo funcionan los `AGENTS.md` y la configuración por herramienta |

## Cómo mantener esta documentación

- **Un tema por archivo.** Si un documento supera lo razonable, dividilo.
- **Comandos exactos antes que prosa.** Un agente copia y pega; escribí el comando real.
- **Actualizá acá, no en los `AGENTS.md`.** Los `AGENTS.md` son punteros.
- **Escribí en español** (el equipo y el producto son en español; el sitio es bilingüe es/en).
