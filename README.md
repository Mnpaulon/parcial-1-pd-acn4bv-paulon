**Alumno: Matías Paulon
**Materia: Plataformas de Desarrollo
**Proyecto individual** – JavaScript, HTML, CSS

## Descripción
En el TP1 se desarrolló un inventario básico usando solamente HTML, CSS y JavaScript del lado del cliente.

✔️ Funcionalidades originales del TP1

Formulario con validaciones (nombre, precio > 0, categoría, stock > 0)

- Alta de productos
- Eliminar producto con confirmación
- Búsqueda en vivo por nombre/categoría
- Clase Producto con método precioConIVA()
- Render dinámico con manipulación del DOM
- Persistencia en localStorage (JSON.stringify/parse)
- Botón para cargar ejemplos desde API externa FakeStore (solo en el navegador)
- Una única pantalla (HTML + CSS + JS)
- Wireframe realizado en Figma
- Proyecto sin servidor (todo era del lado del navegador)

Para el TP2 se integró un backend completo en Node.js + Express, agregando persistencia real y un CRUD profesional.
Todo el frontend fue actualizado para consumir esta nueva API.

Se desarrolló una API REST con las siguientes funcionalidades:

✔️ Endpoints implementados
- GET /api/productos
- GET /api/productos/:id
- POST /api/productos
- PATCH /api/productos/:id
- DELETE /api/productos/:id

✔️ Persistencia real
- Uso de un archivo JSON local: server/productos.json
- Lectura y escritura con fs/promises

✔️ Middleware
- express.json()
- cors()
- morgan("dev")

✔️ Validaciones del lado del servidor
- Nombre obligatorio
- Precio numérico mayor a 0
- Categoría obligatoria
- Stock entero mayor a 0
- Validación parcial para PATCH

✔️ Manejo de errores
- 400: errores de validación
- 404: producto no encontrado
- 500: error interno

## Integración del frontend con la API real

El frontend fue adaptado para:

- Cargar productos desde la API (ya no desde localStorage)
- Guardar productos usando POST
- Editar productos usando PATCH
- Eliminar productos usando DELETE
- Actualizar la tabla siempre desde el servidor (loadFromAPI())
- Mostrar mensajes según respuesta del backend

## Cómo correr

1️⃣ Backend (API)

En la carpeta raíz: node server/index.js
La API queda escuchando en: http://localhost:3000/api/productos


## Estructura
parcial-1-pd-acn4bv-paulon/
├── server/
│   ├── index.js            # API REST (Express)
│   └── productos.json      # Persistencia
├── src/
│   ├── index.html          # Frontend
│   ├── main.js
│   └── style.css
├── docs/
│   └── informe.md
├── assets/
│   └── wireframe.png
└── README.md



## Funcionalidades

Frontend
- Agregar producto (POST)
- Editar producto (PATCH)
- Eliminar producto (DELETE)
- Listado dinámico
- Búsqueda en vivo
- Carga masiva desde API externa (FakeStore)
- Validaciones de formulario
- Mensajes de error/éxito

Backend
- CRUD completo
- Validaciones
- Persistencia JSON
- Middleware CORS + Morgan
- Manejo de errores
- Respuestas JSON estándar

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
