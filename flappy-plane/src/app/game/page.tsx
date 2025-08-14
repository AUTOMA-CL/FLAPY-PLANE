'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameCanvas from '@/components/GameCanvas';
import GameUI from '@/components/GameUI';
import { User } from '@/types';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

// Función helper para esperar
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función mejorada para actualizar score con reintentos
const updateScoreConReintentos = async (email: string, puntaje: number, intentos = 3): Promise<{ok: boolean, error?: string}> => {
  // Agregar delay aleatorio inicial (0-500ms) para evitar colisiones
  await wait(Math.random() * 500);
  
  for (let i = 0; i < intentos; i++) {
    // Declarar timeoutId fuera del try para poder limpiarlo en finally
    let timeoutId: NodeJS.Timeout | undefined;
    
    try {
      const params = new URLSearchParams();
      params.append('action', 'updateScore');
      params.append('email', email);
      params.append('puntaje', puntaje.toString());

      // Crear un AbortController para el timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        signal: controller.signal
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.log(`Intento ${i + 1} de actualizar score falló:`, error instanceof Error ? error.message : 'Error desconocido');
      
      // Si es el último intento, retornar error
      if (i === intentos - 1) {
        console.error('❌ No se pudo actualizar el score después de 3 intentos');
        return { ok: false, error: 'Error al actualizar puntuación después de varios intentos' };
      }
      
      // Esperar con exponential backoff (1s, 2s, 4s)
      const tiempoEspera = 1000 * Math.pow(2, i);
      console.log(`Esperando ${tiempoEspera}ms antes de reintentar actualización de score...`);
      await wait(tiempoEspera);
    } finally {
      // Siempre limpiar el timeout, incluso si hay error
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
  
  return { ok: false, error: 'Error inesperado' };
};

// Función para guardar score en cola si falla
const guardarScoreEnCola = (email: string, score: number) => {
  const scoresPendientes = JSON.parse(localStorage.getItem('scoresPendientes') || '[]');
  scoresPendientes.push({
    email,
    score,
    timestamp: Date.now(),
    intentos: 0
  });
  localStorage.setItem('scoresPendientes', JSON.stringify(scoresPendientes));
  console.log('📋 Score guardado localmente para envío posterior');
};

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cargar usuario actual del sessionStorage
  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user: User = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/');
      }
    } else {
      // Si no hay usuario, redirigir al registro
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  // Aplicar clase CSS para ocultar scroll en página del juego
  useEffect(() => {
    document.body.classList.add('game-page');
    return () => {
      document.body.classList.remove('game-page');
    };
  }, []);

  // Manejar cambios de puntuación
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  // Manejar game over - NO BLOQUEA EL JUEGO
  const handleGameOver = async (finalScore: number) => {
    if (currentUser && currentUser.email) {
      // Actualizar usuario en sessionStorage INMEDIATAMENTE
      const updatedUser = {
        ...currentUser,
        bestScore: Math.max(currentUser.bestScore || 0, finalScore),
        totalGames: (currentUser.totalGames || 0) + 1
      };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      // Enviar score a Google Sheets EN SEGUNDO PLANO
      // No bloqueamos el juego esperando la respuesta
      updateScoreEnSegundoPlano(currentUser.email, finalScore);
    }
  };

  // Función para actualizar score en segundo plano
  const updateScoreEnSegundoPlano = async (email: string, finalScore: number) => {
    try {
      const result = await updateScoreConReintentos(email, finalScore);
      
      if (result.ok) {
        console.log('✅ Score actualizado en Google Sheets:', finalScore);
      } else {
        console.error('❌ Error actualizando score:', result.error);
        // Guardar en cola para reintento posterior
        guardarScoreEnCola(email, finalScore);
      }
    } catch (error) {
      console.error('❌ Error crítico actualizando score:', error);
      // Guardar en cola para reintento posterior
      guardarScoreEnCola(email, finalScore);
    }
  };

  // Volver al inicio
  const handleBackToHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="w-full h-screen relative bg-black overflow-hidden">
      {/* Canvas del juego - FULLSCREEN sin límites */}
      <div className="absolute inset-0">
        <GameCanvas 
          onScoreChange={handleScoreChange}
          onGameOver={handleGameOver}
        />
      </div>

      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <GameUI 
          score={score}
          userName={currentUser?.name}
          onBackToHome={handleBackToHome}
        />
      </div>

      {/* Información adicional del usuario - diseño bonito */}
      {currentUser && (
        <div className="absolute bottom-4 right-4 z-20">
          <div 
            className="text-sm font-bold mb-1"
            style={{
              color: '#87CEEB',
              textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
            }}
          >
            MEJOR: {currentUser.bestScore || 0}
          </div>
          <div 
            className="text-sm font-bold"
            style={{
              color: '#87CEEB',
              textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
            }}
          >
            JUEGOS: {currentUser.totalGames || 0}
          </div>
        </div>
      )}
    </main>
  );
}