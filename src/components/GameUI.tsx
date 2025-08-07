'use client';

interface GameUIProps {
  score: number;
  userName?: string;
  onBackToHome?: () => void;
}

export default function GameUI({ score, userName, onBackToHome }: GameUIProps) {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none z-10">
      {/* Header con información del jugador - diseño bonito */}
      <div className="flex justify-between items-start p-3 sm:p-5">
        <div className="text-center">
          <div 
            className="text-lg sm:text-xl font-bold tracking-wide"
            style={{
              color: '#87CEEB',
              textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
            }}
          >
            JUGADOR
          </div>
          <div 
            className="font-bold text-xl sm:text-2xl truncate max-w-40 sm:max-w-none mt-1"
            style={{
              color: '#87CEEB',
              textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
            }}
          >
            {userName || 'Invitado'}
          </div>
        </div>
        
        <div className="text-center">
          <div 
            className="text-lg sm:text-xl font-bold tracking-wide"
            style={{
              color: '#87CEEB',
              textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
            }}
          >
            PUNTUACIÓN
          </div>
          <div 
            className="font-bold text-3xl sm:text-4xl mt-1 animate-pulse"
            style={{
              color: '#87CEEB',
              textShadow: '3px 3px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000',
              animation: 'pulse 2s ease-in-out infinite alternate'
            }}
          >
            {score}
          </div>
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
    </div>
  );
}