import jwt from 'jsonwebtoken';

export const authMiddleware = async (c, next) => {
  const secretKey = c.env.SECRET_KEY;
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    c.set('isAuth', false);
    await next();
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    c.set('isAuth', false);
    await next();
    return;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secretKey);
  } catch (err) {
    c.set('isAuth', false);
    await next();
    return;
  }

  if (!decodedToken) {
    c.set('isAuth', false);
    await next();
    return;
  }

  c.set('isAuth', true);
  c.set('userId', decodedToken.userId);
  await next();
};
