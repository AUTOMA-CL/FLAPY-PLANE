'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Player {
  email: string;
  nombre?: string;
  bestScore: number;
  edad?: string;
}

interface User {
  nombre: string;
  telefono: string;
  email: string;
  edad: string;
  puntaje: number;
}

interface AnalyticsData {
  totalUsers: number;
  totalGames: number;
  avgScore: number;
  maxScore: number;
  topPlayers: Player[];
  users: User[];
  recentGames: User[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para cargar datos desde la API
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics', {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar analytics');
        }
        
        const analyticsData = await response.json();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Error al cargar los datos. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    // Cargar datos inicialmente
    fetchAnalytics();
    
    // Actualizar cada 10 segundos
    const interval = setInterval(fetchAnalytics, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Cargando analytics desde Google Sheets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-gray-400">Flappy Plane - Datos en Tiempo Real desde Google Sheets</p>
        <div className="mt-2 text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-CL')}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Total Usuarios Registrados</div>
          <div className="text-3xl font-bold text-blue-400">{data.totalUsers}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Usuarios con Puntaje</div>
          <div className="text-3xl font-bold text-green-400">{data.totalGames}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Puntuación Promedio</div>
          <div className="text-3xl font-bold text-yellow-400">{data.avgScore}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Puntuación Máxima</div>
          <div className="text-3xl font-bold text-red-400">{data.maxScore}</div>
        </div>
      </div>

      {/* Top 10 Jugadores */}
      {data.topPlayers && data.topPlayers.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">🏆 Top 10 Jugadores</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-4">#</th>
                  <th className="text-left py-2 px-4">Nombre</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-right py-2 px-4">Mejor Puntuación</th>
                  <th className="text-center py-2 px-4">Edad</th>
                </tr>
              </thead>
              <tbody>
                {data.topPlayers.map((player, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && (index + 1)}
                    </td>
                    <td className="py-2 px-4 text-gray-300">
                      {player.nombre || 'Sin nombre'}
                    </td>
                    <td className="py-2 px-4 text-gray-300">
                      {player.email.substring(0, 3)}***{player.email.substring(player.email.indexOf('@'))}
                    </td>
                    <td className="text-right py-2 px-4 font-bold text-yellow-400">
                      {player.bestScore}
                    </td>
                    <td className="text-center py-2 px-4 text-gray-400">
                      {player.edad || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Todos los Usuarios Registrados */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">👥 Usuarios Registrados ({data.totalUsers})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">Nombre</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-left py-2 px-4">Teléfono</th>
                <th className="text-center py-2 px-4">Edad</th>
                <th className="text-right py-2 px-4">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {data.users && data.users.slice(0, 50).map((user, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 px-4 text-gray-300">
                    {user.nombre || 'Sin nombre'}
                  </td>
                  <td className="py-2 px-4 text-gray-300">
                    {user.email.substring(0, 3)}***{user.email.substring(user.email.indexOf('@'))}
                  </td>
                  <td className="py-2 px-4 text-gray-400">
                    {user.telefono ? `${user.telefono.substring(0, 3)}****` : '-'}
                  </td>
                  <td className="text-center py-2 px-4 text-gray-400">
                    {user.edad || '-'}
                  </td>
                  <td className="text-right py-2 px-4 font-mono">
                    {user.puntaje || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.users && data.users.length > 50 && (
            <div className="text-center mt-4 text-gray-500">
              Mostrando los primeros 50 usuarios de {data.users.length} totales
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-3">📈 Estadísticas</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Tasa de Juego:</span>
              <span className="text-white">
                {data.totalUsers > 0 
                  ? `${Math.round((data.totalGames / data.totalUsers) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Usuarios sin puntaje:</span>
              <span className="text-white">{data.totalUsers - data.totalGames}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-3">🎯 Rangos de Puntaje</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">0-50 puntos:</span>
              <span className="text-white">
                {data.users ? data.users.filter(u => u.puntaje > 0 && u.puntaje <= 50).length : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">51-100 puntos:</span>
              <span className="text-white">
                {data.users ? data.users.filter(u => u.puntaje > 50 && u.puntaje <= 100).length : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">100+ puntos:</span>
              <span className="text-white">
                {data.users ? data.users.filter(u => u.puntaje > 100).length : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-3">ℹ️ Información</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Fuente de datos:</span>
              <span className="text-green-400">Google Sheets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Actualización:</span>
              <span className="text-white">Cada 10 seg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estado:</span>
              <span className="text-green-400">En línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Dashboard privado - No compartir URL</p>
        <p className="mt-2">
          <Link href="/" className="text-blue-400 hover:underline">← Volver al juego</Link>
        </p>
      </div>
    </div>
  );
}