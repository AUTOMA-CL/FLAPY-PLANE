// types/index.ts - Definiciones de tipos TypeScript para el proyecto

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  bestScore?: number;
  totalGames?: number;
}

export interface GameState {
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  planePosition: { x: number; y: number };
  velocity: number;
  obstacles: Obstacle[];
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

export interface PlaneCollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  // Para detección precisa de forma del avión
  shape?: ImageData;
}

export interface GameSettings {
  gravity: number;
  jumpVelocity: number;
  obstacleSpeed: number;
  obstacleGap: number;
  planeSize: { width: number; height: number };
  canvasSize: { width: number; height: number };
}

export interface RegistrationFormData {
  name: string;
  phone: string;
  email: string;
}

export interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}