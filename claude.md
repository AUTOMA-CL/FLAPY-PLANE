# Flappy Plane Game - Development Instructions

## PROJECT OVERVIEW
Desarrollar un juego web tipo Flappy Bird con temática de avión, optimizado para dispositivos móviles (especialmente tablets), con sistema de registro de usuarios y despliegue en Vercel.

## ASSETS DISPONIBLES
En la carpeta `images/` se encuentran:
- `background.jpeg` - Fondo del juego (NO del menú)
- `plane.png` - Avión jugador (sin fondo, requiere detección de forma para colisiones)

## REQUIREMENTS TÉCNICOS

### Stack Tecnológico
- **Framework:** Next.js 14 con TypeScript
- **Styling:** Tailwind CSS
- **Base de datos temporal:** JSON local o SQLite
- **Despliegue:** Vercel
- **Optimización:** Mobile-first, touch interface

### Estructura del Proyecto
```
flappy-plane/
├── src/
│   ├── app/
│   │   ├── page.tsx (Página de registro)
│   │   ├── game/
│   │   │   └── page.tsx (Página del juego)
│   │   └── api/
│   │       └── users/
│   │           └── route.ts (API para guardar usuarios)
│   ├── components/
│   │   ├── RegistrationForm.tsx
│   │   ├── GameCanvas.tsx
│   │   └── GameUI.tsx
│   ├── lib/
│   │   ├── database.ts (Manejo de datos)
│   │   └── gameLogic.ts (Lógica del juego)
│   └── types/
│       └── index.ts (Tipos TypeScript)
├── public/
│   └── images/
│       ├── background.jpeg
│       └── plane.png
└── data/
    └── users.json (Base de datos temporal)
```

## ESPECIFICACIONES DETALLADAS

### 1. SISTEMA DE REGISTRO
**Archivo:** `src/components/RegistrationForm.tsx`

**Funcionalidades requeridas:**
- Formulario con campos: Nombre, Teléfono, Email
- Validación en tiempo real
- Diseño mobile-first con campos grandes para touch
- Botón "Comenzar Juego" prominente
- Almacenamiento en JSON local (preparado para Excel posteriormente)

**Validaciones:**
- Nombre: mínimo 2 caracteres, solo letras y espacios
- Teléfono: formato válido, números y símbolos permitidos
- Email: formato email válido

### 2. MOTOR DEL JUEGO
**Archivo:** `src/components/GameCanvas.tsx`

**Mecánicas específicas:**
- Canvas HTML5 para renderizado
- Física: gravedad constante + impulso al tocar
- Control: tap en cualquier parte de la pantalla
- Avión (`plane.png`): **CRÍTICO - detectar forma real para colisiones precisas**
- Fondo: `background.jpeg` scrolling horizontal
- Obstáculos: pipes/columnas generadas proceduralmente
- FPS objetivo: 60

**Sistema de colisión:**
```typescript
// Detectar forma del avión desde plane.png
// Usar bounding box ajustado a la forma real
// NO usar rectángulo completo de la imagen
```

### 3. INTERFAZ MÓVIL
**Optimizaciones requeridas:**
- Viewport meta tag apropiado
- Prevenir zoom en touch
- Touch events optimizados (touchstart/touchend)
- Responsive design: 320px - 1024px width
- Orientación: landscape preferida, portrait funcional

### 4. API Y DATOS
**Archivo:** `src/app/api/users/route.ts`

```typescript
// POST endpoint para guardar usuarios
// GET endpoint para recuperar estadísticas
// Estructura preparada para integración Excel futura
```

**Esquema de datos:**
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string", 
  "email": "string",
  "createdAt": "ISO timestamp",
  "bestScore": 0,
  "totalGames": 0
}
```

## CONFIGURACIÓN ESPECÍFICA

### 1. Next.js Config
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Optimización para Vercel
  output: 'standalone',
}
module.exports = nextConfig
```

### 2. Tailwind Config
```javascript
// Breakpoints móviles
screens: {
  'xs': '320px',
  'sm': '640px', 
  'md': '768px',
  'lg': '1024px'
}
```

### 3. TypeScript Types
```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  bestScore?: number;
  totalGames?: number;
}

interface GameState {
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  planePosition: { x: number; y: number };
  velocity: number;
  obstacles: Obstacle[];
}
```

## FLUJO DE LA APLICACIÓN

1. **Página inicial** (`/`) → Formulario de registro
2. **Envío exitoso** → Redirección a `/game`
3. **Página del juego** → Canvas fullscreen + UI overlay
4. **Game Over** → Mostrar score + botón "Jugar otra vez"

## INSTRUCCIONES CRÍTICAS PARA LA IMPLEMENTACIÓN

### 🎯 PRIORIDAD ALTA
1. **Detección de colisiones precisa:** Analizar `plane.png` para obtener boundaries reales
2. **Touch responsive:** Latencia < 50ms en touch events
3. **Performance:** Mantener 60 FPS en dispositivos móviles
4. **Formulario robusto:** Validación completa y UX fluida

### 🔧 CONFIGURACIONES IMPORTANTES
- Canvas con `touch-action: none` para prevenir scroll
- Event listeners con `{ passive: false }` para preventDefault
- Image preloading antes de iniciar el juego
- Error boundaries para manejo de errores

### 📱 MOBILE OPTIMIZATIONS
```css
/* Prevenir zoom en inputs */
input { font-size: 16px; }

/* Fullscreen canvas */
canvas { 
  width: 100vw; 
  height: 100vh; 
  position: fixed;
  top: 0;
  left: 0;
}
```

### 🚀 PREPARACIÓN PARA EXCEL
En `src/lib/database.ts`, crear abstracción que permita:
- Cambiar fácilmente entre JSON local y Excel API
- Mantener misma interfaz para operaciones CRUD
- Variables de entorno para configuración

## CHECKLIST DE ENTREGABLES

**PASO 1.1: ✅ COMPLETADO** - Proyecto Next.js creado con estructura de carpetas
**PASO 1.2: ✅ COMPLETADO** - Archivos base configurados (next.config.ts, tailwind.config.ts, globals.css)
**PASO 1.3: ✅ COMPLETADO** - Assets movidos y estructura completa creada
**PASO 1.4: ✅ COMPLETADO** - TypeScript types configurados y path mapping ajustado

**🎯 FASE 1: SETUP INICIAL - ✅ COMPLETADA**

**PASO 2.1: ✅ COMPLETADO** - RegistrationForm.tsx con validaciones completas
**PASO 2.2: ✅ COMPLETADO** - API endpoint /api/users con validaciones servidor
**PASO 2.3: ✅ COMPLETADO** - Página principal con formulario integrado
**PASO 2.4: ✅ COMPLETADO** - Base de datos JSON con funciones CRUD

**🎯 FASE 2: SISTEMA DE REGISTRO - ✅ COMPLETADA**

**PASO 3.1: ✅ COMPLETADO** - GameCanvas.tsx con detección precisa de colisiones del avión
**PASO 3.2: ✅ COMPLETADO** - Física (gravedad/salto), controles touch/teclado, colisiones optimizadas
**PASO 3.3: ✅ COMPLETADO** - Página del juego completa con GameUI integrado
**PASO 3.4: ✅ COMPLETADO** - Sistema de puntuación con persistencia y actualización en BD

**🎯 FASE 3: MOTOR DEL JUEGO - ✅ COMPLETADA**

**🎮 PROYECTO FLAPPY PLANE GAME - 100% FUNCIONAL**

- [✅] Formulario de registro funcional
- [✅] Validación de campos completa
- [✅] Game engine con física correcta
- [✅] Detección de colisiones precisa con forma del avión
- [✅] Interfaz touch optimizada
- [✅] Sistema de puntuación
- [✅] Responsive design (320px-1024px)
- [✅] API endpoints funcionales
- [✅] Almacenamiento de datos local
- [✅] Configuración para Vercel
- [✅] Error handling completo
- [✅] Performance optimizado (60 FPS)

**🔥 LISTO PARA PRODUCCIÓN - Compilación exitosa**

## COMANDOS PARA INICIALIZAR

```bash
npx create-next-app@latest flappy-plane --typescript --tailwind --eslint --app
cd flappy-plane
npm install
# Crear estructura de carpetas
# Copiar assets a public/images/
npm run dev
```

## NOTAS ADICIONALES

1. **Excel Integration:** Dejar preparado para Microsoft Graph API
2. **Analytics:** Estructura preparada para tracking de eventos
3. **PWA:** Considerar implementación futura
4. **Offline:** Game funcional sin conexión tras primera carga

**IMPORTANTE:** Priorizar funcionalidad core antes que features adicionales. El juego debe ser completamente jugable y responsive antes de agregar optimizaciones avanzadas.
