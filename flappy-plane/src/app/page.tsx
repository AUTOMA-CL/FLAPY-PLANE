'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationFormData, User } from '@/types';

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
  
  // URL de Google Apps Script
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

  // Función helper para esperar
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Función para registrar con reintentos automáticos
  const registrarConReintentos = useCallback(async (params: URLSearchParams, intentos = 3): Promise<{ok: boolean, error?: string}> => {
    for (let i = 0; i < intentos; i++) {
      try {
        // Crear un AbortController para el timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

        const response = await fetch(WEB_APP_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (error) {
        console.log(`Intento ${i + 1} falló:`, error instanceof Error ? error.message : 'Error desconocido');
        
        // Si es el último intento, lanzar el error
        if (i === intentos - 1) {
          throw error;
        }
        
        // Esperar con exponential backoff (1s, 2s, 4s)
        const tiempoEspera = 1000 * Math.pow(2, i);
        console.log(`Esperando ${tiempoEspera}ms antes de reintentar...`);
        await wait(tiempoEspera);
      }
    }
    return { ok: false, error: 'Error después de múltiples intentos' };
  }, []);

  // Función para enviar registro en segundo plano
  const enviarRegistroEnSegundoPlano = async (userData: User, params: URLSearchParams) => {
    try {
      // Agregar delay aleatorio (0-500ms) para evitar colisiones
      await wait(Math.random() * 500);
      
      const result = await registrarConReintentos(params);
      
      if (result.ok) {
        console.log('✅ Registro enviado exitosamente a Google Sheets');
        // Marcar como sincronizado
        const userDataActualizado = { ...userData, synced: true };
        sessionStorage.setItem('currentUser', JSON.stringify(userDataActualizado));
      } else {
        console.error('❌ Error en respuesta de Google Sheets:', result.error);
        // Guardar en cola de pendientes
        guardarEnColaPendiente(userData);
      }
    } catch (error) {
      console.error('❌ Error enviando registro:', error);
      // Guardar en cola de pendientes para reintento posterior
      guardarEnColaPendiente(userData);
    }
  };

  // Función para guardar en cola de pendientes
  const guardarEnColaPendiente = (userData: User) => {
    const pendientes = JSON.parse(localStorage.getItem('registrosPendientes') || '[]');
    pendientes.push({
      ...userData,
      timestamp: Date.now(),
      intentos: 0
    });
    localStorage.setItem('registrosPendientes', JSON.stringify(pendientes));
    console.log('📋 Registro guardado en cola para reintento posterior');
  };

  // Función para procesar registros pendientes en segundo plano
  const procesarRegistrosPendientes = useCallback(async () => {
    const pendientes = JSON.parse(localStorage.getItem('registrosPendientes') || '[]');
    
    if (pendientes.length === 0) return;
    
    console.log(`📤 Procesando ${pendientes.length} registros pendientes...`);
    
    const pendientesActualizados = [];
    
    for (const registro of pendientes) {
      // Solo reintentar si han pasado al menos 30 segundos desde el último intento
      if (Date.now() - registro.timestamp < 30000) {
        pendientesActualizados.push(registro);
        continue;
      }
      
      const params = new URLSearchParams();
      params.append('action', 'register');
      params.append('nombre', registro.name);
      params.append('telefono', registro.phone);
      params.append('email', registro.email);
      params.append('edad', registro.age.toString());
      
      try {
        await wait(Math.random() * 1000); // Delay aleatorio entre procesos
        const result = await registrarConReintentos(params, 2); // Solo 2 intentos para no demorar
        
        if (result.ok) {
          console.log(`✅ Registro pendiente enviado: ${registro.email}`);
          // No lo agregamos a pendientesActualizados (se elimina de la cola)
        } else {
          registro.intentos++;
          registro.timestamp = Date.now();
          // Solo mantener si ha tenido menos de 5 intentos totales
          if (registro.intentos < 5) {
            pendientesActualizados.push(registro);
          }
        }
      } catch {
        registro.intentos++;
        registro.timestamp = Date.now();
        if (registro.intentos < 5) {
          pendientesActualizados.push(registro);
        }
      }
    }
    
    // Actualizar localStorage con los que siguen pendientes
    localStorage.setItem('registrosPendientes', JSON.stringify(pendientesActualizados));
    
    if (pendientesActualizados.length > 0) {
      console.log(`⏳ Quedan ${pendientesActualizados.length} registros pendientes`);
    } else {
      console.log('✅ Todos los registros pendientes procesados');
    }
  }, [registrarConReintentos]);

  // Al cargar la página, intentar procesar registros pendientes
  useEffect(() => {
    procesarRegistrosPendientes();
  }, [procesarRegistrosPendientes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Crear objeto de usuario inmediatamente
    const userData: User = {
      id: formData.email,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      createdAt: new Date().toISOString(),
      bestScore: 0,
      totalGames: 0
    };

    // Guardar en sessionStorage INMEDIATAMENTE
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Crear los parámetros para el formulario
    const params = new URLSearchParams();
    params.append('action', 'register');
    params.append('nombre', formData.name);
    params.append('telefono', formData.phone);
    params.append('email', formData.email);
    params.append('edad', formData.age);

    // NAVEGAR AL JUEGO INMEDIATAMENTE
    router.push('/game');
    
    // Enviar registro a Google Sheets EN SEGUNDO PLANO
    // No esperamos la respuesta, el usuario ya está jugando
    enviarRegistroEnSegundoPlano(userData, params);
    
    setIsLoading(false);
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
        <div className="flex justify-center py-8 px-0 bg-gray-50 overflow-hidden">
          <img
            src="/images/FE_NUEVOLOGO(avion)_AZUL.png?v=3"
            alt="FEROUCH"
            className="animate-pulse w-full transform scale-150"
            style={{
              maxWidth: '600px',
              height: 'auto'
            }}
          />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
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
        <div className="bg-gray-100 px-6 py-3 text-center text-xs text-gray-600">
          <p>© Optimizado para tablets y dispositivos móviles</p>
        </div>
      </div>
    </div>
  );
}