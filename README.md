**Alumno:** Matías Paulon  
**Proyecto individual** – JavaScript, HTML, CSS

## Descripción
En el TP1 se desarrolló un inventario básico usando solamente HTML, CSS y JavaScript del lado del cliente.

✔️ Funcionalidades originales del TP1

Formulario con validaciones (nombre, precio > 0, categoría, stock > 0)

-Alta de productos
-Eliminar producto con confirmación
-Búsqueda en vivo por nombre/categoría
-Clase Producto con método precioConIVA()
-Render dinámico con manipulación del DOM
-Persistencia en localStorage (JSON.stringify/parse)
-Botón para cargar ejemplos desde API externa FakeStore (solo en el navegador)
-Una única pantalla (HTML + CSS + JS)
-Wireframe realizado en Figma
-Proyecto sin servidor (todo era del lado del navegador)

## Cómo correr
- Opción 1: Abrir `src/index.html` con la extensión **Live Server** de VS Code.
- Opción 2: Doble clic en `src/index.html` 

## Estructura
├─ assets/
│ └─ wireframe.png
├─ docs/
│ └─ informe.md
├─ src/
│ ├─ index.html
│ ├─ style.css
│ └─ main.js
└─ README.md


## Funcionalidades
- Formulario con validaciones (nombre, precio > 0, categoría, **stock > 0**).
- Listado con **búsqueda en vivo** por nombre/categoría.
- **Eliminar** producto (confirmación).
- **Persistencia** en `localStorage`.
- **API** de ejemplo (electronics) para precargar registros (`fetch` + `async/await`).
- Botón **Agregar** deshabilitado hasta que el formulario es válido.

## Requisitos
- [x] Una sola pantalla  
- [x] Informe (`docs/informe.md`)  
- [x] Variables y estructuras de control  
- [x] Arrays y objetos  
- [x] **Clase** con constructor + método (`Producto.precioConIVA()`)  
- [x] **DOM** (interacciones)  
- [x] **Formulario** para agregar  
- [x] **Persistencia** en localStorage (JSON.stringify/parse)  
- [x] Consola sin errores  
- [x] **Commits** visibles en GitHub  
- [x] **Wireframe/Mock** (`assets/wireframe.png`)  
- [x] **API externa** con `fetch` + `async/await`

## Wireframe hecho en figma 
![Wireframe](assets/wireframe.png)

---
