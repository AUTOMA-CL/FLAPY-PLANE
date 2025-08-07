import { NextRequest, NextResponse } from 'next/server';
import { saveUser, getUsers } from '@/lib/database';
import { RegistrationFormData, APIResponse, User } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<User>>> {
  try {
    const body: RegistrationFormData = await request.json();
    
    // Validación básica del lado del servidor
    const { name, phone, email } = body;
    
    if (!name || !phone || !email) {
      return NextResponse.json({
        success: false,
        error: 'Todos los campos son requeridos'
      }, { status: 400 });
    }

    // Validaciones específicas
    if (name.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'El nombre debe tener al menos 2 caracteres'
      }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Email no válido'
      }, { status: 400 });
    }

    if (phone.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'El teléfono debe tener al menos 10 caracteres'
      }, { status: 400 });
    }

    // Verificar si el email ya existe
    const existingUsers = await getUsers();
    const emailExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      return NextResponse.json({
        success: false,
        error: 'Este email ya está registrado'
      }, { status: 409 });
    }

    // Guardar usuario
    const newUser = await saveUser({ name, phone, email });
    
    return NextResponse.json({
      success: true,
      data: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/users:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse<APIResponse<User[]>>> {
  try {
    const users = await getUsers();
    
    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error en GET /api/users:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}