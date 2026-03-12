import { query } from './db.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

const cors = () => new Response(null, {
  status: 204,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, '');
  const method = req.method;
  let body = {};
  if (['POST', 'PUT'].includes(method)) {
    try { body = await req.json(); } catch {}
  }

  try {
    // ═══════════ AUTH ═══════════
    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = body;
      const rows = await query('SELECT id, email, name, role, hospital_id FROM users WHERE email=$1 AND password=$2', [email, password]);
      if (rows.length === 0) return json({ error: 'Invalid credentials' }, 401);
      const u = rows[0];
      return json({ id: u.id, email: u.email, name: u.name, role: u.role, hospitalId: u.hospital_id });
    }

    // ═══════════ USERS ═══════════
    if (path === '/users' && method === 'GET') {
      const rows = await query('SELECT id, email, name, role, hospital_id FROM users ORDER BY created_at');
      return json(rows.map((u) => ({ ...u, hospitalId: u.hospital_id })));
    }

    if (path === '/users' && method === 'POST') {
      const { id, email, password, name, role, hospitalId } = body;
      await query('INSERT INTO users (id, email, password, name, role, hospital_id) VALUES ($1,$2,$3,$4,$5,$6)',
        [id, email, password, name, role || 'hospital', hospitalId || null]);
      return json({ ok: true });
    }

    if (path.startsWith('/users/') && method === 'DELETE') {
      const hospitalId = path.split('/')[2];
      await query('DELETE FROM users WHERE hospital_id=$1', [hospitalId]);
      return json({ ok: true });
    }

    // ═══════════ HOSPITALS ═══════════
    if (path === '/hospitals' && method === 'GET') {
      const rows = await query('SELECT * FROM hospitals ORDER BY created_at');
      return json(rows);
    }

    if (path === '/hospitals' && method === 'POST') {
      const { id, name, province, departments, created_at } = body;
      await query('INSERT INTO hospitals (id, name, province, departments, created_at) VALUES ($1,$2,$3,$4,$5)',
        [id, name, province, JSON.stringify(departments || []), created_at || new Date().toISOString()]);
      return json({ ok: true });
    }

    if (path.startsWith('/hospitals/') && path.endsWith('/profile') && method === 'PUT') {
      const hId = path.split('/')[2];
      const { profile } = body;
      await query('UPDATE hospitals SET profile=$1 WHERE id=$2', [JSON.stringify(profile), hId]);
      return json({ ok: true });
    }

    if (path.startsWith('/hospitals/') && method === 'DELETE') {
      const hId = path.split('/')[2];
      await query('DELETE FROM patient_surveys WHERE hospital_id=$1', [hId]);
      await query('DELETE FROM submissions WHERE hospital_id=$1', [hId]);
      await query('DELETE FROM published_rankings WHERE hospital_id=$1', [hId]);
      await query('DELETE FROM users WHERE hospital_id=$1', [hId]);
      await query('DELETE FROM hospitals WHERE id=$1', [hId]);
      return json({ ok: true });
    }

    // ═══════════ SUBMISSIONS ═══════════
    if (path === '/submissions' && method === 'GET') {
      const rows = await query('SELECT * FROM submissions ORDER BY submitted_at DESC');
      return json(rows.map((s) => ({
        ...s, hospitalId: s.hospital_id, hospitalName: s.hospital_name,
        rsbkData: s.rsbk_data, auditData: s.audit_data, prmData: s.prm_data,
        submittedAt: s.submitted_at?.toISOString?.()?.split('T')[0] || s.submitted_at,
        reviewNote: s.review_note,
        reviewedAt: s.reviewed_at?.toISOString?.()?.split('T')[0] || s.reviewed_at,
      })));
    }

    if (path === '/submissions' && method === 'POST') {
      const { id, hospitalId, hospitalName, province, departments, rsbkData, auditData, prmData, scores, status } = body;
      await query(
        `INSERT INTO submissions (id, hospital_id, hospital_name, province, departments, rsbk_data, audit_data, prm_data, scores, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [id, hospitalId, hospitalName, province, JSON.stringify(departments), JSON.stringify(rsbkData),
         JSON.stringify(auditData), JSON.stringify(prmData), JSON.stringify(scores), status || 'submitted']);
      return json({ ok: true });
    }

    if (path.startsWith('/submissions/') && method === 'PUT') {
      const subId = path.split('/')[2];
      const { status, reviewNote } = body;
      await query('UPDATE submissions SET status=$1, review_note=$2, reviewed_at=NOW() WHERE id=$3',
        [status, reviewNote || '', subId]);
      return json({ ok: true });
    }

    // ═══════════ RANKINGS ═══════════
    if (path === '/rankings' && method === 'GET') {
      const rows = await query('SELECT * FROM published_rankings ORDER BY total_score DESC');
      return json(rows.map((r) => ({
        ...r, hospitalId: r.hospital_id, hospitalName: r.hospital_name,
        totalScore: parseFloat(r.total_score),
        publishedAt: r.published_at?.toISOString?.()?.split('T')[0] || r.published_at,
      })));
    }

    if (path === '/rankings' && method === 'POST') {
      const { id, hospitalId, hospitalName, province, departments, scores, totalScore } = body;
      // Upsert: remove old, insert new
      await query('DELETE FROM published_rankings WHERE hospital_id=$1', [hospitalId]);
      await query(
        `INSERT INTO published_rankings (id, hospital_id, hospital_name, province, departments, scores, total_score)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [id, hospitalId, hospitalName, province, JSON.stringify(departments), JSON.stringify(scores), totalScore]);
      return json({ ok: true });
    }

    if (path.startsWith('/rankings/') && method === 'DELETE') {
      const hId = path.split('/')[2];
      await query('DELETE FROM published_rankings WHERE hospital_id=$1', [hId]);
      return json({ ok: true });
    }

    // ═══════════ PATIENT SURVEYS ═══════════
    if (path === '/surveys' && method === 'GET') {
      const rows = await query('SELECT * FROM patient_surveys ORDER BY created_at DESC');
      return json(rows.map((s) => ({
        ...s, hospitalId: s.hospital_id, patientName: s.patient_name, rmNumber: s.rm_number,
        premAnswers: s.prem_answers, promAnswers: s.prom_answers,
        premScore: s.prem_score ? parseFloat(s.prem_score) : null,
        promScore: s.prom_score ? parseFloat(s.prom_score) : null,
        totalPrmScore: s.total_prm_score ? parseFloat(s.total_prm_score) : null,
        createdAt: s.created_at?.toISOString?.()?.split('T')[0] || s.created_at,
        completedAt: s.completed_at?.toISOString?.()?.split('T')[0] || s.completed_at,
      })));
    }

    if (path.startsWith('/surveys/') && path.endsWith('/token') && method === 'GET') {
      const token = path.split('/')[2];
      const rows = await query('SELECT * FROM patient_surveys WHERE id=$1', [token]);
      if (rows.length === 0) return json({ error: 'Not found' }, 404);
      const s = rows[0];
      return json({
        ...s, hospitalId: s.hospital_id, patientName: s.patient_name, rmNumber: s.rm_number,
        premScore: s.prem_score ? parseFloat(s.prem_score) : null,
        promScore: s.prom_score ? parseFloat(s.prom_score) : null,
        totalPrmScore: s.total_prm_score ? parseFloat(s.total_prm_score) : null,
        createdAt: s.created_at?.toISOString?.()?.split('T')[0] || s.created_at,
      });
    }

    if (path === '/surveys' && method === 'POST') {
      const { id, hospitalId, patientName, rmNumber, department } = body;
      await query(
        `INSERT INTO patient_surveys (id, hospital_id, patient_name, rm_number, department)
         VALUES ($1,$2,$3,$4,$5)`,
        [id, hospitalId, patientName, rmNumber, department]);
      return json({ ok: true });
    }

    if (path.startsWith('/surveys/') && method === 'PUT') {
      const token = path.split('/')[2];
      const { premAnswers, promAnswers, premScore, promScore, totalPrmScore } = body;
      await query(
        `UPDATE patient_surveys SET status='completed', prem_answers=$1, prom_answers=$2,
         prem_score=$3, prom_score=$4, total_prm_score=$5, completed_at=NOW() WHERE id=$6`,
        [JSON.stringify(premAnswers), JSON.stringify(promAnswers), premScore, promScore, totalPrmScore, token]);
      return json({ ok: true });
    }

    if (path.startsWith('/surveys/') && method === 'DELETE') {
      const token = path.split('/')[2];
      await query('DELETE FROM patient_surveys WHERE id=$1', [token]);
      return json({ ok: true });
    }

    // ═══════════ NEWS ═══════════
    if (path === '/news' && method === 'GET') {
      const rows = await query('SELECT * FROM news ORDER BY date DESC');
      return json(rows.map((n) => ({
        ...n, imageUrl: n.image_url,
        date: n.date?.toISOString?.()?.split('T')[0] || n.date,
      })));
    }

    if (path === '/news' && method === 'POST') {
      const { id, title, summary, content, category, imageUrl, date } = body;
      await query('INSERT INTO news (id, title, summary, content, category, image_url, date) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [id, title, summary, content, category, imageUrl || '', date || new Date().toISOString()]);
      return json({ ok: true });
    }

    if (path.startsWith('/news/') && method === 'PUT') {
      const nId = path.split('/')[2];
      const { title, summary, content, category, imageUrl } = body;
      await query('UPDATE news SET title=$1, summary=$2, content=$3, category=$4, image_url=$5 WHERE id=$6',
        [title, summary, content, category, imageUrl || '', nId]);
      return json({ ok: true });
    }

    if (path.startsWith('/news/') && method === 'DELETE') {
      const nId = path.split('/')[2];
      await query('DELETE FROM news WHERE id=$1', [nId]);
      return json({ ok: true });
    }

    // ═══════════ EVENTS ═══════════
    if (path === '/events' && method === 'GET') {
      const rows = await query('SELECT * FROM events ORDER BY event_date ASC');
      return json(rows.map((e) => ({
        ...e, date: e.event_date,
        createdAt: e.created_at?.toISOString?.()?.split('T')[0] || e.created_at,
      })));
    }

    if (path === '/events' && method === 'POST') {
      const { id, title, date, location, description, link } = body;
      await query('INSERT INTO events (id, title, event_date, location, description, link) VALUES ($1,$2,$3,$4,$5,$6)',
        [id, title, date, location, description, link || '']);
      return json({ ok: true });
    }

    if (path.startsWith('/events/') && method === 'PUT') {
      const eId = path.split('/')[2];
      const { title, date, location, description, link } = body;
      await query('UPDATE events SET title=$1, event_date=$2, location=$3, description=$4, link=$5 WHERE id=$6',
        [title, date, location, description, link || '', eId]);
      return json({ ok: true });
    }

    if (path.startsWith('/events/') && method === 'DELETE') {
      const eId = path.split('/')[2];
      await query('DELETE FROM events WHERE id=$1', [eId]);
      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('API error:', err);
    return json({ error: err.message }, 500);
  }
};

export const config = { path: '/api/*' };
