import { MAX_UPLOADABLE_FILESIZE_MB } from '../../config/';

class KawpaaException extends Error {
  constructor(message) {
    super(message);
  }
}

class KawpaaHttpException extends KawpaaException {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default {
  400: () => new KawpaaHttpException('Bad Request', 400),
  403: () => new KawpaaHttpException('Forbidden', 403),
  404: () => new KawpaaHttpException('Not Found', 404),
  480: () =>
    new KawpaaHttpException(
      `Savable file size is up to ${MAX_UPLOADABLE_FILESIZE_MB}MB`,
      480,
    ),
  490: () =>
    new KawpaaHttpException(
      `You have reached the maximum number of registrations per day. Regulations are lifted at 00:00 every day.`,
      490,
    ),
  500: () =>
    new KawpaaHttpException(
      'Kawpaa server has problems. Please wait for a moment.',
      500,
    ),
};
