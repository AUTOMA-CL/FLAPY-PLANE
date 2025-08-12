'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameCanvas from '@/components/GameCanvas';
import GameUI from '@/components/GameUI';
import { User } from '@/types';
// import { updateUserScore } from '@/lib/database'; // Solo servidor

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

  // Manejar game over
  const handleGameOver = async (finalScore: number) => {
    if (currentUser) {
      try {
        // Actualizar puntuación via API
        const response = await fetch('/api/users/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, score: finalScore })
        });

        if (response.ok) {
          // Actualizar usuario en sessionStorage
          const updatedUser = {
            ...currentUser,
            bestScore: Math.max(currentUser.bestScore || 0, finalScore),
            totalGames: (currentUser.totalGames || 0) + 1
          };
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
      } catch (error) {
        console.error('Error updating user score:', error);
      }
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