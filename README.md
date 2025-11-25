# 📦 Inventario de Productos –  TP2

**Alumno:** Matías Paulon

**Materia:** Plataformas de Desarrollo

**Proyecto individual** – 

---

## Descripción General

El TP2 consiste en el desarrollo de un **sistema completo de inventario**, dividido en **backend (Node + Express)** y **frontend (React)**, incorporando:

- API REST real  
- Autenticación con **JWT**  
- Sistema de **roles** (admin / usuario)  
- CRUD de productos  
- CRUD de usuarios (solo admin)  
- Persistencia en archivos JSON  
- Interfaz moderna con React  
- Rutas protegidas (PrivateRoute)  
- Validación de permisos

El proyecto funciona como un **panel administrativo real**, permitiendo gestionar productos y usuarios de manera segura.

---

#  2. Arquitectura del Sistema

## 🖥 Frontend (React)
- React + Vite  
- Contexto de autenticación (`AuthContext`)  
- Login persistido con localStorage  
- Sidebar + pestañas ("Productos" / "Usuarios")  
- Formularios separados para crear y editar productos  
- Tablas dinámicas y buscador en tiempo real  
- Mensajes globales de éxito/error  
- Protecciones visuales según rol

**Rutas:**
/login
/inventario (protegida)
/ (redirecciona)


**Protección de rutas:**  
Se implementa `PrivateRoute` para bloquear todo el panel si el usuario no está logueado.

---

## 🖧 Backend (Node + Express)

### Endpoints:
POST /api/login
GET /api/productos
POST /api/productos
PUT /api/productos/:id
DELETE /api/productos/:id

GET /api/usuarios (solo admin)
POST /api/usuarios (solo admin)
DELETE /api/usuarios/:id (solo admin)


### Middlewares:
- `verificarToken` → valida el JWT  
- `soloAdmin` → limita acceso según rol  

### Persistencia:
- `productos.json`  
- `usuarios.json`

---

#  3. Sistema de Roles (Nuevo en TP2)

Se eliminaron roles innecesarios y se estableció un esquema simple y claro:

| Acción | admin | usuario |
|--------|--------|---------|
| Ver productos | ✔ | ✔ |
| Crear productos | ✔ | ✔ |
| Editar productos | ✔ | ✔ |
| Eliminar productos | ✔ | ✔ |
| Ver usuarios | ✔ | ❌ |
| Crear usuarios | ✔ | ❌ |
| Eliminar usuarios | ✔ | ❌ |

**Reglas especiales:**
- No se puede eliminar al **único admin** existente.  
- Un admin **no puede eliminar su propia cuenta**.  

---

#  4. Funcionalidades Implementadas

##  4.1 Gestión de Productos (CRUD)
- Alta de productos  
- Edición individual  
- Eliminación con confirmación  
- Filtro por nombre en tiempo real  
- Tarjetas informativas:  
  - total de productos  
  - stock global  
  - valor total del inventario  

Toda la edición requiere estar logueado.

---

##  4.2 Gestión de Usuarios (Solo Admin)
Incluye:

- Listado completo de usuarios  
- Creación de usuarios (admin / usuario)  
- Eliminación con restricciones  
- Prevención de auto-eliminación  
- Prevención de eliminar al último admin  

---

##  4.3 Login y Autenticación
- Login con username + password  
- Validación en backend  
- JWT almacenado en localStorage  
- Rutas protegidas tanto en frontend como en backend  

---

# 5. Modelos de Datos

## Usuario

{
  "id": 123456,
  "username": "admin",
  "password": "1234",
  "role": "admin"
}

Producto
{
  "id": 7890,
  "nombre": "Teclado",
  "categoria": "Accesorios",
  "precio": 15000,
  "stock": 8
}

 6. Seguridad Implementada

Autenticación JWT en backend
Validación de token en cada request
PrivateRoute en frontend
Validación de roles (soloAdmin)
Restricción de acciones peligrosas
Limpieza de roles obsoletos (lector/editor)

7. Interfaz y Experiencia de Usuario

Sidebar responsive
Pestañas dinámicas
Botones estilizados (primary, ghost, danger)
Alertas flotantes para feedback
Diseño claro y moderno
Indicadores de inventario
Modo lectura para usuarios no logueados

 8. Conclusión

El TP2 llevó el proyecto inicial a un nivel profesional:

De un inventario simple pasó a un sistema administrativo completo.
Se integró autenticación, roles y persistencia real.
Se desarrolló un panel moderno y seguro.
Se aplicaron conceptos de frontend, backend, seguridad y arquitectura.
El sistema queda preparado para futuras ampliaciones, como base de datos real, hash de contraseñas y módulos adicionales.

9. Mejoras Futuras Posibles

Hash de contraseñas (bcrypt)
Migración a MongoDB o PostgreSQL
Logs de auditoría
Dashboard con gráficos
Sistema de movimientos de stock
Exportar inventario a Excel


---
