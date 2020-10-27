import { MAX_UPLOADABLE_FILESIZE_MB } from '../../config/';

class KawpaaError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KawpaaError';
  }
}

class KawpaaHttpError extends KawpaaError {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'KawpaaHttpError';
    this.statusCode = statusCode;
  }
}

const DEFAULT_MESSAGE = {
  400: 'Bad Request',
  403: 'Forbidden',
  404: 'Not Found',
  480: `Savable file size is up to ${MAX_UPLOADABLE_FILESIZE_MB}MB`,
  490: `You have reached the maximum number of registrations per day. Regulations are lifted at 00:00 every day.`,
  500: 'Kawpaa server has problems. Please wait for a moment.',
};

export default {
  happend: (msg, statusCode = 500) =>
    new KawpaaHttpError(msg || DEFAULT_MESSAGE[statusCode], statusCode),
};
