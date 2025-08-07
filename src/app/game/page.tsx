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
    <main className="w-full h-screen relative bg-black overflow-hidden flex items-center justify-center">
      {/* Canvas del juego - responsive container */}
      <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center">
        <div className="relative w-full aspect-[4/3] max-h-[90vh] max-w-[90vw]">
          <GameCanvas 
            onScoreChange={handleScoreChange}
            onGameOver={handleGameOver}
          />
        </div>
      </div>

      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <GameUI 
          score={score}
          userName={currentUser?.name}
          onBackToHome={handleBackToHome}
        />
      </div>

      {/* Información adicional del usuario - responsive */}
      {currentUser && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-2 text-white text-xs z-10">
          <div>Mejor: {currentUser.bestScore || 0}</div>
          <div>Juegos: {currentUser.totalGames || 0}</div>
        </div>
      )}

      {/* Orientación móvil - solo desktop */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-50 text-center hidden lg:block">
        Mejor experiencia en modo horizontal en tablets/móviles
      </div>
    </main>
  );
}