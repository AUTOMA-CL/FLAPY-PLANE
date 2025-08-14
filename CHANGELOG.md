# 📋 CHANGELOG - Flappy Plane Game

## Versión 2.0.2 (2025-01-14)
### ✅ Estado: ESTABLE - Google Sheets Restaurado

### 🔧 Correcciones Críticas
- **SOLUCIONADO:** Problema de lentitud al hacer click en "Comenzar Juego"
- Restaurada integración directa con Google Sheets
- Eliminada base de datos JSON local que causaba demoras
- Los registros y puntajes ahora van directamente a Google Sheets

### 📝 Cambios Técnicos
- Registro de usuarios: POST directo a Google Apps Script
- Actualización de puntajes: POST directo a Google Apps Script
- Eliminada dependencia de `/api/users` local
- URL del script restaurada y funcionando

### ⚡ Mejoras de Performance
- Tiempo de respuesta reducido significativamente
- Sin lectura/escritura de archivos JSON locales
- Conexión directa con Google Sheets más rápida

---

## Versión 2.0.1 (2025-01-14)
### ✅ Estado: ESTABLE - Ajuste Visual

### 🎨 Cambios Visuales
- Aumentado el tamaño del logo FEROUCH en la página de registro al 150% (1.5x)
- Mejorada la visibilidad del logo sin afectar el layout general
- Agregado overflow-hidden al contenedor para mantener las dimensiones del recuadro

### 📝 Detalles Técnicos
- Archivo modificado: `src/app/page.tsx`
- Aplicado `transform scale-150` al logo
- Sin cambios en espaciados o dimensiones del formulario

---

## Versión 2.0.0-stable (2025-01-14)
### ✅ Estado: ESTABLE - Producción Ready

### 🎯 Características Principales
- ✅ Juego completamente funcional tipo Flappy Bird con temática de avión
- ✅ Sistema de registro de usuarios (nombre, teléfono, email, edad)
- ✅ Motor de juego con física realista y detección precisa de colisiones
- ✅ Interfaz optimizada para dispositivos móviles y tablets
- ✅ Sistema de puntuación con persistencia en base de datos local
- ✅ Desplegado exitosamente en Vercel

### 🔧 Correcciones Realizadas
- Fixed: Configuración de Vercel para proyecto en subcarpeta
- Fixed: Warnings de ESLint eliminados
- Fixed: Estructura de archivos limpiada y optimizada
- Fixed: Detección de colisiones mejorada con forma real del avión
- Fixed: Touch controls optimizados para dispositivos móviles

### 📦 Stack Tecnológico
- Next.js 15.4.6
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x
- Base de datos: JSON local (preparado para migración futura)

### 📂 Estructura del Proyecto
```
flappy-plane/
├── src/
│   ├── app/           # Páginas y rutas
│   ├── components/    # Componentes React
│   ├── lib/          # Lógica de negocio
│   └── types/        # TypeScript types
├── public/           # Assets estáticos
└── data/            # Base de datos local
```

### 🚀 Despliegue
- URL de producción configurada en Vercel
- Build automático en cada push a main
- Configuración optimizada para performance

---

## Versión 1.0.0 (2025-01-13)
### Estado: Desarrollo inicial

- Configuración inicial del proyecto
- Implementación básica del juego
- Primera versión del sistema de registro

---

## 📝 Notas para Desarrolladores

### Para continuar desde esta versión:
1. Clonar repositorio: `git clone https://github.com/AUTOMA-CL/FLAPY-PLANE.git`
2. Checkout a esta versión: `git checkout v2.0-stable`
3. Instalar dependencias: `cd flappy-plane && npm install`
4. Ejecutar en desarrollo: `npm run dev`

### Comandos Útiles:
```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Verificar tipos
npm run lint

# Ejecutar producción local
npm run start
```

### Variables de Entorno:
- No requiere variables de entorno para funcionar
- Configuración lista para agregar en el futuro si es necesario