import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

const appendTimestamp = format((info, opts) => {
  const clone = { ...info };
  if (opts.offset) {
    const date = new Date();
    date.setHours(date.getHours() + opts.offset);
    clone.timestamp = date.toISOString();
  }
  return info;
});

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      frequency: '24h',
      maxFiles: '7d', // Keep logs for 7 days
      format: combine(
        appendTimestamp({ offset: 2 }),
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
      appendTimestamp({ offset: 2 }),
      timestamp(),
      format.simple(),
    ),
  }));
}

export default logger;
