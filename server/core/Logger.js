import {createLogger,transports, format} from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import DailyRotateFile from "winston-daily-rotate-file"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// log folder
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const environment = process.env.NODE_ENV || "development"
const logLevel = environment === "development" ? "debug" : "warn"

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  handleExceptions: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
})

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.prettyPrint()
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
})