import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      frequency: '24h',
      maxFiles: '7d', // Keep logs for 7 days
      format: combine(
        timestamp(),
        json(),
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      format.colorize(),
      timestamp(),
      format.simple(),
    ),
  }));
}

export default logger;
