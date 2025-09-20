export function buildTaxQueryCondition(taxQuery, params, joins, aliasCounter = { value: 0 }) {
  if (!taxQuery) return [];

  const relation = (taxQuery.relation || 'AND').toUpperCase();
  if (!['AND', 'OR'].includes(relation)) {
    throw new Error('tax_query relation must be AND or OR');
  }

  const clauses = (taxQuery.queries || [])
    .map((clause) => {
      if (clause.queries) {
        const nested = buildTaxQueryCondition(clause, params, joins, aliasCounter);
        return nested.length
          ? `(${nested.join(` ${clause.relation?.toUpperCase() === 'OR' ? 'OR' : 'AND'} `)})`
          : null;
      }

      if (!clause.taxonomy) throw new Error('taxonomy is required in tax_query clause');

      const field = clause.field || 'term_id';
      const operator = (clause.operator || 'IN').toUpperCase();
      const terms = Array.isArray(clause.terms) ? clause.terms : [clause.terms];

      if (!terms.length && !['EXISTS', 'NOT EXISTS'].includes(operator)) {
        return null;
      }

      aliasCounter.value++;
      const trAlias = `tr${aliasCounter.value}`;
      const ttAlias = `tt${aliasCounter.value}`;

      joins.push(`
      INNER JOIN pw_term_relationships ${trAlias} ON ${trAlias}.object_id = pw_posts.id
      INNER JOIN pw_term_taxonomy ${ttAlias} ON ${trAlias}.term_taxonomy_id = ${ttAlias}.term_taxonomy_id
    `);

      let termField = 'term_id';
      switch (field) {
        case 'slug':
          termField = 'slug';
          break;
        case 'name':
          termField = 'name';
          break;
        case 'term_taxonomy_id':
          termField = 'term_taxonomy_id';
          break;
        case 'term_id':
          termField = 'term_id';
          break;
        default:
          throw new Error(`Unsupported tax_query field: ${field}`);
      }

      let cond = `${ttAlias}.taxonomy = $${params.length + 1}`;
      params.push(clause.taxonomy);

      if (['IN', 'NOT IN', 'AND'].includes(operator)) {
        const placeholders = terms.map((_, i) => `$${params.length + i + 1}`);
        params.push(...terms);

        if (operator === 'IN') {
          cond += ` AND ${ttAlias}.${termField} IN (${placeholders.join(', ')})`;
        } else if (operator === 'NOT IN') {
          cond += ` AND ${ttAlias}.${termField} NOT IN (${placeholders.join(', ')})`;
        } else if (operator === 'AND') {
          cond += ` AND pw_posts.id IN (
          SELECT object_id FROM pw_term_relationships r
          INNER JOIN pw_term_taxonomy tt2 ON r.term_taxonomy_id = tt2.term_taxonomy_id
          WHERE tt2.taxonomy = $${params.length - terms.length + 1}
            AND tt2.${termField} IN (${placeholders.join(', ')})
          GROUP BY object_id
          HAVING COUNT(DISTINCT tt2.${termField}) = ${terms.length}
        )`;
        }
      } else if (operator === 'EXISTS') {
        cond += '';
      } else if (operator === 'NOT EXISTS') {
        cond = `pw_posts.id NOT IN (
        SELECT object_id FROM pw_term_relationships r
        INNER JOIN pw_term_taxonomy tt2 ON r.term_taxonomy_id = tt2.term_taxonomy_id
        WHERE tt2.taxonomy = $${params.length}
      )`;
      } else {
        throw new Error(`Unsupported tax_query operator: ${operator}`);
      }

      return `(${cond})`;
    })
    .filter(Boolean);

  return clauses.length ? [`(${clauses.join(` ${relation} `)})`] : [];
}
