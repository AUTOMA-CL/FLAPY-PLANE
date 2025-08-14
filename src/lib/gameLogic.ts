import { GameState, Obstacle, GameSettings, PlaneCollisionBox } from '@/types';

// Configuraciones del juego - optimizado para tablets iOS/Android
export const GAME_CONFIG: GameSettings = {
  gravity: 320,      // píxeles/s² - optimizado para control táctil
  jumpVelocity: -220, // píxeles/s - salto más controlado
  obstacleSpeed: 110, // píxeles/s - velocidad más manejable en tablets
  obstacleGap: 160,   // Gap ligeramente mayor para mejor jugabilidad
  planeSize: { width: 90, height: 68 },
  canvasSize: { width: 800, height: 600 } // Se actualiza dinámicamente
};

// Inicializar estado del juego
export function initializeGame(): GameState {
  return {
    score: 0,
    isPlaying: false,
    gameOver: false,
    planePosition: { 
      x: GAME_CONFIG.canvasSize.width * 0.2, 
      y: GAME_CONFIG.canvasSize.height / 2 
    },
    velocity: 0,
    obstacles: [],
    lives: 3,
    isInvulnerable: false,
    invulnerabilityTime: 0,
    showLifeLostMessage: false,
    lifeLostMessageTime: 0
  };
}

// Actualizar estado del juego
export function updateGameState(state: GameState, deltaTime: number): GameState {
  if (!state.isPlaying || state.gameOver) {
    return state;
  }

  const newState = { ...state };

  // Actualizar posición del avión con física
  newState.velocity += GAME_CONFIG.gravity * deltaTime;
  newState.planePosition.y += newState.velocity * deltaTime;

  // Actualizar obstáculos
  newState.obstacles = updateObstacles(newState.obstacles, deltaTime);

  // Generar nuevos obstáculos si es necesario
  if (shouldGenerateObstacle(newState.obstacles)) {
    newState.obstacles.push(generateObstacle());
  }

  // Actualizar invulnerabilidad (deltaTime ya viene multiplicado por 0.01 desde GameCanvas)
  if (newState.isInvulnerable) {
    newState.invulnerabilityTime = Math.max(0, newState.invulnerabilityTime - deltaTime);
    
    if (newState.invulnerabilityTime <= 0) {
      newState.isInvulnerable = false;
      newState.invulnerabilityTime = 0;
    }
  }

  // Actualizar mensaje de vida perdida
  if (newState.showLifeLostMessage) {
    newState.lifeLostMessageTime -= deltaTime;
    if (newState.lifeLostMessageTime <= 0) {
      newState.showLifeLostMessage = false;
      newState.lifeLostMessageTime = 0;
    }
  }

  // Verificar colisiones con obstáculos - SIEMPRE detectar pero solo hacer daño si no es invulnerable
  const hasCollision = checkCollisions(newState);
  
  if (hasCollision && !newState.isInvulnerable) {
    // Solo ejecutar UNA VEZ por frame - aplicar inmediatamente la invulnerabilidad
    newState.lives -= 1;
    
    if (newState.lives <= 0) {
      newState.gameOver = true;
      newState.isPlaying = false;
    } else {
      // Activar invulnerabilidad INMEDIATAMENTE en este frame
      newState.isInvulnerable = true;
      newState.invulnerabilityTime = 2; // 2 segundos exactos
      newState.showLifeLostMessage = true;
      newState.lifeLostMessageTime = 2;
    }
  }
  
  // Límites de pantalla - mantener avión visible SIN perder vida durante invulnerabilidad
  if (newState.planePosition.y < 0) {
    newState.planePosition.y = 0; // No salir por arriba
  } else if (newState.planePosition.y > GAME_CONFIG.canvasSize.height - GAME_CONFIG.planeSize.height) {
    newState.planePosition.y = GAME_CONFIG.canvasSize.height - GAME_CONFIG.planeSize.height; // No salir por abajo
  }

  // Actualizar puntuación
  newState.score += countPassedObstacles(state.obstacles, newState.obstacles);

  return newState;
}

// Verificar colisiones
export function checkCollisions(state: GameState): boolean {
  const planeBox = getPlaneCollisionBox(state.planePosition);
  
  return state.obstacles.some(obstacle => {
    const canvasHeight = GAME_CONFIG.canvasSize.height;
    const gapSize = Math.max(150, canvasHeight * 0.25);
    
    return isColliding(planeBox, {
      x: obstacle.x,
      y: obstacle.y,
      width: obstacle.width,
      height: obstacle.height
    }) || isColliding(planeBox, {
      x: obstacle.x,
      y: obstacle.y + obstacle.height + gapSize,
      width: obstacle.width,
      height: canvasHeight - (obstacle.y + obstacle.height + gapSize)
    });
  });
}

// Obtener caja de colisión del avión (ajustada para mejor jugabilidad)
function getPlaneCollisionBox(position: { x: number; y: number }): PlaneCollisionBox {
  // Hitbox más generosa para mejor experiencia en tablets
  const paddingX = 8; // Más padding horizontal
  const paddingY = 6; // Más padding vertical
  return {
    x: position.x + paddingX,
    y: position.y + paddingY,
    width: GAME_CONFIG.planeSize.width - (paddingX * 2),
    height: GAME_CONFIG.planeSize.height - (paddingY * 2)
  };
}

// Verificar colisión con tolerancia para evitar falsos positivos
function isColliding(rect1: PlaneCollisionBox, rect2: { x: number; y: number; width: number; height: number }): boolean {
  // Agregar pequeña tolerancia para evitar colisiones por 1 pixel
  const tolerance = 2;
  return rect1.x + tolerance < rect2.x + rect2.width &&
         rect1.x + rect1.width - tolerance > rect2.x &&
         rect1.y + tolerance < rect2.y + rect2.height &&
         rect1.y + rect1.height - tolerance > rect2.y;
}

// Actualizar posición de obstáculos
function updateObstacles(obstacles: Obstacle[], deltaTime: number): Obstacle[] {
  return obstacles
    .map(obstacle => ({
      ...obstacle,
      x: obstacle.x - GAME_CONFIG.obstacleSpeed * deltaTime
    }))
    .filter(obstacle => obstacle.x > -obstacle.width);
}

// Determinar si se debe generar un nuevo obstáculo - mejor espaciado
function shouldGenerateObstacle(obstacles: Obstacle[]): boolean {
  if (obstacles.length === 0) return true;
  
  const lastObstacle = obstacles[obstacles.length - 1];
  // Mayor distancia entre obstáculos para tablets
  const minDistance = Math.max(350, GAME_CONFIG.canvasSize.width * 0.4);
  return lastObstacle.x < GAME_CONFIG.canvasSize.width - minDistance;
}

// Generar nuevo obstáculo - optimizado para tablets
function generateObstacle(): Obstacle {
  const canvasHeight = GAME_CONFIG.canvasSize.height;
  const gapSize = Math.max(160, canvasHeight * 0.28); // Gap mayor para tablets
  const minHeight = 60; // Altura mínima mayor
  const maxHeight = canvasHeight - gapSize - minHeight - 20; // Margen extra
  
  // Limitar variación para dificultad más consistente
  const heightVariation = Math.min(maxHeight - minHeight, 200);
  const height = minHeight + Math.random() * heightVariation;
  
  return {
    id: `obstacle_${Date.now()}_${Math.random()}`,
    x: GAME_CONFIG.canvasSize.width,
    y: 0,
    width: 50,
    height: Math.floor(height), // Redondear para evitar subpixel rendering
    passed: false
  };
}

// Contar obstáculos pasados para incrementar puntuación
function countPassedObstacles(oldObstacles: Obstacle[], newObstacles: Obstacle[]): number {
  let score = 0;
  
  newObstacles.forEach(newObstacle => {
    const oldObstacle = oldObstacles.find(o => o.id === newObstacle.id);
    if (oldObstacle && !oldObstacle.passed && 
        newObstacle.x + newObstacle.width < GAME_CONFIG.canvasSize.width * 0.2) {
      newObstacle.passed = true;
      score += 1;
    }
  });
  
  return score;
}

// Función para hacer saltar el avión
export function jump(state: GameState): GameState {
  if (state.gameOver) return state;
  
  return {
    ...state,
    velocity: GAME_CONFIG.jumpVelocity,
    isPlaying: true
  };
}

// Reiniciar juego
export function resetGame(): GameState {
  return initializeGame();
}