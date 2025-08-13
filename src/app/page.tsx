'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationFormData } from '@/types';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    phone: '',
    email: '',
    age: ''
  });
  const router = useRouter();
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Crear los parámetros para el formulario
      const params = new URLSearchParams();
      params.append('action', 'register');
      params.append('nombre', formData.name);
      params.append('telefono', formData.phone);
      params.append('email', formData.email);
      params.append('edad', formData.age);

      // Enviar al Google Apps Script
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const result = await response.json();

      if (result.ok) {
        // Guardar en sessionStorage para el juego
        sessionStorage.setItem('currentUser', JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: formData.age
        }));
        
        // Redireccionar al juego
        router.push('/game');
      } else {
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header con texto */}
        <div className="bg-blue-600 text-white text-center py-2">
          <p className="text-sm">¡Prepárate para volar! Registra tus datos y comienza la aventura.</p>
        </div>

        {/* Logo FEROUCH */}
        <div className="flex justify-center py-6 px-0 bg-gray-50">
          <img
            src="/images/FE_NUEVOLOGO(avion)_AZUL.png?v=4"
            alt="FEROUCH"
            className="w-full"
            style={{
              maxWidth: '900px',
              height: 'auto',
              transform: 'scale(1.5)'
            }}
          />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-4 py-3 space-y-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad
            </label>
            <input
              type="number"
              required
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              placeholder="Tu edad"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando...
              </span>
            ) : (
              'Comenzar Juego'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-2 text-center text-xs text-gray-600">
          <p>© Optimizado para tablets y dispositivos móviles</p>
        </div>
      </div>
    </div>
  );
}