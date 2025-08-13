# 🛩️ Flappy Plane - Juego Web Interactivo

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa)

## 🎮 Descripción

**Flappy Plane** es un juego web adictivo inspirado en el clásico Flappy Bird, pero con aviones. Optimizado especialmente para dispositivos móviles y tablets, ofrece una experiencia de juego fluida con registro de usuarios y seguimiento de puntuaciones.

### 🌐 Jugar Ahora
**[https://flapy-plane.vercel.app/](https://flapy-plane.vercel.app/)**

## ✨ Características Principales

### 🎯 Gameplay
- **Controles simples**: Tap/Click/Espaciador para volar
- **Sistema de vidas**: 3 vidas con invulnerabilidad temporal
- **Física realista**: Gravedad y mecánicas de vuelo precisas
- **Detección de colisiones**: Sistema preciso basado en la forma del avión
- **Puntuación**: Sistema de puntaje con registro en base de datos

### 📱 Optimización Móvil
- **Responsive Design**: Adaptable desde 320px hasta 1024px
- **Touch-First**: Controles optimizados para pantallas táctiles
- **60 FPS**: Rendimiento fluido en dispositivos móviles
- **PWA**: Instalable como aplicación nativa

### 👤 Sistema de Usuarios
- **Registro completo**: Nombre, teléfono, email y edad
- **Validación en tiempo real**: Verificación instantánea de datos
- **Base de datos**: Integración con Google Sheets
- **Persistencia**: Guardado automático de mejores puntuaciones

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15.4.6 con TypeScript
- **Styling**: Tailwind CSS para diseño responsive
- **Game Engine**: HTML5 Canvas con renderizado optimizado
- **Database**: Google Sheets API
- **Deployment**: Vercel con optimización automática
- **Analytics**: Sistema integrado de métricas

## 📊 Analytics Dashboard

### 🔒 Acceso Privado
El dashboard de analytics está disponible solo mediante acceso directo:

**[https://flapy-plane.vercel.app/analytics](https://flapy-plane.vercel.app/analytics)**

*Nota: Esta página no es accesible desde la navegación normal del juego*

### Métricas Disponibles
- Total de usuarios registrados
- Partidas jugadas
- Puntuación promedio
- Mejores puntuaciones
- Tasa de retención
- Dispositivos más usados

## 💻 Instalación Local

### Prerrequisitos
- Node.js 18.x o superior
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/AUTOMA-CL/FLAPY-PLANE.git
cd flappy-plane
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
NEXT_PUBLIC_GOOGLE_SHEETS_URL=tu_url_aqui
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
flappy-plane/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Página de registro
│   │   ├── game/             # Página del juego
│   │   ├── analytics/        # Dashboard de métricas
│   │   └── api/              # Endpoints API
│   ├── components/
│   │   ├── GameCanvas.tsx    # Motor del juego
│   │   ├── GameUI.tsx        # Interfaz del juego
│   │   └── RegistrationForm.tsx
│   ├── lib/
│   │   ├── database.ts       # Conexión Google Sheets
│   │   ├── gameLogic.ts      # Lógica del juego
│   │   └── analytics.ts      # Sistema de tracking
│   └── types/
│       └── index.ts          # TypeScript definitions
├── public/
│   ├── manifest.json         # PWA configuration
│   ├── service-worker.js     # PWA service worker
│   └── images/
│       ├── plane.png         # Sprite del avión
│       ├── background.jpeg   # Fondo del juego
│       └── icons/            # Iconos PWA
└── package.json
```

## 📱 Progressive Web App (PWA)

### Instalación en Dispositivos

#### iOS (iPhone/iPad)
1. Abrir Safari y navegar a https://flapy-plane.vercel.app/
2. Tocar el botón compartir (cuadrado con flecha)
3. Seleccionar "Agregar a pantalla de inicio"
4. Confirmar instalación

#### Android
1. Abrir Chrome y navegar al juego
2. Aparecerá un banner de instalación automáticamente
3. O tocar menú (3 puntos) → "Instalar aplicación"

#### Desktop (Chrome/Edge)
1. Buscar el ícono de instalación en la barra de direcciones
2. Click en "Instalar Flappy Plane"

## 🎮 Controles del Juego

| Dispositivo | Control | Acción |
|------------|---------|--------|
| **Móvil/Tablet** | Tap en pantalla | Volar hacia arriba |
| **Desktop** | Click / Espaciador | Volar hacia arriba |
| **Todos** | Automático | Gravedad tira hacia abajo |

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run start        # Ejecutar build de producción

# Calidad
npm run lint         # Ejecutar linter
npm run type-check   # Verificar tipos TypeScript
```

## 📈 Configuración de Google Sheets

### Estructura Requerida
La hoja de cálculo debe tener las siguientes columnas:
- **A**: nombre
- **B**: telefono
- **C**: email (clave única)
- **D**: edad
- **E**: puntaje

### Configuración del Script
1. Crear nuevo Google Apps Script
2. Copiar el código del archivo `google-script.gs`
3. Desplegar como Web App
4. Copiar URL y configurar en el proyecto

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

```bash
# Despliegue manual
vercel --prod
```

### Otros Servicios
Compatible con cualquier servicio que soporte Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Digital Ocean App Platform

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es propietario y confidencial. Todos los derechos reservados.

## 👥 Equipo

Desarrollado por **AUTOMA-CL** para FEROUCH

## 📞 Soporte

Para reportar problemas o solicitar features:
- Crear issue en GitHub
- Contactar al equipo de desarrollo

---

**🎮 [Jugar Ahora](https://flapy-plane.vercel.app/) | 📊 [Analytics](https://flapy-plane.vercel.app/analytics) | 💻 [GitHub](https://github.com/AUTOMA-CL/FLAPY-PLANE)**