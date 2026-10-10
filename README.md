# 📱 Mundo Cell - Control de Inventario & Punto de Venta Móvil (APK)

<div align="center">
  <img src="public/logo.png" width="120" height="120" alt="Mundo Cell Logo" style="border-radius: 20px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);" />
  <h3>Sistema Móvil Oficial para Mundo Cell</h3>
  <p>Control de Inventario • Ventas Rápidas (POS) • Venta del Día • Cierre de Caja • Soporte Multimoneda</p>
</div>

---

## 🌟 Características Principales

### 📦 1. Control de Inventario Inteligente (CRUD)
- **Agregar, Modificar y Eliminar artículos**: Interfaz rápida y táctil.
- **Campos de cada producto**:
  - **Marca**: Selector rápido o marcas personalizadas.
  - **Modelo / Descripción**: Detalle del equipo o repuesto.
  - **Precio USD ($)**: **Validación estricta que solo permite números** y calcula en tiempo real el equivalente en Bolívares (Bs) según la tasa del día.
  - **Unidades disponibles (Stock)**:
    - ⚠️ **Alerta visual**: Si hay **menos de 2 unidades disponibles**, se muestra automáticamente un **asterisco rojo (\*)** y borde de advertencia de stock crítico.
- **Buscador en tiempo real** por marca, modelo o categoría.
- **Filtro rápido**: "⚠️ Stock Crítico < 2 unid".

### 🏷️ 2. Marcas de Celulares con Logos Vectoriales Oficiales
Barra interactiva de marcas con logos de alta resolución:
- **Xiaomi** (Logo oficial naranja MI)
- **Motorola** (Emblema icónico batwing azul)
- **Infinix** (Logotipo estilizado verde neón)
- **Tecno** (Insignia oficial azul y cian)
- **iPhone / Apple** (Silueta oficial de la manzana)
- *Al pulsar cualquier marca, el catálogo se filtra instantáneamente.*

### 🎧 3. Apartado de Accesorios Desplazable (Horizontal Carousel)
Carrusel táctil con desplazamiento fluido para accesorios:
- **Forros** (Fundas antichoque y magnéticas)
- **Audífonos** (Bluetooth TWS y diademas)
- **Cable USB** (Tipo C 65W, Lightning, etc.)
- **Router** (Wi-Fi doble banda y 4G LTE)
- **Cornetas** (Altavoces Bluetooth portátiles)

### 🛒 4. Punto de Venta (POS) y Facturación
- Selección táctil ágil para vender al instante desde el mostrador.
- Carrito de compras flotante con conteo de ítems y total en **$ USD y Bolívares (Bs)**.
- **Descuento automático de stock** en la base de datos al confirmar la venta.
- **Recibo / Ticket digital**: Imprimible y listo para enviar al cliente por **WhatsApp** con un solo toque.

### 💰 5. Venta del Día y Cierre de Caja
Auditoría completa de ingresos con desglose por todos los métodos de pago solicitados:
1. **Efectivo** (Bolívares / Efectivo general)
2. **Divisa** (Dólares en efectivo)
3. **Punto de Venta** (Tarjeta de débito/crédito)
4. **Pago Móvil** (Bolívares instantáneo)
5. **Cashea** (Financiamiento en cuotas)
6. **Weppa** (Billetera y financiamiento digital)

- **Arqueo de Efectivo Físico**: Conteo de gaveta vs sistema, calculando si hay sobrante, faltante o cuadre perfecto.
- **Botón de Cierre de Caja**: Archiva la jornada con fecha, hora exacta y resumen inmutable.
- **Historial de Cierres**: Consulta de cierres anteriores con opción de compartir reporte a WhatsApp.

### 💾 6. Base de Datos Confiable (100% Offline)
- Desarrollada con **Dexie.js / IndexedDB**:
  - Funciona completamente **sin internet** (cero caídas en el mostrador).
  - Almacenamiento local persistente y ultra rápido.
  - **Exportar Copia de Seguridad**: Descarga un archivo JSON de respaldo con 1 clic.
  - **Importar / Restaurar**: Recupera el inventario completo en cualquier momento.

---

## 🛠️ Arquitectura Técnica

- **Frontend**: React 19 + Vite (Modern, modular, responsive)
- **Diseño**: CSS Moderno Dark-Gold Luxury con Glassmorphism (inspirado en la insignia dorada de Mundo Cell)
- **Nativo Móvil**: Capacitor 7 (Android nativo con `android/`)
- **Base de Datos**: Dexie.js (IndexedDB local)
- **Automatización CI/CD**: GitHub Actions (`.github/workflows/build-apk.yml`) para compilar el archivo `.apk` automáticamente en la nube.

---

## 🚀 Cómo Subir a tu Repositorio de GitHub y Obtener la APK

1. Crea un nuevo repositorio en tu cuenta de GitHub (por ejemplo llamado `mundo-cell`).
2. En la terminal de este proyecto, ejecuta los siguientes comandos:

```powershell
# 1. Vincular tu repositorio de GitHub (reemplaza con tu usuario o URL)
git remote add origin https://github.com/jesusramirez173/mundo-cell.git

# 2. Subir el código a la rama principal
git branch -M main
git push -u origin main
```

3. **¡Listo!** En cuanto hagas `git push`:
   - El workflow de **GitHub Actions** se activará automáticamente.
   - Compilará el proyecto en un entorno Android con Java y Gradle.
   - Generará el archivo **`MundoCell-v1.0.apk`** listo para descargar en la pestaña **Releases** o **Actions > Artifacts** de tu GitHub.
   - Descargas el `.apk` en tu teléfono Android y lo instalas directamente.

---

## 💻 Comandos de Desarrollo Local

```powershell
# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev

# Compilar para producción y sincronizar con Android
npm run build
npx cap sync android
```
