import jwt from 'jsonwebtoken';

export const authMiddleware = async (c, next) => {
  const env = process.env;

  const secretKey = env.SECRET_KEY;
  if (!secretKey) {
    console.error('SECRET_KEY environment variable is not set');
    c.set('isAuth', false);
    await next();
    return;
  }

  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    c.set('isAuth', false);
    await next();
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('🔐 Invalid Authorization header format:', authHeader);
    c.set('isAuth', false);
    await next();
    return;
  }

  const token = parts[1];
  if (!token || token.length === 0) {
    c.set('isAuth', false);
    await next();
    return;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secretKey, {
      algorithms: ['HS256'],
      maxAge: '1h',
      clockTolerance: 30,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn('JWT token expired:', err.message);
    } else if (err.name === 'JsonWebTokenError') {
      console.warn('Invalid JWT token:', err.message);
    } else if (err.name === 'NotBeforeError') {
      console.warn('JWT token not active yet:', err.message);
    } else {
      console.warn('JWT verification failed:', err.message);
    }

    c.set('isAuth', false);
    await next();
    return;
  }

  if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.userId) {
    console.warn('Invalid JWT token payload structure');
    c.set('isAuth', false);
    await next();
    return;
  }

  const userId = parseInt(decodedToken.userId);
  if (isNaN(userId) || userId <= 0) {
    console.warn('Invalid userId in JWT token:', decodedToken.userId);
    c.set('isAuth', false);
    await next();
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  if (decodedToken.iat && decodedToken.iat > now) {
    console.warn('JWT token issued in the future');
    c.set('isAuth', false);
    await next();
    return;
  }

  c.set('isAuth', true);
  c.set('userId', userId);
  c.set('tokenExp', decodedToken.exp);
  c.set('tokenIat', decodedToken.iat);
  await next();
};
