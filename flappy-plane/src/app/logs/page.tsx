'use client';

import { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
  data?: unknown;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    const fetchLogs = async () => {
      // Solo continuar si el componente está activo
      if (!isActive) return;
      
      try {
        const response = await fetch('/api/logs');
        const result = await response.json();
        if (result.success) {
          setLogs(result.logs);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLoading(false);
        // En caso de error, detener el auto-refresh para evitar spam
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    // Fetch inicial
    fetchLogs();
    
    // Solo iniciar el interval si el componente está activo
    if (isActive) {
      interval = setInterval(fetchLogs, 2000);
    }

    // Cleanup function
    return () => {
      setIsActive(false);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      const result = await response.json();
      if (result.success) {
        setLogs(result.logs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      setLogs([]);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando logs...</div>;
  }

  return (
    <div className="p-4 bg-black text-white min-h-screen font-mono text-sm">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Debug Logs - Flappy Plane</h1>
        <div className="space-x-2">
          <button 
            onClick={fetchLogs}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Refrescar
          </button>
          <button 
            onClick={clearLogs}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {logs.length === 0 ? (
          <div className="text-gray-400">No hay logs aún. Juega para generar logs de debug.</div>
        ) : (
          logs.slice(-50).map((log, index) => (
            <div key={index} className="border-l-2 border-gray-600 pl-2">
              <span className="text-gray-400 text-xs">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="ml-2">{log.message}</span>
              {log.data !== undefined && (
                <pre className="text-xs text-gray-300 ml-4">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Total logs: {logs.length} | Mostrando últimos 50 | Auto-refresh cada 2s
      </div>
    </div>
  );
}