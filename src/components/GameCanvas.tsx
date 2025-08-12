'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { GameState } from '@/types';
import { 
  initializeGame, 
  updateGameState, 
  jump, 
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
  
  // Para animaciones
  const scoreAnimationRef = useRef<{ show: boolean; time: number }>({ show: false, time: 0 });
  const lastScoreRef = useRef(0);

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
    backgroundImg.src = `/images/background.jpeg?v=${Date.now()}`;
    imagesRef.current.background = backgroundImg;

    return () => {
      // Limpiar referencias
      imagesRef.current = {};
    };
  }, []);

  // Función de renderizado
  const render = useCallback((ctx: CanvasRenderingContext2D, state: GameState) => {
    const canvasWidth = GAME_CONFIG.canvasSize.width;
    const canvasHeight = GAME_CONFIG.canvasSize.height;
    
    // Detectar cambio de score para animación
    if (state.score > lastScoreRef.current) {
      scoreAnimationRef.current = { show: true, time: performance.now() };
      lastScoreRef.current = state.score;
    }

    // SIEMPRE rellenar toda la pantalla primero con color de fondo
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Luego dibujar la imagen encima si está disponible
    if (imagesRef.current.background && imagesRef.current.background.complete) {
      const img = imagesRef.current.background;
      
      // Calcular escalado para cubrir TODO el viewport (cover behavior)
      const scaleX = canvasWidth / img.naturalWidth;
      const scaleY = canvasHeight / img.naturalHeight;
      const scale = Math.max(scaleX, scaleY);
      
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      
      // Centrar la imagen escalada
      const offsetX = (canvasWidth - scaledWidth) / 2;
      const offsetY = (canvasHeight - scaledHeight) / 2;
      
      // Dibujar la imagen escalada encima del fondo
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
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

    // Dibujar avión (con efecto de invulnerabilidad)
    if (imagesRef.current.plane) {
      const angle = Math.min(state.velocity * 0.05, Math.PI / 6);
      
      ctx.save();
      ctx.translate(
        state.planePosition.x + GAME_CONFIG.planeSize.width / 2,
        state.planePosition.y + GAME_CONFIG.planeSize.height / 2
      );
      ctx.rotate(angle);
      
      // Efecto de parpadeo si está invulnerable
      if (state.isInvulnerable) {
        const blinkRate = Math.sin(performance.now() * 0.01) > 0;
        ctx.globalAlpha = blinkRate ? 0.3 : 1.0;
      }
      
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
      ctx.save();
      if (state.isInvulnerable) {
        const blinkRate = Math.sin(performance.now() * 0.01) > 0;
        ctx.globalAlpha = blinkRate ? 0.3 : 1.0;
      }
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(
        state.planePosition.x,
        state.planePosition.y,
        GAME_CONFIG.planeSize.width,
        GAME_CONFIG.planeSize.height
      );
      ctx.restore();
    }

    // Animación de score cuando aumenta
    if (scoreAnimationRef.current.show) {
      const elapsed = performance.now() - scoreAnimationRef.current.time;
      if (elapsed < 800) { // 800ms de duración
        const progress = elapsed / 800;
        const opacity = 1 - progress;
        const scale = 1 + progress * 0.5;
        const offsetY = -progress * 50;
        
        ctx.save();
        ctx.translate(canvasWidth / 2, 120);
        ctx.scale(scale, scale);
        ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`+1 PUNTO!`, 0, offsetY);
        ctx.restore();
      } else {
        scoreAnimationRef.current.show = false;
      }
    }

    // Mostrar vidas restantes (durante el juego) - diseño limpio y elegante
    if (state.isPlaying && !state.gameOver && !state.showLifeLostMessage) {
      // Posición en la esquina superior derecha
      const livesX = canvasWidth - 140;
      const livesY = 20;
      
      // Fondo sutil redondeado
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(livesX, livesY, 120, 40, 20);
      ctx.fill();
      
      // Sombra sutil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.roundRect(livesX + 2, livesY + 2, 120, 40, 20);
      ctx.fill();
      
      // Fondo principal
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect(livesX, livesY, 120, 40, 20);
      ctx.fill();
      
      // Borde elegante
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(livesX, livesY, 120, 40, 20);
      ctx.stroke();
      
      // Dibujar corazones elegantes
      for (let i = 0; i < 3; i++) {
        const heartX = livesX + 20 + (i * 28);
        const heartY = livesY + 20;
        const size = 8;
        
        if (i < state.lives) {
          // Corazón activo - rojo brillante
          ctx.fillStyle = '#ff4757';
        } else {
          // Corazón perdido - gris claro
          ctx.fillStyle = '#ddd';
        }
        
        // Dibujar corazón simple con forma de círculos y triángulo
        ctx.beginPath();
        ctx.arc(heartX - size/2, heartY - size/4, size/2, 0, Math.PI * 2);
        ctx.arc(heartX + size/2, heartY - size/4, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(heartX - size, heartY);
        ctx.lineTo(heartX, heartY + size);
        ctx.lineTo(heartX + size, heartY);
        ctx.closePath();
        ctx.fill();
      }
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
      
      ctx.font = '18px Arial';
      ctx.fillText(
        'Tienes 3 vidas - Evita los obstáculos', 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2 + 40
      );
    }

    // Mensaje temporal de vida perdida (solo si aún hay vidas)
    if (state.showLifeLostMessage && !state.gameOver) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONFIG.canvasSize.width, GAME_CONFIG.canvasSize.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Vida Perdida!', GAME_CONFIG.canvasSize.width / 2, GAME_CONFIG.canvasSize.height / 2 - 40);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(
        `Vidas restantes: ${state.lives}`, 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2
      );
      
      ctx.font = '18px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(
        '¡Continúa volando!', 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2 + 40
      );
    }

    // Pantalla de Game Over (solo cuando se agotan las vidas)
    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONFIG.canvasSize.width, GAME_CONFIG.canvasSize.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Juego Terminado!', GAME_CONFIG.canvasSize.width / 2, GAME_CONFIG.canvasSize.height / 2 - 60);
      
      ctx.font = '28px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(
        `Tu puntuación: ${state.score}`, 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2 - 10
      );
      
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(
        '¡Gracias por jugar!', 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2 + 40
      );
      
      ctx.font = '16px Arial';
      ctx.fillStyle = '#87CEEB';
      ctx.fillText(
        'Toca la pantalla para que otro jugador pueda jugar', 
        GAME_CONFIG.canvasSize.width / 2, 
        GAME_CONFIG.canvasSize.height / 2 + 80
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
      // VOLVER AL MENU DE REGISTRO para capturar nuevos datos
      window.location.href = '/';
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
      // Obtener dimensiones reales del viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      
      // Configurar canvas para alta resolución
      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      
      // Establecer tamaño CSS
      canvas.style.width = viewportWidth + 'px';
      canvas.style.height = viewportHeight + 'px';
      
      // Actualizar configuración del juego
      GAME_CONFIG.canvasSize.width = viewportWidth;
      GAME_CONFIG.canvasSize.height = viewportHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      console.log('Canvas resized:', viewportWidth, 'x', viewportHeight, 'DPR:', dpr);
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