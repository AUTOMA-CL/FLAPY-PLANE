import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

interface GoogleSheetsUser {
  nombre: string;
  telefono: string;
  email: string;
  edad: string;
  puntaje: number | string;
}

interface GoogleSheetsResponse {
  ok: boolean;
  users?: GoogleSheetsUser[];
  totalRegistros?: number;
  error?: string;
}

export async function GET() {
  try {
    // Construir URL con parámetros
    const url = new URL(GOOGLE_SHEETS_URL);
    url.searchParams.append('action', 'getAnalytics');
    
    console.log('Fetching analytics from:', url.toString());
    
    // Obtener datos de Google Sheets
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de Google Sheets');
    }

    const data: GoogleSheetsResponse = await response.json();
    
    // Si Google Sheets no devuelve analytics, usar datos mock para desarrollo
    if (!data || !data.users) {
      return NextResponse.json({
        totalUsers: 0,
        totalGames: 0,
        avgScore: 0,
        maxScore: 0,
        users: [],
        recentGames: []
      });
    }

    // Procesar datos de Google Sheets
    const users = data.users || [];
    const scores = users
      .filter((u) => u.puntaje && u.puntaje !== 0)
      .map((u) => typeof u.puntaje === 'string' ? parseInt(u.puntaje) : u.puntaje as number);
    
    const analytics = {
      totalUsers: users.length,
      totalGames: scores.length,
      avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
      users: users,
      topPlayers: users
        .filter((u) => u.puntaje && u.puntaje !== 0)
        .sort((a, b) => {
          const scoreA = typeof a.puntaje === 'string' ? parseInt(a.puntaje) : a.puntaje as number;
          const scoreB = typeof b.puntaje === 'string' ? parseInt(b.puntaje) : b.puntaje as number;
          return scoreB - scoreA;
        })
        .slice(0, 10)
        .map((u) => ({
          email: u.email,
          nombre: u.nombre,
          bestScore: typeof u.puntaje === 'string' ? parseInt(u.puntaje) : u.puntaje as number,
          edad: u.edad
        })),
      recentGames: users
        .filter((u) => u.puntaje && u.puntaje !== 0)
        .slice(-20)
        .reverse()
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    
    // Devolver estructura vacía en caso de error
    return NextResponse.json({
      totalUsers: 0,
      totalGames: 0,
      avgScore: 0,
      maxScore: 0,
      users: [],
      topPlayers: [],
      recentGames: []
    });
  }
}