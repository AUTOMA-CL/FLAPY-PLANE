// Google Sheets Database Integration
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwYMYUihl9oQ2xZpW5CJJ0Xyfm3bsN6E2C5yo3tOBQK4U7slQ2RDRiHiwPvA_bw7akVzg/exec";

// Registrar usuario en Google Sheets
export async function saveUser(userData: {
  name: string;
  phone: string;
  email: string;
  age: string;
}) {
  const params = new URLSearchParams({
    action: 'register',
    nombre: userData.name,
    telefono: userData.phone,
    email: userData.email,
    edad: userData.age
  });

  try {
    await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      mode: 'no-cors' // Para evitar problemas de CORS
    });

    // Con no-cors no podemos leer la respuesta, asumimos éxito
    return {
      ok: true,
      user: {
        id: Date.now().toString(),
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        age: userData.age,
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}

// Actualizar puntuación en Google Sheets
export async function updateScore(email: string, score: number) {
  const params = new URLSearchParams({
    action: 'updateScore',
    email: email,
    puntaje: score.toString()
  });

  try {
    await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      mode: 'no-cors' // Para evitar problemas de CORS
    });

    // Con no-cors no podemos leer la respuesta, asumimos éxito
    return { ok: true, score };
  } catch (error) {
    console.error('Error al actualizar puntuación:', error);
    throw new Error('Error al actualizar puntuación');
  }
}

// Función auxiliar para obtener usuario por email (local storage como fallback)
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
}

// Función auxiliar para guardar usuario actual (local storage)
export function setCurrentUser(user: {
  name: string;
  email: string;
  phone: string;
  age: string;
  bestScore?: number;
  totalGames?: number;
}) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}