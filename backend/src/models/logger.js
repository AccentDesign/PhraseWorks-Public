import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Logger {
  static LOG_RETENTION_MS = 1000 * 60 * 60 * 24 * 60; // ~2 months

  static async writeLogData(data, type = 'backend') {
    try {
      const logFile =
        type === 'frontend'
          ? path.resolve(__dirname, '../../logs/frontend_errors.log')
          : path.resolve(__dirname, '../../logs/backend_errors.log');

      const timestamp = new Date().toISOString();

      let message;
      if (typeof data === 'string') {
        message = data;
      } else {
        try {
          message = JSON.stringify(data, null, 2);
        } catch {
          message = String(data);
        }
      }

      const logEntry = `[${timestamp}] ${message}\n`;

      let existing = '';
      try {
        existing = await fs.readFile(logFile, 'utf8');
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }

      const now = Date.now();
      const lines = existing.split('\n').filter((line) => {
        if (!line.trim()) return false;
        const match = line.match(/^\[(.*?)\]/);
        if (!match) return true;
        const ts = new Date(match[1]).getTime();
        return now - ts <= Logger.LOG_RETENTION_MS;
      });

      lines.push(logEntry.trim());

      await fs.writeFile(logFile, lines.join('\n') + '\n', 'utf8');
    } catch (err) {
      console.error('Failed to write log data:', err, data);
    }
  }
}
