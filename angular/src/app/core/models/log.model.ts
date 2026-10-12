export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | string;
  category: string;
  message: string;
  details?: any;
  sourceFile?: string;
}

export interface LogsResponse {
  total: number;
  filtered: number;
  files: string[];
  logs: LogEntry[];
}
