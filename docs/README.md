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
| [negocio/contexto-negocio-fa-pottery.md](negocio/contexto-negocio-fa-pottery.md) | Identidad, líneas de negocio, clientes, restricciones, evidencia y métricas de FA Pottery |
| [negocio/esencia-comunicacion-redes.md](negocio/esencia-comunicacion-redes.md) | Voz, referencias y formatos para comunicación orgánica en redes |
| [negocio/rrss/primer-bloque-de-contenidos.md](negocio/rrss/primer-bloque-de-contenidos.md) | Boceto de grilla y base de producción para las primeras nueve publicaciones de Instagram |
| [negocio/rrss/calendario-editorial-agosto-septiembre-2026.md](negocio/rrss/calendario-editorial-agosto-septiembre-2026.md) | Calendario de cuatro semanas para producir y publicar el primer bloque editorial de Instagram |
| [negocio/rrss/copys-calendario-agosto-septiembre-2026.md](negocio/rrss/copys-calendario-agosto-septiembre-2026.md) | Copys listos para publicar del calendario editorial de Instagram |
| [negocio/rrss/estrategia-compartida-fa-pottery-kanso.md](negocio/rrss/estrategia-compartida-fa-pottery-kanso.md) | Arquitectura, embudos y sistema de reutilización de contenidos entre FA Pottery y Kanso |
| [negocio/rrss/prompts-canva-calendario-agosto-septiembre-2026.md](negocio/rrss/prompts-canva-calendario-agosto-septiembre-2026.md) | Prompts para crear imágenes base y portadas en Canva para el calendario editorial |
| [negocio/rrss/guia-estilo-visual.md](negocio/rrss/guia-estilo-visual.md) | Principios, paleta, fotografía y reglas de diseño visual para todo el contenido de redes |
| [negocio/rrss/README.md](negocio/rrss/README.md) | Panel de trabajo: acceso a grilla, calendario, copys, prompts y estrategia de RRSS |
| [negocio/campana-meta-breakfast-and-paint-mija.md](negocio/campana-meta-breakfast-and-paint-mija.md) | Registro de continuidad de la campaña Meta de Breakfast & Paint (La Cala de Mijas) |

## Cómo mantener esta documentación

- **Separá técnica de negocio.** Lo que un desarrollador necesita para tocar el código
  va en `tecnica/`; lo funcional, de marketing u operativo va en `negocio/`.
- **Un tema por archivo.** Si un documento supera lo razonable, dividilo.
- **Comandos exactos antes que prosa.** Un agente copia y pega; escribí el comando real.
- **Actualizá acá, no en los `AGENTS.md`.** Los `AGENTS.md` son punteros.
- **Escribí en español** (el equipo y el producto son en español; el sitio es bilingüe es/en).
