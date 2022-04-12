import bcrypt from 'bcrypt';
import { config } from '../config.js';

export const csrfCheck = async (req, res, next) => {
  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS'
  ) {
    return next();
  }

  const csrfHeader = req.get('dwitter-csrf-token');
  
  if (!csrfHeader) {
    console.warn('Missing required "dwitter-csrf-token" header.', req.headers.origin);
    return res.status(403).json({ message: 'Faild CSRF check' });
  }

  try {
    const valid = await validateCsrfToken(csrfHeader);
    if (!valid) {
      console.warn(
        'Value provided in "dwitter-csrf-token" header does not validate',
        req.headers.origin,
        csrfHeader
      );
      return res.status(403).json({ message: 'Failed CSRF check' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
  
};

async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
};
