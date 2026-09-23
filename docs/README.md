# TitaMedia Pixel

Pixel app interna de [Tita Media](https://titamedia.com) que agrega un campo de configuración **"Script de Convert"** en el Admin de la tienda VTEX. El contenido pegado en ese campo se inyecta automáticamente en el `<head>` de todas las páginas del storefront, sin necesidad de modificar código por cliente.

Pensada como mecanismo estándar de Tita Media para instalar el script de la plataforma de CRO/A-B testing **Convert** en cualquier tienda VTEX, simplemente instalando la app y pegando el script correspondiente.

## Configuración

### VTEX IO Toolbelt

1. Instala la app en la cuenta deseada:

```sh
vtex install titamedia.titamedia-pixel@0.1.1
```

2. En el Admin de la tienda, ve a **Apps > Mis Apps** y busca **TitaMedia Pixel**.
3. En el campo **"Script de Convert"**, pega el snippet completo (comentarios + etiquetas `<script>...</script>` o `<script src="...">`) provisto por la plataforma Convert para esa tienda. Por ejemplo:

```html
<!-- begin Convert Experiences code--><script type="text/javascript" src="//cdn-4.convertexperiments.com/v1/js/100110270-100110721.js?environment=production"></script><!-- end Convert Experiences code -->
```

4. Guarda los cambios. El script quedará inyectado en el `<head>` de todas las páginas del storefront.

## Modus operandi

- El valor de "Script de Convert" se lee vía GraphQL (`publicSettingsForApp`) desde un componente React registrado como pixel (`store/interfaces.json` + `store/plugins.json`), no vía el archivo estático `pixel/head.html`. Esto es necesario porque VTEX aplica un `encodeURIComponent` a cualquier valor de `settings.*` interpolado en `pixel/head.html`, lo que rompe HTML/etiquetas completas pegadas ahí; leyendo el dato crudo por GraphQL evitamos ese problema y podemos inyectar el HTML tal cual fue pegado.
- El componente parsea el HTML pegado y, para cada `<script>` que contenga, crea un elemento `<script>` nuevo vía `document.createElement` (copiando atributos y contenido) antes de insertarlo en `document.head` — es la única forma de que el navegador realmente lo ejecute; insertarlo como HTML crudo (`innerHTML`) no lo ejecutaría.
- **Trade-off importante**: al depender de React + una consulta GraphQL, el script se inyecta después de que el bundle de la página carga e hidrata, no de forma síncrona antes del primer render como haría un `<head>` estático. Para herramientas de CRO/A-B testing como Convert, que recomiendan cargar su script lo antes posible para evitar "flicker" (parpadeo de la variante original antes de aplicar el test), esto puede introducir un pequeño retraso. Si el flicker se vuelve un problema medible, la alternativa es usar campos de configuración simples (solo IDs alfanuméricos) hardcodeados en `pixel/head.html`, igual que hacen los pixels nativos de VTEX (Google Tag Manager, Hotjar, etc.) — ese mecanismo sí es síncrono, pero ya no admite pegar HTML/etiquetas completas.
- El setting `convertScript` está marcado como `"access": "public"` en el `settingsSchema` (requerido para que `publicSettingsForApp` lo devuelva); esto es aceptable porque su contenido de todas formas termina público en el código fuente de cada página.
- Solo pega scripts de fuentes verificadas y confiables: el contenido de este campo se ejecuta con acceso completo al DOM en producción, para todos los visitantes de la tienda.
- No incluyas credenciales, API keys ni datos sensibles directamente en el script; usa los mecanismos de configuración propios de la plataforma de terceros (por ejemplo, IDs públicos de contenedor/cuenta) en lugar de secretos.

## Contribuidores ✨

Equipo de Tita Media.
