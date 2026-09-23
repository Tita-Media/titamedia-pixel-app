# TitaMedia Pixel

Pixel app interna de [Tita Media](https://titamedia.com) que agrega un campo de configuración **"Script de Convert"** en el Admin de la tienda VTEX. El contenido pegado en ese campo se inyecta automáticamente en el `<head>` de todas las páginas del storefront, sin necesidad de modificar código por cliente.

Pensada como mecanismo estándar de Tita Media para instalar el script de la plataforma de CRO/A-B testing **Convert** en cualquier tienda VTEX (Nike Colombia, Mario Hernández, Juan Valdez, Forus Colombia, u otras), simplemente instalando la app y pegando el script correspondiente.

## Configuración

### VTEX IO Toolbelt

1. Instala la app en la cuenta deseada:

```sh
vtex install titamedia.titamedia-pixel@0.1.0
```

2. En el Admin de la tienda, ve a **Apps > Mis Apps** y busca **TitaMedia Pixel**.
3. En el campo **"Script de Convert"**, pega el script completo (incluyendo las etiquetas `<script>...</script>` o `<script src="...">`) provisto por la plataforma Convert para esa tienda.
4. Guarda los cambios. El script quedará inyectado en el `<head>` de todas las páginas del storefront.

## Modus operandi

- El script se inyecta **literalmente y sin escapar** vía `pixel/head.html`, por lo que puede contener HTML/JS válido tal como lo entrega la plataforma de origen.
- Solo pega scripts de fuentes verificadas y confiables: el contenido de este campo se ejecuta con acceso completo al DOM en producción, para todos los visitantes de la tienda.
- No incluyas credenciales, API keys ni datos sensibles directamente en el script; usa los mecanismos de configuración propios de la plataforma de terceros (por ejemplo, IDs públicos de contenedor/cuenta) en lugar de secretos.

## Contribuidores ✨

Equipo de Tita Media.
