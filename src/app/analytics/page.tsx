'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import analytics from '@/lib/analytics';

interface Player {
  email: string;
  bestScore: number;
  gamesPlayed: number;
  avgScore: number;
}

interface Session {
  userId: string;
  email: string;
  startTime: string;
  endTime?: string;
  score?: number;
  device: string;
  browser: string;
}

interface Stats {
  totalUsers: number;
  totalGames: number;
  avgScore: number;
  maxScore: number;
  deviceStats: Record<string, number>;
  browserStats: Record<string, number>;
  topPlayers: Player[];
  hourlyActivity: Record<number, number>;
  recentSessions: Session[];
  recentEvents: Array<{ event: string; timestamp: string; data?: Record<string, unknown> }>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar estadísticas
    const loadStats = () => {
      const data = analytics.getStats();
      setStats(data);
      setLoading(false);
    };

    loadStats();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(loadStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Cargando analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-gray-400">Flappy Plane - Métricas en Tiempo Real</p>
        <div className="mt-2 text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-CL')}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Total Usuarios</div>
          <div className="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Partidas Jugadas</div>
          <div className="text-3xl font-bold text-green-400">{stats.totalGames}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Puntuación Promedio</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.avgScore}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Puntuación Máxima</div>
          <div className="text-3xl font-bold text-red-400">{stats.maxScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dispositivos */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">📱 Dispositivos</h3>
          <div className="space-y-3">
            {Object.entries(stats.deviceStats).map(([device, count]) => (
              <div key={device} className="flex justify-between items-center">
                <span className="text-gray-300">{device}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-700 rounded-full h-2 w-32">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count as number / stats.totalGames) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegadores */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🌐 Navegadores</h3>
          <div className="space-y-3">
            {Object.entries(stats.browserStats).map(([browser, count]) => (
              <div key={browser} className="flex justify-between items-center">
                <span className="text-gray-300">{browser}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-700 rounded-full h-2 w-32">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(count as number / stats.totalGames) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Jugadores */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">🏆 Top 10 Jugadores</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">#</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-right py-2 px-4">Mejor Puntuación</th>
                <th className="text-right py-2 px-4">Partidas</th>
                <th className="text-right py-2 px-4">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPlayers.map((player, index) => (
                <tr key={player.email} className="border-b border-gray-700">
                  <td className="py-2 px-4">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && (index + 1)}
                  </td>
                  <td className="py-2 px-4 text-gray-300">
                    {player.email.substring(0, 3)}***{player.email.substring(player.email.indexOf('@'))}
                  </td>
                  <td className="text-right py-2 px-4 font-bold text-yellow-400">
                    {player.bestScore}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-400">
                    {player.gamesPlayed}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-400">
                    {player.avgScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actividad por Hora */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">⏰ Actividad por Hora</h3>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 24 }, (_, hour) => {
            const count = stats.hourlyActivity[hour] || 0;
            const maxCount = Math.max(...Object.values(stats.hourlyActivity as { [key: number]: number }));
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={hour} className="text-center">
                <div className="relative h-20 flex items-end justify-center">
                  <div 
                    className="bg-blue-500 w-full rounded-t transition-all hover:bg-blue-400"
                    style={{ height: `${height}%` }}
                    title={`${hour}:00 - ${count} partidas`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {hour % 3 === 0 ? hour : ''}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">Hora del día (0-23)</div>
      </div>

      {/* Sesiones Recientes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🎮 Sesiones Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">Hora</th>
                <th className="text-left py-2 px-4">Usuario</th>
                <th className="text-left py-2 px-4">Dispositivo</th>
                <th className="text-right py-2 px-4">Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSessions.slice(0, 10).map((session, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 px-4 text-gray-400">
                    {new Date(session.startTime).toLocaleTimeString('es-CL')}
                  </td>
                  <td className="py-2 px-4 text-gray-300">
                    {session.email.substring(0, 3)}***
                  </td>
                  <td className="py-2 px-4 text-gray-400">
                    {session.device} / {session.browser}
                  </td>
                  <td className="text-right py-2 px-4 font-mono">
                    {session.score || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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