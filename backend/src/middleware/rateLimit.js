const rateLimit = (options = {}) => {
  const { windowMs = 60000, max = 500 } = options;
  const hits = new Map();

  return async (c, next) => {
    const headers = c.req?.headers || c.env.incoming.headers;
    const userId = c.get?.('userId');
    const sql = c.get('connection');
    if (userId) {
      const role =
        await sql`SELECT * FROM pw_usermeta WHERE user_id=${userId} AND meta_key='pw_user_role'`;
      if (
        role[0] &&
        (role[0].meta_value == 1 || role[0].meta_value == 2 || role[0].meta_value == 3)
      ) {
        return next();
      }
    }

    const ip =
      (typeof headers.get === 'function'
        ? headers.get('x-forwarded-for')
        : headers['x-forwarded-for']) ||
      (typeof headers.get === 'function' ? headers.get('host') : headers.host) ||
      'unknown';

    const now = Date.now();

    if (!hits.has(ip)) hits.set(ip, []);
    const timestamps = hits.get(ip);

    const updated = timestamps.filter((time) => now - time < windowMs);
    updated.push(now);
    hits.set(ip, updated);

    if (updated.length > max) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }

    return next();
  };
};

export default rateLimit;
