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

Las fotos están en `img/`:

- `image-1.png`, `image-2.png`, `image-3.png`: tarjetas de servicios (en orden)
- `image-javier.png`, `image-tamara.png`, `image-leandro.png`: fotos del equipo
- `post-1.png` a `post-4.png`: fotos de la grilla de Instagram (si se configura el feed, se reemplazan por los posteos reales)

Si falta alguna, se ve el recuadro beige de placeholder.

## Instagram (últimos posteos)

Instagram no deja leer los posteos desde una web estática, así que hace falta un servicio intermedio gratuito que genere un feed JSON. Recomendado: [Behold.so](https://behold.so)

1. Crear cuenta en Behold y conectar la cuenta de Instagram `@somos.poshito`.
2. Crear un feed de tipo **JSON** y copiar su URL (algo como `https://feeds.behold.so/XXXX`).
3. Pegarla en `js/i18n.js`, dentro de `CONTACT`: `instagramFeed: "https://feeds.behold.so/XXXX"`.

La grilla muestra los 4 posteos más recientes y cada uno abre su post. Sin feed, los recuadros enlazan al perfil.

## Idiomas

- Por defecto: inglés.
- El idioma elegido se recuerda en el navegador.
- Enlaces directos: `?lang=es` o `?lang=nl` (por ejemplo `tuweb.com/?lang=nl`).
- Para editar un texto, búscalo en `js/i18n.js` dentro de `en`, `es` o `nl`.

## Formulario

Las consultas se envían con [Web3Forms](https://web3forms.com) y llegan a somosposhito@gmail.com.
La clave está en `js/i18n.js`, en `CONTACT.formKey`. El envío está en el bloque "quote form" de `js/main.js`.
En la configuración del formulario en Web3Forms, la Website URL es `somosposhito.nl`.

## Publicar en GitHub Pages

La web se publica desde la rama `main` (carpeta raíz) del repo `CaroFerreyra/poshito-web`, con el dominio **https://somosposhito.nl**.

- El archivo `CNAME` (en la raíz) le dice a GitHub cuál es el dominio. No borrarlo.
- En el repo: **Settings → Pages**: rama `main`, carpeta `/ (root)`, Custom domain `somosposhito.nl` y **Enforce HTTPS** activado.
- Cada push a `main` se publica solo en un par de minutos.

### DNS en GoDaddy (somosposhito.nl)

| Tipo  | Nombre | Valor                    |
|-------|--------|--------------------------|
| A     | @      | 185.199.108.153          |
| A     | @      | 185.199.109.153          |
| A     | @      | 185.199.110.153          |
| A     | @      | 185.199.111.153          |
| CNAME | www    | caroferreyra.github.io   |

Sin reenvío (forwarding) activado en GoDaddy. `www.somosposhito.nl` redirige solo a `somosposhito.nl`.
