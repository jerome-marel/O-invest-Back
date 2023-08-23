// ESM permet d'écrire un relais plus simple au lieu d'écrire const ApiError = require... etc
export { default as ApiError } from '../errors/api.error.js';

export const errorHandler = (err, _, res, next) => {
  const { message } = err;
  let userMessage = message;
  let statusCode = err.infos?.statusCode;

  if (!statusCode || Number.isNaN(Number(statusCode))) {
    statusCode = 500;
  }
  if (statusCode === 500 && res.app.get('env') !== 'development') {
    userMessage = 'Internal Server Error';
  }
  if (statusCode === 500) {
    console.log(userMessage, err);
  }
  if (res.get('Content-type')?.includes('html')) {
    res.status(statusCode).render('error', {
      statusCode,
      message: userMessage,
      title: `Error ${statusCode}`,
    });
  } else {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: userMessage,
    });
  }
};
