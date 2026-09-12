# Publicación de la Versión 2 en GitHub Pages

## 1. Crear el repositorio
Nombre recomendado:

`INNOPAT-La-Cartuja`

Puede ser privado durante el desarrollo. La disponibilidad de GitHub Pages dependerá de la configuración del plan/cuenta.

## 2. Subir los archivos
Subir **el contenido de esta carpeta**, no la carpeta contenedora, de forma que `index.html` quede en la raíz del repositorio.

La raíz debe contener, entre otros:

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `manifest.webmanifest`
- `sw.js`
- `VERSION`
- `CHANGELOG.md`

## 3. Activar GitHub Pages
En el repositorio:

**Settings → Pages → Build and deployment**

Seleccionar publicación desde una rama y elegir:

- Branch: `main`
- Folder: `/ (root)`

Guardar.

La URL tendrá normalmente esta forma:

`https://USUARIO.github.io/INNOPAT-La-Cartuja/`

## 4. Google Maps
En `config.js` existe:

```js
googleMapsApiKey: "",
googleMapsMapId: "DEMO_MAP_ID",
```

Para activar el mapa real hay que introducir una clave autorizada de Google Maps JavaScript API.

La clave debe restringirse por HTTP referrer al dominio que vaya a publicar la aplicación, por ejemplo:

`https://USUARIO.github.io/INNOPAT-La-Cartuja/*`

No usar una clave sin restricciones.

## 5. Cámara y geolocalización
GitHub Pages usa HTTPS, por lo que permite solicitar:

- cámara para leer códigos QR;
- ubicación del visitante.

Ambos permisos se solicitan únicamente tras una acción explícita del usuario.

## 6. Versionado recomendado
Cada versión estable debe conservarse mediante un tag/release:

- `v1.0.0`
- `v2.0.0`
- `v3.0.0`

La rama `main` contendrá la versión de trabajo más reciente aprobada.

Antes de una modificación estructural importante, crear un nuevo tag/release para poder volver a la versión anterior.
