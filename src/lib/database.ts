import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

// Asegurar que el directorio data existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Leer usuarios del archivo JSON
export async function getUsers(): Promise<User[]> {
  try {
    await ensureDataDirectory();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, crear uno vacío
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(DATA_FILE, '[]', 'utf8');
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error('Error reading users file:', error);
    throw new Error('Error al leer usuarios');
  }
}

// Guardar usuario en el archivo JSON
export async function saveUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    const users = await getUsers();
    
    const newUser: User = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      bestScore: 0,
      totalGames: 0
    };
    
    users.push(newUser);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
    
    return newUser;
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Error al guardar usuario');
  }
}

// Actualizar puntuación de usuario
export async function updateUserScore(userId: string, score: number): Promise<void> {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    const user = users[userIndex];
    user.totalGames = (user.totalGames || 0) + 1;
    
    if (!user.bestScore || score > user.bestScore) {
      user.bestScore = score;
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating user score:', error);
    throw new Error('Error al actualizar puntuación');
  }
}

// Generar ID único simple
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Obtener usuario por email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}