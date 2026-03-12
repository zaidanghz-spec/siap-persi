import { neon } from '@neondatabase/serverless';

let _sql;

export function getDb() {
  if (!_sql) {
    const url = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL not set');
    _sql = neon(url);
  }
  return _sql;
}

export async function query(text, params = []) {
  const sql = getDb();
  return sql(text, params);
}
