import { query } from './db.js';

// One-time DB setup: create tables + seed admin
export default async (req) => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'hospital',
        hospital_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        province TEXT,
        departments JSONB DEFAULT '[]',
        profile JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        hospital_id TEXT,
        hospital_name TEXT,
        province TEXT,
        departments JSONB DEFAULT '[]',
        rsbk_data JSONB DEFAULT '{}',
        audit_data JSONB DEFAULT '{}',
        prm_data JSONB DEFAULT '{}',
        scores JSONB DEFAULT '{}',
        status TEXT DEFAULT 'submitted',
        submitted_at TIMESTAMP DEFAULT NOW(),
        review_note TEXT DEFAULT '',
        reviewed_at TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS published_rankings (
        id TEXT PRIMARY KEY,
        hospital_id TEXT UNIQUE,
        hospital_name TEXT,
        province TEXT,
        departments JSONB DEFAULT '[]',
        scores JSONB DEFAULT '{}',
        total_score NUMERIC DEFAULT 0,
        published_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS patient_surveys (
        id TEXT PRIMARY KEY,
        hospital_id TEXT,
        patient_name TEXT NOT NULL,
        rm_number TEXT NOT NULL,
        department TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        prem_answers JSONB,
        prom_answers JSONB,
        prem_score NUMERIC,
        prom_score NUMERIC,
        total_prm_score NUMERIC,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        category TEXT,
        image_url TEXT DEFAULT '',
        date TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        event_date TEXT,
        location TEXT,
        description TEXT,
        link TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Seed admin user if not exists
    const existing = await query(`SELECT id FROM users WHERE email = 'admin@persi.or.id'`);
    if (existing.length === 0) {
      await query(
        `INSERT INTO users (id, email, password, name, role) VALUES ($1, $2, $3, $4, $5)`,
        ['u_admin', 'admin@persi.or.id', 'admin123', 'Dr. Evaluator PERSI', 'admin']
      );
    }

    return new Response(JSON.stringify({ ok: true, message: 'Database setup complete' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/setup-db' };
