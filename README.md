# FA Pottery Studio

## Project info

Sitio de FA Pottery Studio: producción, clases y catálogo de cerámica, con backoffice de gestión de contenidos.

## Cómo editar este código

**Trabajar localmente con tu IDE**

El único requisito es tener Node.js & npm instalados - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Pasos:

```sh
# Paso 1: Clonar el repositorio
git clone <YOUR_GIT_URL>

# Paso 2: Entrar al directorio del proyecto
cd <YOUR_PROJECT_NAME>

# Paso 3: Instalar dependencias
npm i

# Paso 4: Levantar el servidor de desarrollo
npm run dev
```

**Editar un archivo directamente en GitHub**

- Navegá al archivo deseado.
- Hacé clic en el botón "Edit" (ícono de lápiz) arriba a la derecha.
- Hacé tus cambios y commiteá.

**Usar GitHub Codespaces**

- Andá a la página principal del repositorio.
- Hacé clic en el botón "Code" (verde) arriba a la derecha.
- Seleccioná la pestaña "Codespaces".
- Hacé clic en "New codespace".
- Editá archivos directamente en el Codespace y commiteá/pusheá tus cambios.

## Tecnologías usadas

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Deploy

El sitio se despliega en **Netlify**, conectado al repositorio de GitHub. Cada push a la rama `main` dispara un build y deploy automático a producción (`fapottery.com`).

## Dominio

El dominio propio (`fapottery.com`) está configurado en Netlify: Site configuration → Domain management.

## Pagos (Stripe)

Los pagos online (seña de clases, compra de piezas y bonos regalo) usan Stripe Checkout a través de Edge Functions de Supabase (`create-class-checkout`, `create-piece-checkout`, `create-giftcard-checkout`, `stripe-webhook`).

Para que funcionen en producción hace falta configurar, como secrets del proyecto de Supabase (Project Settings → Edge Functions → Secrets, o `supabase secrets set`):

- `STRIPE_SECRET_KEY`: clave secreta de la cuenta de Stripe (España/EUR).
- `STRIPE_WEBHOOK_SECRET`: signing secret del webhook de Stripe apuntando a `<SUPABASE_URL>/functions/v1/stripe-webhook`, escuchando el evento `checkout.session.completed`.

El webhook es el que confirma el pago de verdad (marca la reserva como pagada, descuenta stock, genera el código del bono regalo) — sin `STRIPE_WEBHOOK_SECRET` configurado, los pagos no se confirman automáticamente.
