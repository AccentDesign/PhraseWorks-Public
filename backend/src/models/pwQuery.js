import { buildPostTypeCondition } from './pwQuery/buildPostTypeCondition.js';
import { buildPostStatusCondition } from './pwQuery/buildPostStatusCondition.js';
import { buildPostMimeTypeCondition } from './pwQuery/buildPostMimeTypeCondition.js';
import { buildAuthorCondition } from './pwQuery/buildAuthorCondition.js';
import { buildAuthorNameCondition } from './pwQuery/buildAuthorNameCondition.js';
import { buildTaxQueryCondition } from './pwQuery/buildTaxQueryCondition.js';
import { buildCatConditions } from './pwQuery/buildCatConditions.js';
import { buildTagConditions } from './pwQuery/buildTagConditions.js';
import { buildMetaQueryCondition } from './pwQuery/buildMetaQueryCondition.js';
import { buildSearchCondition } from './pwQuery/buildSearchCondition.js';
import { buildDateQueryCondition } from './pwQuery/buildDateQueryCondition.js';
import { buildPermissionCondition } from './pwQuery/buildPermissionCondition.js';
import { buildPostPageConditions } from './pwQuery/buildPostPageConditions.js';
import { getPagination } from './pwQuery/getPagination.js';
import { getOrderBy } from './pwQuery/getOrderBy.js';
import { loadPostExtras } from './pwQuery/loadPostExtras.js';
import { filterByCommentCount } from './pwQuery/filterByCommentCount.js';
import System from './system.js';

export default class PW_Query {
  static async fetchPWQuery(args, connection, loaders, userId) {
    const params = [];
    const joins = [];
    const conditions = await PW_Query.buildConditions(
      args,
      params,
      joins,
      connection,
      loaders,
      userId,
    );

    const { perPage, offset } = getPagination(args);
    const { orderBy, order } = getOrderBy(args);

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const joinClause = joins.join(' ');

    const query = `
        SELECT * FROM pw_posts
        ${joinClause}
        ${whereClause}
        ORDER BY ${orderBy} ${order}
        ${perPage !== null ? `LIMIT ${perPage} OFFSET ${offset}` : ''}
    `.trim();

    try {
      let rows = await connection.unsafe(query, params);
      await loadPostExtras(rows, loaders);

      if (args.comment_count !== undefined) {
        rows = filterByCommentCount(rows, args.comment_count);
      }

      return rows;
    } catch (err) {
      console.error('fetchPWQuery failed:', { query, params, err });
      await System.writeLogData(err.stack || String(err), 'backend');
      throw err;
    }
  }

  static async countWPQuery(args, connection, loaders, userId) {
    const params = [];
    const joins = [];

    const conditions = await PW_Query.buildConditions(
      args,
      params,
      joins,
      connection,
      loaders,
      userId,
    );

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const joinClause = joins.join(' ');

    const query = `
        SELECT COUNT(*) AS count FROM pw_posts
        ${joinClause}
        ${whereClause}
    `.trim();

    try {
      const result = await connection.unsafe(query, params);
      return Number(result[0].count);
    } catch (err) {
      console.error('countWPQuery failed:', { query, params, err });
      await System.writeLogData(err.stack || String(err), 'backend');
      throw err;
    }
  }

  static async buildConditions(args, params, joins, connection, loaders, userId) {
    let user = null;
    if (userId != null) {
      user = await loaders.user.load(userId);
    }
    const conditions = [];

    conditions.push(...buildPostTypeCondition(args, params));
    conditions.push(...buildPostStatusCondition(args, params));
    conditions.push(...buildPostMimeTypeCondition(args, params));
    conditions.push(...buildAuthorCondition(args, params));
    conditions.push(...buildAuthorNameCondition(args, params));
    if (args.tax_query) {
      conditions.push(...buildTaxQueryCondition(args.tax_query, params, joins));
    } else {
      buildCatConditions(args, params, conditions, joins);
      buildTagConditions(args, params, conditions, joins);
    }
    conditions.push(...buildMetaQueryCondition(args, params));
    conditions.push(...buildSearchCondition(args, params));
    conditions.push(...buildDateQueryCondition(args, params));
    if (user) {
      conditions.push(...buildPermissionCondition(args, params, user));
    }

    await buildPostPageConditions(args, params, conditions, connection);

    return conditions;
  }
}
