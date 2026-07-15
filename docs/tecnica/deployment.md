# Deploy

## Netlify

El sitio se despliega en **Netlify**, conectado al repositorio de GitHub.

- Cada push a la rama **`main`** dispara un build y deploy automático a producción.
- Comando de build: `npm run build` (salida en `dist/`).
- Producción: **`fapottery.com`**.

## Dominio

El dominio propio (`fapottery.com`) se configura en Netlify:
**Site configuration → Domain management**.

## Checklist antes de mergear a `main`

1. `npm run lint` sin errores.
2. `npm run test` en verde.
3. Verificación manual del cambio en `npm run dev` (o `npm run preview` sobre el build).
4. Rutas nuevas/renombradas con sus redirects y metadatos SEO.

> Recordá: cualquier merge a `main` va directo a producción.
