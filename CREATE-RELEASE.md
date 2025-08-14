# 📦 CÓMO CREAR EL RELEASE EN GITHUB

## Opción 1: Desde la Web de GitHub

1. Ve a: https://github.com/AUTOMA-CL/FLAPY-PLANE/releases/new
2. En "Choose a tag" selecciona: **v2.0.0-stable**
3. Release title: **v2.0.0 Estable - Flappy Plane Game**
4. Copia y pega esta descripción:

---

# 🎮 Flappy Plane Game - Versión 2.0.0 Estable

## ✅ Estado: PRODUCCIÓN READY

### 🚀 Características Principales
- Juego tipo Flappy Bird con temática de avión completamente funcional
- Sistema de registro de usuarios (nombre, teléfono, email, edad)
- Motor de física realista con detección precisa de colisiones
- Interfaz optimizada para dispositivos móviles y tablets
- Sistema de puntuación con persistencia local
- Desplegado exitosamente en Vercel

### 📦 Stack Tecnológico
- Next.js 15.4.6
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x

### 🔧 Mejoras en esta versión
- Configuración de Vercel corregida para proyecto en subcarpeta
- Eliminados todos los warnings de ESLint
- Estructura de archivos optimizada
- Sistema de versionado implementado
- Documentación completa agregada

### 📋 Instalación
```bash
git clone https://github.com/AUTOMA-CL/FLAPY-PLANE.git
cd "Flappy Plane/flappy-plane"
npm install
npm run dev
```

### 📝 Documentación
- Ver `CHANGELOG.md` para historial completo
- Ver `VERSION-INFO.md` para información de continuidad
- Ver `CLAUDE.md` para instrucciones del proyecto

### 💾 Este release sirve como punto de restauración estable

---

5. Marca la casilla: **Set as the latest release**
6. Click en **Publish release**

## Opción 2: Instalar GitHub CLI y ejecutar

```bash
# Instalar GitHub CLI (Windows)
winget install --id GitHub.cli

# O descargar desde: https://cli.github.com/

# Luego ejecutar:
gh auth login
gh release create v2.0.0-stable --title "v2.0.0 Estable - Flappy Plane Game" --notes-file CREATE-RELEASE.md
```

## 🔄 Para futuras versiones

Cuando hagas cambios importantes:

1. Actualiza `package.json` con nueva versión
2. Actualiza `CHANGELOG.md` con los cambios
3. Actualiza `VERSION-INFO.md` con el nuevo estado
4. Commit y push
5. Crear nuevo tag: `git tag -a v2.1.0-descripcion -m "mensaje"`
6. Push del tag: `git push origin v2.1.0-descripcion`
7. Crear release en GitHub

## 📌 Tags ya creados
- **v2.0.0-stable** (actual) - Versión estable completa