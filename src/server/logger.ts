import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.resolve(process.cwd(), 'logs');

// Ensure directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INF' | 'WRN' | 'ERR' | 'SEC';
  category: string;
  message: string;
  raw: string;
}

export function logMessage(level: 'INF' | 'WRN' | 'ERR' | 'SEC', category: string, message: string, filename = 'ompolymer-api.log') {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] [${category}] ${message}\n`;
  const filePath = path.join(LOGS_DIR, filename);

  try {
    fs.appendFileSync(filePath, line, 'utf8');
  } catch (err) {
    console.error('Failed writing to log file:', err);
  }
}

export function getAvailableLogFiles(): { fileName: string; sizeBytes: number; updatedAt: string }[] {
  try {
    if (!fs.existsSync(LOGS_DIR)) return [];
    const files = fs.readdirSync(LOGS_DIR);
    return files
      .filter(f => f.endsWith('.log') || f.endsWith('.txt'))
      .map(file => {
        const stats = fs.statSync(path.join(LOGS_DIR, file));
        return {
          fileName: file,
          sizeBytes: stats.size,
          updatedAt: stats.mtime.toISOString()
        };
      });
  } catch (err) {
    console.error('Error reading logs directory:', err);
    return [];
  }
}

export function readLogEntries(filename = 'ompolymer-api.log', maxLines = 200): LogEntry[] {
  const filePath = path.join(LOGS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    
    // Parse lines in reverse order (newest first)
    const parsed: LogEntry[] = [];
    const logRegex = /^\[([^\]]+)\]\s+\[([A-Z]+)\]\s+\[([^\]]+)\]\s+(.*)$/;

    for (let i = lines.length - 1; i >= 0 && parsed.length < maxLines; i--) {
      const line = lines[i];
      const match = line.match(logRegex);
      if (match) {
        parsed.push({
          id: `${filename}-${i}`,
          timestamp: match[1],
          level: (['INF', 'WRN', 'ERR', 'SEC'].includes(match[2]) ? match[2] : 'INF') as any,
          category: match[3],
          message: match[4],
          raw: line
        });
      } else {
        parsed.push({
          id: `${filename}-${i}`,
          timestamp: new Date().toISOString(),
          level: 'INF',
          category: 'System',
          message: line,
          raw: line
        });
      }
    }

    return parsed;
  } catch (err) {
    console.error(`Error reading log file ${filename}:`, err);
    return [];
  }
}

export function clearLogFile(filename = 'ompolymer-api.log'): boolean {
  const filePath = path.join(LOGS_DIR, filename);
  try {
    const timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, `[${timestamp}] [INF] [OMPolymer.API.System] Log file rotated and cleared by administrator.\n`, 'utf8');
    return true;
  } catch (err) {
    console.error(`Error clearing log file ${filename}:`, err);
    return false;
  }
}
