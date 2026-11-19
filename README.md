# Poshito Catering · web

Landing estática (HTML, CSS y JS sin dependencias) en inglés, español y holandés. Inglés por defecto.

## Estructura

```
index.html        la página
css/styles.css    estilos (colores y tipografías del Figma)
js/i18n.js        datos de contacto + todos los textos EN / ES / NL
js/main.js        selector de idioma, menú móvil, formulario
img/              logo, isologo y fotos
```

## Cambiar datos de contacto

Todo está arriba de `js/i18n.js`, en `CONTACT`:

```js
whatsappNumber: "31642376311",   // solo dígitos, con prefijo de país
phoneDisplay: "+31 6 4237 6311",
email: "somosposhito@gmail.com",
instagram: "somos.poshito"
```

Se actualiza solo en toda la web (botones, enlaces de WhatsApp, Instagram y mail).

## Fotos

Exporta las imágenes desde Figma en JPG y guárdalas en `img/` con estos nombres:

- `servicio-1.jpg`, `servicio-2.jpg`, `servicio-3.jpg`: tarjetas de servicios
- `equipo-javier.jpg`, `equipo-tamara.jpg`, `equipo-leandro.jpg`: fotos del equipo
- `instagram-1.jpg` a `instagram-4.jpg`: grilla de Instagram

Si falta alguna, se ve el recuadro beige de placeholder.

## Idiomas

- Por defecto: inglés.
- El idioma elegido se recuerda en el navegador.
- Enlaces directos: `?lang=es` o `?lang=nl` (por ejemplo `tuweb.com/?lang=nl`).
- Para editar un texto, búscalo en `js/i18n.js` dentro de `en`, `es` o `nl`.

## Formulario

De momento, al enviar se abre el correo del usuario con la consulta ya escrita, dirigida a `CONTACT.email`.
Cuando elijáis un servicio (Formspree, Web3Forms…), solo hay que cambiar el bloque "quote form" de `js/main.js`.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `poshito-web`).
2. Sube todo el contenido de esta carpeta a la raíz del repo (`index.html` tiene que quedar en la raíz).
3. En el repo: **Settings → Pages → Build and deployment**, elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. En un par de minutos estará en `https://TU-USUARIO.github.io/poshito-web/`.
5. Dominio propio (opcional): en la misma pantalla de Pages, escribe el dominio en **Custom domain** y configura el DNS en tu proveedor.
