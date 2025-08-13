import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

export async function GET() {
  try {
    // Obtener datos de Google Sheets
    const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAnalytics`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de Google Sheets');
    }

    const data = await response.json();
    
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
    const scores = users.filter((u: any) => u.puntaje).map((u: any) => parseInt(u.puntaje));
    
    const analytics = {
      totalUsers: users.length,
      totalGames: scores.length,
      avgScore: scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
      users: users,
      topPlayers: users
        .filter((u: any) => u.puntaje)
        .sort((a: any, b: any) => parseInt(b.puntaje) - parseInt(a.puntaje))
        .slice(0, 10)
        .map((u: any) => ({
          email: u.email,
          nombre: u.nombre,
          bestScore: parseInt(u.puntaje),
          edad: u.edad
        })),
      recentGames: users
        .filter((u: any) => u.puntaje)
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