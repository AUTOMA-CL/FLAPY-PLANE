import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'data', 'debug-logs.json');

interface LogEntry {
  timestamp: string;
  message: string;
  data?: unknown;
}

// Asegurar que el directorio data existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDirectory();
    
    const logEntry: LogEntry = await request.json();
    
    // Leer logs existentes
    let logs: LogEntry[] = [];
    try {
      const data = await fs.readFile(LOGS_FILE, 'utf8');
      logs = JSON.parse(data);
    } catch {
      // Archivo no existe, empezar con array vacío
    }
    
    // Agregar nuevo log
    logs.push(logEntry);
    
    // Mantener solo últimos 1000 logs
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }
    
    // Guardar
    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving log:', error);
    return NextResponse.json({ success: false, error: 'Failed to save log' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureDataDirectory();
    
    try {
      const data = await fs.readFile(LOGS_FILE, 'utf8');
      const logs = JSON.parse(data);
      return NextResponse.json({ success: true, logs });
    } catch {
      return NextResponse.json({ success: true, logs: [] });
    }
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json({ success: false, error: 'Failed to read logs' }, { status: 500 });
  }
}