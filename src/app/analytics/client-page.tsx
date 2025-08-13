'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

interface GoogleUser {
  nombre: string;
  telefono: string;
  email: string;
  edad: string;
  puntaje: number | string;
}

export default function AnalyticsClient() {
  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchDirectFromSheets = async () => {
    try {
      console.log('Fetching from Google Sheets...');
      
      // Llamar directamente a Google Sheets
      const url = `${GOOGLE_SHEETS_URL}?action=getAnalytics`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos');
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (data.ok && data.users) {
        setUsers(data.users);
        setError(null);
      } else {
        setError('No se pudieron obtener los datos');
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con Google Sheets. Verifica que el script esté actualizado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectFromSheets();
    const interval = setInterval(fetchDirectFromSheets, 15000);
    return () => clearInterval(interval);
  }, []);

  // Calcular estadísticas
  const stats = {
    totalUsers: users.length,
    usersWithScore: users.filter(u => u.puntaje && u.puntaje !== 0 && u.puntaje !== "").length,
    scores: users
      .filter(u => u.puntaje && u.puntaje !== 0 && u.puntaje !== "")
      .map(u => typeof u.puntaje === 'string' ? parseInt(u.puntaje) : u.puntaje as number),
    avgScore: 0,
    maxScore: 0,
    topPlayers: [] as any[]
  };

  if (stats.scores.length > 0) {
    stats.avgScore = Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length);
    stats.maxScore = Math.max(...stats.scores);
  }

  stats.topPlayers = users
    .filter(u => u.puntaje && u.puntaje !== 0 && u.puntaje !== "")
    .sort((a, b) => {
      const scoreA = typeof a.puntaje === 'string' ? parseInt(a.puntaje) : a.puntaje as number;
      const scoreB = typeof b.puntaje === 'string' ? parseInt(b.puntaje) : b.puntaje as number;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Conectando con Google Sheets...</div>
          <div className="text-sm text-gray-400">Esto puede tomar unos segundos</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-xl text-red-400 mb-4">⚠️ {error}</div>
          <div className="text-sm text-gray-400 mb-4">
            Asegúrate de que el Google Apps Script tenga la función getAnalytics configurada.
          </div>
          <button 
            onClick={() => {
              setLoading(true);
              fetchDirectFromSheets();
            }}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-gray-400">Flappy Plane - Datos en Tiempo Real</p>
        <div className="mt-2 text-sm text-gray-500">
          Última actualización: {lastUpdate.toLocaleString('es-CL')}
          <span className="ml-4 text-green-400">● Conectado a Google Sheets</span>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Total Usuarios</div>
          <div className="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Han Jugado</div>
          <div className="text-3xl font-bold text-green-400">{stats.usersWithScore}</div>
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

      {/* Top Jugadores */}
      {stats.topPlayers.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">🏆 Top Jugadores</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-4">#</th>
                  <th className="text-left py-2 px-4">Nombre</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-right py-2 px-4">Puntaje</th>
                  <th className="text-center py-2 px-4">Edad</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPlayers.map((player: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && (index + 1)}
                    </td>
                    <td className="py-2 px-4">{player.nombre}</td>
                    <td className="py-2 px-4">
                      {player.email.substring(0, 3)}***@***
                    </td>
                    <td className="text-right py-2 px-4 font-bold text-yellow-400">
                      {typeof player.puntaje === 'string' ? parseInt(player.puntaje) : player.puntaje}
                    </td>
                    <td className="text-center py-2 px-4">{player.edad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lista de todos los usuarios */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          👥 Todos los Usuarios ({stats.totalUsers})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">Nombre</th>
                <th className="text-left py-2 px-4">Teléfono</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-center py-2 px-4">Edad</th>
                <th className="text-right py-2 px-4">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 px-4">{user.nombre}</td>
                  <td className="py-2 px-4">{user.telefono.substring(0, 4)}****</td>
                  <td className="py-2 px-4">{user.email.substring(0, 3)}***@***</td>
                  <td className="text-center py-2 px-4">{user.edad}</td>
                  <td className="text-right py-2 px-4 font-mono">
                    {user.puntaje || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Dashboard privado - Datos desde Google Sheets</p>
        <p className="mt-2">
          <Link href="/" className="text-blue-400 hover:underline">← Volver al juego</Link>
        </p>
      </div>
    </div>
  );
}