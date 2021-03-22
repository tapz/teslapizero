'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
require('winston-daily-rotate-file');

const formatArg = args =>
  args.map(arg => arg.stack || JSON.stringify(arg)).join('\n');

const myFormat = printf(({ level, message, timestamp, args }) => 
  `${timestamp} ${level} ${message} ${formatArg(args)}`);

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        myFormat
      )
    }),
    new transports.DailyRotateFile({
      filename: 'teslapizero.log',
      frequency: '1w',
      maxSize: '1m',
      maxFiles: 2,
      auditFile: 'log-audit.json'
    })
  ],
  colorize: true
});

module.exports = {
  error: (message, ...args) => logger.error(message, { args }),
  warn: (message, ...args) => logger.warn(message, { args }),
  info: (message, ...args) => logger.info(message, { args }),
};