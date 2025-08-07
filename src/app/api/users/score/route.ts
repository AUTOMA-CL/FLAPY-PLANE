import { NextRequest, NextResponse } from 'next/server';
import { updateUserScore } from '@/lib/database';
import { APIResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    const body = await request.json();
    const { userId, score } = body;
    
    if (!userId || typeof score !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'userId y score son requeridos'
      }, { status: 400 });
    }

    await updateUserScore(userId, score);
    
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