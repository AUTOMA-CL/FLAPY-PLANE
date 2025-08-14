# 🎮 FLAPPY PLANE GAME - DOCUMENTACIÓN PRINCIPAL

## 📌 INICIO RÁPIDO PARA IA
**Si eres una IA leyendo esto**, aquí está todo lo que necesitas saber:

### Estado Actual
- **Versión:** 2.0.0-stable ✅ FUNCIONAL
- **Repositorio:** https://github.com/AUTOMA-CL/FLAPY-PLANE
- **Carpeta proyecto:** `flappy-plane/`
- **URL Producción:** Desplegado en Vercel

### Archivos Clave de Documentación
1. **CLAUDE.md** - Instrucciones técnicas completas del proyecto
2. **VERSION-INFO.md** - Estado actual y notas de continuidad
3. **BACKUP-GUIDE.md** - Cómo restaurar si hay problemas
4. **CHANGELOG.md** - Historial de cambios

---

## 🚀 PROYECTO OVERVIEW

### ¿Qué es?
Juego web tipo Flappy Bird con temática de avión, optimizado para dispositivos móviles y tablets, con sistema de registro de usuarios.

### Stack Tecnológico
- **Framework:** Next.js 15.4.6
- **Runtime:** React 19.1.0
- **Lenguaje:** TypeScript 5.x
- **Estilos:** Tailwind CSS 4.x
- **Base de datos:** JSON local (temporal)
- **Hosting:** Vercel

### Características Implementadas
✅ Juego completo con física realista  
✅ Sistema de registro (nombre, teléfono, email, edad)  
✅ Detección precisa de colisiones con forma del avión  
✅ Touch controls optimizados  
✅ Sistema de puntuación con persistencia  
✅ Responsive design (320px - 1024px)  

---

## 💻 COMANDOS ESENCIALES

```bash
# Clonar proyecto
git clone https://github.com/AUTOMA-CL/FLAPY-PLANE.git
cd "Flappy Plane"

# Desarrollo
cd flappy-plane
npm install
npm run dev        # http://localhost:3000

# Build y testing
npm run build      # Compilar producción
npm run lint       # Verificar código
npm run start      # Ejecutar build local

# Git y versiones
git tag -l                           # Ver todas las versiones
git checkout v2.0.0-stable          # Ir a versión estable
git status                          # Estado actual
```

---

## 📂 ESTRUCTURA DEL PROYECTO

```
Flappy-Plane/
├── 📄 README.md (este archivo)
├── 📄 CLAUDE.md (instrucciones técnicas)
├── 📄 VERSION-INFO.md (continuidad)
├── 📄 BACKUP-GUIDE.md (restauración)
├── 📄 CHANGELOG.md (historial)
│
└── flappy-plane/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx (registro)
    │   │   ├── game/page.tsx (juego)
    │   │   └── api/users/ (endpoints)
    │   ├── components/
    │   │   ├── GameCanvas.tsx ⭐
    │   │   └── RegistrationForm.tsx
    │   └── lib/
    │       ├── gameLogic.ts ⭐
    │       └── database.ts
    ├── public/images/
    │   ├── plane.png (avión)
    │   └── background.jpeg (fondo)
    └── data/users.json (BD local)
```

---

## 🔧 PARA CONTINUAR EL DESARROLLO

### Si es tu primera vez:
1. Lee **CLAUDE.md** para entender las especificaciones
2. Revisa **VERSION-INFO.md** para el estado actual
3. Mira **CHANGELOG.md** para el historial

### Si retomas después de un tiempo:
1. Ejecuta `git pull origin main` para actualizar
2. Revisa **VERSION-INFO.md** para recordar el estado
3. Si hay problemas, usa **BACKUP-GUIDE.md**

### Para hacer cambios:
1. Crear branch: `git checkout -b feature/nombre`
2. Hacer cambios y probar
3. Actualizar versión en `package.json`
4. Actualizar **CHANGELOG.md**
5. Commit, push y crear PR

---

## 🎯 ROADMAP FUTURO

### Próximas Features (Prioridad Alta)
- [ ] Integración Excel/Google Sheets
- [ ] Sistema de ranking
- [ ] Sonidos y música
- [ ] PWA offline

### Ver más en VERSION-INFO.md

---

## 🆘 AYUDA RÁPIDA

### El juego no compila
```bash
cd flappy-plane
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Necesito volver a versión estable
```bash
git checkout v2.0.0-stable
cd flappy-plane
npm install
```

### Más problemas?
Ver **BACKUP-GUIDE.md** para soluciones completas

---

## 📝 NOTAS IMPORTANTES

- **NO** modificar archivos en `data/` manualmente
- **NO** cambiar configuración de Vercel sin probar
- **SIEMPRE** probar en local antes de hacer push
- **SIEMPRE** actualizar CHANGELOG.md con cambios importantes

---

*Última actualización: 2025-01-14 | Versión 2.0.0-stable*