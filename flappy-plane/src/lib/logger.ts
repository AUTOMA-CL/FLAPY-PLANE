// Sistema de logs simple para debugging
export interface LogEntry {
  timestamp: string;
  message: string;
  data?: unknown;
}

// Array de logs en memoria (se reinicia al recargar página)
const logs: LogEntry[] = [];

export function log(message: string, data?: unknown) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    message,
    data
  };
  
  logs.push(entry);
  
  // También mostrar en consola
  console.log(`${entry.timestamp} - ${message}`, data || '');
  
  // Enviar al servidor para guardar
  if (typeof window !== 'undefined') {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(err => console.error('Failed to save log:', err));
  }
}

export function getLogs(): LogEntry[] {
  return [...logs];
}