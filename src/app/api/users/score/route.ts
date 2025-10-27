import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/types';

// Importar base de datos según el entorno
async function getDatabase() {
  if (process.env.NODE_ENV === 'production') {
    const db = await import('@/lib/database-vercel');
    return db;
  } else {
    const db = await import('@/lib/database');
    return db;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    const database = await getDatabase();
    const body = await request.json();
    const { userId, score } = body;
    
    if (!userId || typeof score !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'userId y score son requeridos'
      }, { status: 400 });
    }

    await database.updateUserScore(userId, score);
    
    return NextResponse.json({
      success: true,
      data: { message: 'Puntuación actualizada' }
    });

  } catch (error) {
    console.error('Error en POST /api/users/score:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}