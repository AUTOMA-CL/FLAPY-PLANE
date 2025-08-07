'use client';

interface GameUIProps {
  score: number;
  userName?: string;
  onBackToHome?: () => void;
}

export default function GameUI({ score, userName, onBackToHome }: GameUIProps) {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none z-10">
      {/* Header con información del jugador - responsive */}
      <div className="flex justify-between items-start p-2 sm:p-4 text-white">
        <div className="bg-black bg-opacity-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2">
          <div className="text-xs sm:text-sm opacity-75">Jugador</div>
          <div className="font-bold text-sm sm:text-lg truncate max-w-32 sm:max-w-none">{userName || 'Invitado'}</div>
        </div>
        
        <div className="bg-black bg-opacity-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center">
          <div className="text-xs sm:text-sm opacity-75">Puntuación</div>
          <div className="font-bold text-lg sm:text-2xl">{score}</div>
        </div>
      </div>

      {/* Botón de regreso - responsive */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
        <button
          onClick={onBackToHome}
          className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-colors"
          title="Volver al inicio"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Instrucciones - responsive */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black bg-opacity-50 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-white text-center">
          <div className="text-xs sm:text-sm">
            📱 Toca la pantalla para volar
          </div>
          <div className="text-xs opacity-75 mt-0.5 sm:mt-1 hidden sm:block">
            💻 O presiona ESPACIO
          </div>
        </div>
      </div>
    </div>
  );
}