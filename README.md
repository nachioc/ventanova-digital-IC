# VentaNova Digital

Aplicación web en Angular 21, TypeScript y Tailwind CSS 4.

## Comandos
- `npm install` instala dependencias
- `npm start` servidor de desarrollo (http://localhost:4200)
- `npm run build` build de producción en `dist/ventanova-digital/browser`

## Publicación en Netlify
Con el repositorio conectado, Netlify toma `netlify.toml` (build: `npm run build`, publish: `dist/ventanova-digital/browser`).
Para subir a mano, arrastra la carpeta `dist/ventanova-digital/browser` a Netlify Drop.
El archivo `_redirects` permite recargar rutas internas sin error 404.
