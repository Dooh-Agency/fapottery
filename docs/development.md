# Desarrollo local

## Requisitos

- Node.js + npm ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

## Setup

```sh
git clone <YOUR_GIT_URL>
cd fapottery
npm i
npm run dev
```

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Levanta el dev server de Vite |
| `npm run build` | Build de producción a `dist/` |
| `npm run build:dev` | Build en modo development |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre ESLint sobre todo el repo |
| `npm run test` | Corre los tests con Vitest (una pasada) |
| `npm run test:watch` | Vitest en modo watch |

> **Antes de commitear:** corré `npm run lint` y `npm run test`. Si tocaste algo
> con comportamiento observable, verificalo en el navegador con `npm run dev`.

## Variables de entorno

Las variables sensibles viven en `.env` / `.env.local` (ignoradas por git). No las
commitees. Las claves públicas de Supabase (URL + anon key) se usan en el cliente
del frontend; las claves de servicio y de Stripe viven solo en las edge functions.

## Testing

- Runner: **Vitest** (config en `vitest.config.ts`, setup en `src/test/`).
- Corré `npm run test` antes de abrir un PR.
- Al agregar lógica no trivial, agregá tests.
