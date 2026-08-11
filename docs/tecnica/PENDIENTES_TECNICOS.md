# Pendientes técnicos — FA Pottery

> Mantenimiento interno separado de las mejoras comerciales, de contenido y de
> backoffice. No afecta al funcionamiento publicado hasta que se planifique y
> publique un lote técnico específico.

## Calidad de código

- [ ] Resolver los avisos y errores existentes de ESLint (37 errores y 12
  avisos al 11 de agosto de 2026), priorizando:
  - sustituir los tipos genéricos `any` por tipos concretos de TypeScript;
  - corregir dependencias de hooks de React cuando corresponda;
  - sustituir el `require()` restante de la configuración de Tailwind;
  - separar constantes o utilidades de archivos de componentes cuando el aviso
    de Fast Refresh lo recomiende.
- [ ] Dejar `npm run lint`, `npm run test` y `npm run build` en verde antes de
  considerar cerrado este bloque.

## Criterio de trabajo

- Hacerlo en un lote técnico independiente: sin cambios de contenido, precios,
  campañas ni base de datos funcional.
- Comprobar visualmente la web y el backoffice después de cada grupo de cambios.
