import { GameState, Obstacle, GameSettings, PlaneCollisionBox } from '@/types';

// Configuraciones del juego - valores por defecto que se actualizan dinámicamente
export const GAME_CONFIG: GameSettings = {
  gravity: 2.0,
  jumpVelocity: -9,
  obstacleSpeed: 5,
  obstacleGap: 150,
  planeSize: { width: 90, height: 68 },
  canvasSize: { width: 800, height: 600 } // Se actualiza dinámicamente en el cliente
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

  // Actualizar invulnerabilidad
  if (newState.isInvulnerable) {
    newState.invulnerabilityTime -= deltaTime;
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

  // Verificar colisiones con obstáculos (solo si no es invulnerable)
  if (!newState.isInvulnerable && checkCollisions(newState)) {
    // Colisión con obstáculo: SOLO parpadeo, avión sigue en su posición
    const collisionState = handleCollision(newState);
    Object.assign(newState, collisionState);
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

// Obtener caja de colisión del avión (ajustada a la forma real)
function getPlaneCollisionBox(position: { x: number; y: number }): PlaneCollisionBox {
  // Reducir la caja de colisión para ser más generoso con el jugador
  const padding = 4;
  return {
    x: position.x + padding,
    y: position.y + padding,
    width: GAME_CONFIG.planeSize.width - (padding * 2),
    height: GAME_CONFIG.planeSize.height - (padding * 2)
  };
}

// Verificar colisión entre dos rectángulos
function isColliding(rect1: PlaneCollisionBox, rect2: { x: number; y: number; width: number; height: number }): boolean {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
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

// Determinar si se debe generar un nuevo obstáculo
function shouldGenerateObstacle(obstacles: Obstacle[]): boolean {
  if (obstacles.length === 0) return true;
  
  const lastObstacle = obstacles[obstacles.length - 1];
  return lastObstacle.x < GAME_CONFIG.canvasSize.width - 300;
}

// Generar nuevo obstáculo - adaptativo al viewport
function generateObstacle(): Obstacle {
  const canvasHeight = GAME_CONFIG.canvasSize.height;
  const gapSize = Math.max(150, canvasHeight * 0.25); // Gap mínimo 150px o 25% de altura
  const minHeight = 50;
  const maxHeight = canvasHeight - gapSize - minHeight;
  const height = minHeight + Math.random() * (maxHeight - minHeight);
  
  return {
    id: `obstacle_${Date.now()}_${Math.random()}`,
    x: GAME_CONFIG.canvasSize.width,
    y: 0,
    width: 50,
    height: height,
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

// Manejar colisión - NUEVA LÓGICA: avión JAMÁS se mueve, solo parpadeo
function handleCollision(state: GameState): GameState {
  const newState = { ...state };
  newState.lives -= 1;
  
  if (newState.lives <= 0) {
    newState.gameOver = true;
    newState.isPlaying = false;
  } else {
    // NO TOCAR POSICIÓN X ni Y - El avión sigue exactamente donde está
    // NO TOCAR VELOCIDAD - Mantiene su momentum natural
    // SOLO activar parpadeo de invulnerabilidad
    newState.isInvulnerable = true;
    newState.invulnerabilityTime = 2; // 2 segundos de parpadeo
    
    // Mostrar mensaje de vida perdida temporalmente  
    newState.showLifeLostMessage = true;
    newState.lifeLostMessageTime = 2;
  }
  
  return newState;
}

// Reiniciar juego
export function resetGame(): GameState {
  return initializeGame();
}