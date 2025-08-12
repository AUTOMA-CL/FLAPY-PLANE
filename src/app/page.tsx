'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RegistrationForm from '@/components/RegistrationForm';
import { RegistrationFormData, APIResponse, User } from '@/types';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: APIResponse<User> = await response.json();

      if (result.success && result.data) {
        // Guardar usuario en sessionStorage para el juego
        sessionStorage.setItem('currentUser', JSON.stringify(result.data));
        
        // Redireccionar al juego
        router.push('/game');
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start py-8 px-4 overflow-y-auto">
      {/* Fondo con logos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 opacity-10">
          <Image
            src="/images/FE_NUEVOLOGO(avion)_AZUL.png"
            alt="Decorative logo"
            width={60}
            height={60}
            className="transform rotate-12"
          />
        </div>
        <div className="absolute bottom-32 left-8 opacity-10">
          <Image
            src="/images/FE_NUEVOLOGO(avion)_AZUL.png"
            alt="Decorative logo"
            width={50}
            height={50}
            className="transform -rotate-12"
          />
        </div>
      </div>

      {/* Contenido principal - responsive mejorado */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/FE_NUEVOLOGO(avion)_AZUL.png"
              alt="Logo"
              width={720}
              height={720}
              className="animate-slow-bounce"
              style={{
                maxWidth: 'min(720px, 80vw)',
                height: 'auto'
              }}
            />
          </div>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">
            ¡Prepárate para volar! Registra tus datos y comienza la aventura.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Optimizado para tablets y dispositivos móviles
          </p>
          <p className="mt-1">
            ¡Mejor experiencia en modo horizontal!
          </p>
        </div>
      </div>
    </div>
  );
}
