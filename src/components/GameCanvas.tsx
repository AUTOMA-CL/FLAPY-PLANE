'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { GameState } from '@/types';
import { 
  initializeGame, 
  updateGameState, 
  jump, 
  resetGame, 
  GAME_CONFIG 
} from '@/lib/gameLogic';

interface GameCanvasProps {
  onScoreChange?: (score: number) => void;
  onGameOver?: (score: number) => void;
}

export default function GameCanvas({ onScoreChange, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>(initializeGame());
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const imagesRef = useRef<{ plane?: HTMLImageElement; background?: HTMLImageElement }>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cargar imágenes
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = 2;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    // Cargar imagen del avión
    const planeImg = new Image();
    planeImg.onload = onImageLoad;
    planeImg.src = '/images/plane.png';
    imagesRef.current.plane = planeImg;

    // Cargar imagen de fondo
    const backgroundImg = new Image();
    backgroundImg.onload = onImageLoad;
    backgroundImg.src = '/images/background.jpeg';
    imagesRef.current.background = backgroundImg;

    return () => {
      // Limpiar referencias
      imagesRef.current = {};
    };
  }, []);

  // Función de renderizado
  const render = useCallback((ctx: CanvasRenderingContext2D, state: GameState) => {
    // Limpiar canvas
    ctx.clearRect(0, 0, GAME_CONFIG.canvasSize.width, GAME_CONFIG.canvasSize.height);

    // Dibujar fondo adaptativo al viewport
    if (imagesRef.current.background) {
      const img = imagesRef.current.background;
      const canvasWidth = GAME_CONFIG.canvasSize.width;
      const canvasHeight = GAME_CONFIG.canvasSize.height;
      
      // Calcular escalado para cubrir todo el viewport manteniendo aspecto
      const scaleX = canvasWidth / img.naturalWidth;
      const scaleY = canvasHeight / img.naturalHeight;
      const scale = Math.max(scaleX, scaleY); // cover, no contain
      
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      
      // Centrar la imagen
      const offsetX = (canvasWidth - scaledWidth) / 2;
      const offsetY = (canvasHeight - scaledHeight) / 2;
      
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    } else {
      // Fondo fallback
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvasSize.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98FB98');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_CONFIG.canvasSize.width, GAME_CONFIG.canvasSize.height);
    }

    // Dibujar obstáculos con gap dinámico
    state.obstacles.forEach(obstacle => {
      const canvasHeight = GAME_CONFIG.canvasSize.height;
      const gapSize = Math.max(150, canvasHeight * 0.25);
      
      ctx.fillStyle = '#8B4513';
      // Obstáculo superior
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Obstáculo inferior
      const bottomY = obstacle.y + obstacle.height + gapSize;
      const bottomHeight = canvasHeight - bottomY;
      ctx.fillRect(obstacle.x, bottomY, obstacle.width, bottomHeight);
      
      // Bordes de los obstáculos
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.strokeRect(obstacle.x, bottomY, obstacle.width, bottomHeight);
    });

    // Dibujar avión
    if (imagesRef.current.plane) {
      const angle = Math.min(state.velocity * 0.05, Math.PI / 6);
      
      ctx.save();
      ctx.translate(
        state.planePosition.x + GAME_CONFIG.planeSize.width / 2,
        state.planePosition.y + GAME_CONFIG.planeSize.height / 2
      );
      ctx.rotate(angle);
      ctx.drawImage(
        imagesRef.current.plane,
        -GAME_CONFIG.planeSize.width / 2,
        -GAME_CONFIG.planeSize.height / 2,
        GAME_CONFIG.planeSize.width,
        GAME_CONFIG.planeSize.height
      );
      ctx.restore();
    } else {
      // Avión fallback
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(
        state.planePosition.x,
        state.planePosition.y,
        GAME_CONFIG.planeSize.width,
        GAME_CONFIG.planeSize.height
      );
    }

    // Pantalla de inicio
    if (!state.isPlaying && !state.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONFIG.canvasSize.width, GAME_CONFIG.canvasSize.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Toca para comenzar', 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2
      );
    }

    // Pantalla de Game Over
    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONFIG.canvasSize.width, GAME_CONFIG.canvasSize.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', GAME_CONFIG.canvasSize.width / 2, GAME_CONFIG.canvasSize.height / 2 - 50);
      
      ctx.font = '24px Arial';
      ctx.fillText(
        `Puntuación: ${state.score}`, 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2
      );
      
      ctx.font = '18px Arial';
      ctx.fillText(
        'Toca para jugar otra vez', 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2 + 50
      );
    }
  }, []);

  // Loop principal del juego
  const gameLoop = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!ctx || !imagesLoaded) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Actualizar estado del juego
    const oldScore = gameStateRef.current.score;
    gameStateRef.current = updateGameState(gameStateRef.current, deltaTime * 0.01);

    // Callbacks
    if (gameStateRef.current.score !== oldScore && onScoreChange) {
      onScoreChange(gameStateRef.current.score);
    }

    if (gameStateRef.current.gameOver && onGameOver) {
      onGameOver(gameStateRef.current.score);
    }

    // Renderizar
    render(ctx, gameStateRef.current);

    // Continuar loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [render, imagesLoaded, onScoreChange, onGameOver]);

  // Manejar touch/click
  const handleInteraction = useCallback(() => {
    if (gameStateRef.current.gameOver) {
      // Reiniciar juego
      gameStateRef.current = resetGame();
    } else {
      // Saltar
      gameStateRef.current = jump(gameStateRef.current);
    }
  }, []);

  // Configurar eventos y loop del juego
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    // Configurar canvas para viewport completo
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Actualizar configuración del juego dinámicamente
      GAME_CONFIG.canvasSize.width = window.innerWidth;
      GAME_CONFIG.canvasSize.height = window.innerHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Eventos de interacción
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleInteraction();
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      handleInteraction();
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInteraction();
      }
    };

    // Agregar event listeners
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);

    // Iniciar game loop
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameLoop, handleInteraction, imagesLoaded]);

  if (!imagesLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Cargando juego...</div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="cursor-pointer focus:outline-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        imageRendering: 'auto'
      }}
      tabIndex={0}
    />
  );
}