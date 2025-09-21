# Informe – Parcial 1 (ACN4BV)
**Proyecto:** Inventario simple de productos  
**Integrante:** Matías Paulon  
**Repositorio:** `parcial-1-pd-acn4bv-paulon`

---

## 1) Descripción de la pantalla (única)
La aplicación muestra **una sola pantalla** compuesta por:
- **Formulario** para agregar productos: `nombre`, `precio`, `categoría`, `stock`.
- **Listado** de productos renderizado dinámicamente.
- **Acciones mínimas**: agregar y eliminar producto.
- **Persistencia**: el inventario se guarda en `localStorage`; al recargar, se recupera.

**Objetivo del usuario:** cargar rápidamente productos y verlos en una lista clara.

---

## 2) Flujo de uso
1. El usuario completa el formulario y presiona **Agregar**.
2. Se valida:
   - `nombre` no vacío,
   - `precio` numérico y > 0,
   - `categoría` seleccionada,
   - `stock` entero ≥ 0.
3. Si es válido, se crea una **instancia de `Producto`**, se agrega al **array `productos`** y se **persiste** en `localStorage` (JSON).
4. Se **re-renderiza** el listado en el DOM.
5. El usuario puede **eliminar** un producto (con **confirmación**).
6. Al iniciar la app, si hay datos en `localStorage`, se **cargan** y se muestran.

---

## 3) Modelo de datos
```ts
Producto {
  id: number;           // autoincremental
  nombre: string;       // texto
  precio: number;       // número
  categoria: string;    // texto
  stock: number;        // entero >= 0
  // Método mínimo sugerido:
  // precioConIVA(): number
}```

---

## 4) Requisitos – Hoja 2 (mínimo para aprobar)
- [x] Una sola pantalla
- [x] Informe que describe la página
- [x] Variables y estructuras de control
- [x] Arrays y objetos
- [x] Clase con constructor y al menos un método
- [x] Interacción con el DOM
- [x] Formulario/input para agregar datos nuevos
- [x] Persistencia en localStorage
- [x] Consola sin errores
- [x] Commits visibles en GitHub


