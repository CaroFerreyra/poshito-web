# Poshito Catering · contexto del proyecto

Landing de Poshito, un catering de tres amigos (Javier, Tamara y Leandro) en Ámsterdam.
Web estática (HTML + CSS + JS, sin build ni dependencias) publicada con GitHub Pages.

## Diseño

- Figma: https://www.figma.com/design/O25PzVUrLaV6H3oVIo5hCM/Poshito
  - Página "Web": landings desktop ES (7:34), EN (15:57) y NL (15:345), y "Componentes Poshito" (7:10)
  - Página "Playground Logo": logo, isologo y logotipo
- Colores (colección de variables "Poshito"): negro #050403, rojo #D34E3A, naranja #D36A3A, marrón #42271E, crema #F6EFE6, crema-oscuro #EADFD0, blanco #FFFFFF
- Tipografías: Bricolage Grotesque (títulos, 700/800), DM Sans (texto), Permanent Marker (detalles tipo pincel)
- Si se toca el diseño, mantener Figma y código alineados en los tres idiomas

## Estructura

- `index.html`: página única; los textos llevan `data-i18n`, los placeholders `data-i18n-ph`
- `js/i18n.js`: `CONTACT` (WhatsApp, email, Instagram) y los textos EN / ES / NL
- `js/main.js`: selector de idioma (EN por defecto, `?lang=es|nl`, se guarda en localStorage), menú móvil, formulario
- `css/styles.css`: estilos y responsive (cortes en 1240, 1080 y 640 px)
- `img/`: `logo.svg`, `isologo.svg` y fotos (ver README para los nombres)

## Datos de contacto actuales

- WhatsApp: +31 6 4237 6311 (wa.me/31642376311)
- Email: somosposhito@gmail.com
- Instagram: @somos.poshito

## Reglas

- Todo texto nuevo va en los tres idiomas dentro de `js/i18n.js`
- Inglés es el idioma por defecto
- Cambios puntuales: no tocar lo que no se pidió
- No usar guiones largos (em dash) en los textos

## Pendiente

- Feed de Instagram: crear feed JSON en Behold.so y poner la URL en `CONTACT.instagramFeed` (ver README)
- Probar el formulario (Web3Forms) en la web publicada
- Página de política de privacidad (el formulario la pide)
- Dominio propio: somosposhito.nl (GoDaddy, archivo `CNAME`); configurar DNS, Custom domain y Enforce HTTPS en GitHub Pages (ver README)
- Opcional: mover el repo a una organización `somosposhito` (el dominio no cambia)
