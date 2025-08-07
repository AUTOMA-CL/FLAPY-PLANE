// Base de datos alternativa para Vercel usando variables de entorno temporales
import { User } from '@/types';

// En producción usar memoria temporal (se reinicia en cada deploy)
const usersCache: User[] = [];

export async function getUsers(): Promise<User[]> {
  return usersCache;
}

export async function saveUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const newUser: User = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString(),
    bestScore: 0,
    totalGames: 0
  };
  
  usersCache.push(newUser);
  return newUser;
}

export async function updateUserScore(userId: string, score: number): Promise<void> {
  const userIndex = usersCache.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }
  
  const user = usersCache[userIndex];
  user.totalGames = (user.totalGames || 0) + 1;
  
  if (!user.bestScore || score > user.bestScore) {
    user.bestScore = score;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return usersCache.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}