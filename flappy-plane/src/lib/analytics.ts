// Sistema de Analytics para Flappy Plane

interface AnalyticsEvent {
  event: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

interface UserSession {
  userId: string;
  email: string;
  startTime: string;
  endTime?: string;
  score?: number;
  device: string;
  browser: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessions: UserSession[] = [];
  private currentSession: UserSession | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.detectDevice();
    }
  }

  // Cargar datos del localStorage
  private loadFromStorage() {
    try {
      const storedEvents = localStorage.getItem('analytics_events');
      const storedSessions = localStorage.getItem('analytics_sessions');
      
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      }
      
      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  // Guardar en localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
      localStorage.setItem('analytics_sessions', JSON.stringify(this.sessions));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  // Detectar dispositivo y navegador
  private detectDevice(): { device: string; browser: string } {
    const ua = navigator.userAgent;
    let device = 'Desktop';
    let browser = 'Unknown';

    // Detectar dispositivo
    if (/Android/i.test(ua)) {
      device = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      device = 'iOS';
    } else if (/Windows Phone/i.test(ua)) {
      device = 'Windows Phone';
    } else if (/Tablet/i.test(ua)) {
      device = 'Tablet';
    }

    // Detectar navegador
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) {
      browser = 'Chrome';
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
      browser = 'Safari';
    } else if (/Firefox/i.test(ua)) {
      browser = 'Firefox';
    } else if (/Edge/i.test(ua)) {
      browser = 'Edge';
    }

    return { device, browser };
  }

  // Registrar evento
  trackEvent(event: string, data?: Record<string, unknown>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      data
    };

    this.events.push(analyticsEvent);
    this.saveToStorage();

    // Limitar eventos almacenados (máximo 1000)
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Iniciar sesión de juego
  startGameSession(userId: string, email: string) {
    const { device, browser } = this.detectDevice();
    
    this.currentSession = {
      userId,
      email,
      startTime: new Date().toISOString(),
      device,
      browser
    };

    this.trackEvent('game_start', { userId, email });
  }

  // Terminar sesión de juego
  endGameSession(score: number) {
    if (this.currentSession) {
      this.currentSession.endTime = new Date().toISOString();
      this.currentSession.score = score;
      
      this.sessions.push(this.currentSession);
      this.saveToStorage();
      
      this.trackEvent('game_end', { 
        userId: this.currentSession.userId,
        score,
        duration: this.calculateDuration(this.currentSession.startTime, this.currentSession.endTime!)
      });
      
      this.currentSession = null;

      // Limitar sesiones almacenadas (máximo 500)
      if (this.sessions.length > 500) {
        this.sessions = this.sessions.slice(-500);
      }
    }
  }

  // Calcular duración
  private calculateDuration(start: string, end: string): number {
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
  }

  // Obtener estadísticas
  getStats() {
    const totalUsers = new Set(this.sessions.map(s => s.email)).size;
    const totalGames = this.sessions.length;
    const scores = this.sessions.filter(s => s.score !== undefined).map(s => s.score!);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

    // Estadísticas por dispositivo
    const deviceStats: { [key: string]: number } = {};
    this.sessions.forEach(s => {
      deviceStats[s.device] = (deviceStats[s.device] || 0) + 1;
    });

    // Estadísticas por navegador
    const browserStats: { [key: string]: number } = {};
    this.sessions.forEach(s => {
      browserStats[s.browser] = (browserStats[s.browser] || 0) + 1;
    });

    // Top 10 jugadores
    const playerScores: { [key: string]: number[] } = {};
    this.sessions.forEach(s => {
      if (s.score !== undefined) {
        if (!playerScores[s.email]) {
          playerScores[s.email] = [];
        }
        playerScores[s.email].push(s.score);
      }
    });

    const topPlayers = Object.entries(playerScores)
      .map(([email, scores]) => ({
        email,
        bestScore: Math.max(...scores),
        gamesPlayed: scores.length,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 10);

    // Actividad por hora
    const hourlyActivity: { [key: number]: number } = {};
    this.sessions.forEach(s => {
      const hour = new Date(s.startTime).getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });

    return {
      totalUsers,
      totalGames,
      avgScore,
      maxScore,
      deviceStats,
      browserStats,
      topPlayers,
      hourlyActivity,
      recentSessions: this.sessions.slice(-20).reverse(),
      recentEvents: this.events.slice(-50).reverse()
    };
  }

  // Limpiar datos antiguos (más de 30 días)
  cleanOldData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.sessions = this.sessions.filter(s => 
      new Date(s.startTime) > thirtyDaysAgo
    );
    
    this.events = this.events.filter(e => 
      new Date(e.timestamp) > thirtyDaysAgo
    );
    
    this.saveToStorage();
  }
}

// Singleton instance
const analytics = new Analytics();

export default analytics;