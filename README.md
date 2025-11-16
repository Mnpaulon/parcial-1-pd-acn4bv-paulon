# 📦 Inventario de Productos – TP1 + TP2

**Alumno:** Matías Paulon

**Materia:** Plataformas de Desarrollo

**Proyecto individual** – JavaScript, HTML, CSS

---

## Descripción

# 🟦 **TP1 – Proyecto base (Frontend solamente)**

En el TP1 se desarrolló un inventario básico usando solamente HTML, CSS y JavaScript del lado del cliente.

### ✔️ Funcionalidades originales del TP1

- Formulario con validaciones (nombre, precio > 0, categoría, stock > 0)
- Alta de productos
- Eliminar producto con confirmación
- Búsqueda en vivo por nombre/categoría
- Clase Producto con método `precioConIVA()`
- Render dinámico con DOM
- Persistencia en localStorage
- Carga de ejemplos desde FakeStore (solo en el navegador)
- Una única pantalla (HTML, CSS y JS)
- Wireframe en Figma
- Sin backend (toda la lógica del lado del cliente)

---

# 🟩 **TP2 – Ampliación del proyecto (Backend + CRUD profesional)**

Para el TP2 se integró un backend completo en **Node.js + Express** con persistencia real y CRUD completo.  
El frontend se actualizó para consumir esta API desde el servidor.

### ✔️ Endpoints implementados

- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos`
- `PATCH /api/productos/:id`
- `DELETE /api/productos/:id`

### ✔️ Persistencia real
- Archivo JSON: `/server/productos.json`
- Lectura/escritura con `fs/promises`

### ✔️ Middleware
- `express.json()`
- `cors()`
- `morgan("dev")`

### ✔️ Validaciones del lado del servidor
- Nombre obligatorio  
- Precio > 0  
- Categoría obligatoria  
- Stock entero > 0  
- Validación parcial en PATCH

### ✔️ Manejo de errores
- 400 (validación)
- 404 (no encontrado)
- 500 (error interno)

---

# 🟢 Integración frontend + backend (TP2)

El frontend ahora hace:

- POST → agregar  
- PATCH → editar  
- DELETE → eliminar  
- GET → listar  
- Cargar datos de ejemplo → se guardan en el backend  
- Tabla siempre sincronizada con el servidor (`loadFromAPI()`)

---

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
