# 🔄 GUÍA COMPLETA DE BACKUP Y RESTAURACIÓN - FLAPPY PLANE

## 📌 PARA LA IA: INSTRUCCIONES DE LECTURA
**SI ESTÁS LEYENDO ESTO**, el usuario necesita ayuda con el sistema de backup del proyecto Flappy Plane. Lee este documento completo para entender cómo está estructurado el sistema de versiones y cómo restaurar el proyecto a un estado funcional.

---

## 🎯 RESUMEN RÁPIDO PARA LA IA

El proyecto usa Git + GitHub como sistema de backup. Cada versión estable tiene un **tag** que funciona como punto de restauración. La versión actual estable es **v2.0.0-stable**.

**Repositorio:** https://github.com/AUTOMA-CL/FLAPY-PLANE.git  
**Carpeta del proyecto Next.js:** `flappy-plane/`  
**Versión estable actual:** v2.0.0-stable  

---

## 📦 ESTRUCTURA DEL SISTEMA DE BACKUP

### 1. **Backups Automáticos en GitHub**
Cada vez que se hace push, GitHub guarda automáticamente:
- Todo el código fuente
- Historial completo de cambios
- Todos los archivos del proyecto

### 2. **Sistema de Tags (Puntos de Restauración)**
Los tags son como "fotografías" del proyecto en momentos específicos:
```
v2.0.0-stable → Versión estable actual (100% funcional)
v2.1.0-feature → Versión con nueva característica
v2.0.1-fix → Versión con corrección de bugs
```

### 3. **Archivos de Documentación**
- `CHANGELOG.md` - Historial de todos los cambios
- `VERSION-INFO.md` - Estado actual del proyecto
- `CLAUDE.md` - Instrucciones del proyecto
- `BACKUP-GUIDE.md` - Este archivo

---

## 🚨 CÓMO RESTAURAR DESDE BACKUP

### CASO 1: Restaurar a versión estable conocida (v2.0.0-stable)

```bash
# Paso 1: Clonar el repositorio si no lo tienes
git clone https://github.com/AUTOMA-CL/FLAPY-PLANE.git
cd "Flappy Plane"

# Paso 2: Ver todas las versiones disponibles
git tag -l

# Paso 3: Restaurar a la versión estable
git checkout v2.0.0-stable

# Paso 4: Instalar dependencias
cd flappy-plane
npm install

# Paso 5: Verificar que funciona
npm run dev
```

### CASO 2: El proyecto actual tiene errores y necesitas volver atrás

```bash
# Opción A: Descartar todos los cambios locales y volver a la versión del repositorio
git fetch origin
git reset --hard origin/main

# Opción B: Volver a una versión específica
git checkout v2.0.0-stable

# Opción C: Si nada funciona, borrar todo y empezar de nuevo
cd ..
rm -rf "Flappy Plane"
git clone https://github.com/AUTOMA-CL/FLAPY-PLANE.git
cd "Flappy Plane"
git checkout v2.0.0-stable
cd flappy-plane
npm install
```

### CASO 3: Descargar backup sin Git

1. Ir a: https://github.com/AUTOMA-CL/FLAPY-PLANE/releases
2. Buscar "v2.0.0 Estable"
3. Descargar "Source code (zip)"
4. Descomprimir
5. Abrir terminal en `flappy-plane/`
6. Ejecutar:
```bash
npm install
npm run dev
```

---

## 🔍 CÓMO VERIFICAR QUÉ VERSIÓN TIENES

```bash
# Ver la versión actual del código
git describe --tags

# Ver en qué commit estás
git log --oneline -1

# Ver la versión en package.json
cat flappy-plane/package.json | grep version

# Ver el estado del repositorio
git status
```

---

## 📝 PARA LA IA: DIAGNÓSTICO DE PROBLEMAS

### Si el usuario dice "no funciona" o "tengo errores":

1. **Primero verificar la versión actual:**
```bash
git describe --tags
cat flappy-plane/package.json | grep version
```

2. **Verificar si hay cambios sin guardar:**
```bash
git status
git diff
```

3. **Si hay errores de compilación:**
```bash
cd flappy-plane
rm -rf node_modules package-lock.json
npm install
npm run build
```

4. **Si el error persiste, restaurar versión estable:**
```bash
git checkout v2.0.0-stable
cd flappy-plane
npm install
npm run dev
```

---

## 🏷️ VERSIONES DISPONIBLES Y SU ESTADO

### v2.0.0-stable (RECOMENDADA)
- **Estado:** ✅ 100% Funcional
- **Fecha:** 2025-01-14
- **Características:**
  - Juego completo funcionando
  - Sistema de registro operativo
  - Desplegado en Vercel sin errores
  - Sin warnings críticos

### Cómo ver todas las versiones:
```bash
# Listar todos los tags
git tag -l

# Ver información de un tag específico
git show v2.0.0-stable
```

---

## 💾 CREAR NUEVO BACKUP

### Para la IA: Si el usuario pide crear un nuevo backup después de cambios:

```bash
# 1. Asegurarse de que todo está commiteado
git add -A
git commit -m "Descripción de los cambios"

# 2. Actualizar versión en package.json
# Cambiar "version": "2.0.0" a "2.1.0" o la que corresponda

# 3. Actualizar CHANGELOG.md con los nuevos cambios

# 4. Commit de la nueva versión
git add package.json CHANGELOG.md
git commit -m "Release v2.1.0: descripción"

# 5. Crear el tag
git tag -a v2.1.0-stable -m "Versión 2.1.0 con [describir cambios]"

# 6. Subir todo a GitHub
git push origin main
git push origin v2.1.0-stable
```

---

## 🆘 COMANDOS DE EMERGENCIA

### Si TODO falla, ejecutar en orden:

```bash
# 1. Guardar trabajo actual (si hay algo que salvar)
git stash

# 2. Limpiar todo
git clean -fd
git reset --hard

# 3. Actualizar desde GitHub
git fetch origin

# 4. Ir a la versión estable
git checkout v2.0.0-stable

# 5. Reinstalar dependencias
cd flappy-plane
rm -rf node_modules package-lock.json
npm install

# 6. Probar
npm run dev
```

---

## 📋 CHECKLIST PARA LA IA

Cuando el usuario pida ayuda con backup/restauración:

- [ ] Verificar versión actual con `git describe --tags`
- [ ] Revisar si hay cambios sin guardar con `git status`
- [ ] Identificar el problema específico (error de compilación, página en blanco, etc.)
- [ ] Intentar solución simple primero (npm install, npm run build)
- [ ] Si no funciona, restaurar a v2.0.0-stable
- [ ] Verificar que el proyecto corre con `npm run dev`
- [ ] Confirmar con el usuario que todo funciona

---

## 🔗 RECURSOS IMPORTANTES

- **Repositorio:** https://github.com/AUTOMA-CL/FLAPY-PLANE
- **Releases:** https://github.com/AUTOMA-CL/FLAPY-PLANE/releases
- **Commits:** https://github.com/AUTOMA-CL/FLAPY-PLANE/commits/main
- **Tags:** https://github.com/AUTOMA-CL/FLAPY-PLANE/tags

---

## 📌 NOTA FINAL PARA LA IA

Si el usuario está confundido o frustrado:
1. Ofrece restaurar a la versión v2.0.0-stable inmediatamente
2. Esta versión está 100% garantizada que funciona
3. Después de restaurar, ayuda a reimplementar cualquier cambio perdido
4. Recuerda crear un nuevo tag después de cualquier cambio importante

**VERSIÓN SEGURA PARA RESTAURAR:** v2.0.0-stable

---

*Documento creado para asegurar que cualquier IA futura pueda ayudar con el sistema de backup del proyecto Flappy Plane.*