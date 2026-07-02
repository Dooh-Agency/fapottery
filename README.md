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
