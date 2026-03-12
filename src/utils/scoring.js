// ============================================================
// Scoring Utility — Medical Accreditation System
// Total = (RSBK × 0.15) + (Audit × 0.60) + (PRM × 0.25)
// ============================================================

import { INITIAL_WEIGHTS } from '../data/mockData';

/**
 * RSBK Score: Each unit = 1 point. Score = (Total / Target) × 100.
 * @param {Object} quantities - { itemId: number }
 * @param {Object} rsbkData - RSBK_DATA for all departments being assessed
 * @param {string[]} departments - selected department IDs
 * @returns {number} 0–100
 */
export function calculateRSBKScore(quantities, rsbkData, departments) {
  let totalPoints = 0;
  let targetPoints = 0;

  departments.forEach((dept) => {
    const deptData = rsbkData[dept];
    if (!deptData) return;

    ['sdm', 'rooms', 'equipment'].forEach((category) => {
      (deptData[category] || []).forEach((item) => {
        const qty = quantities[item.id] || 0;
        // Points capped at target per item
        totalPoints += Math.min(qty, item.target);
        targetPoints += item.target;
      });
    });
  });

  if (targetPoints === 0) return 0;
  return Math.min((totalPoints / targetPoints) * 100, 100);
}

/**
 * Clinical Audit Score per department.
 * Indicators grouped by phase, each phase has a weight.
 * Indicators within the same phase share that phase's weight equally.
 * Input is percentage (0–100) per indicator.
 *
 * @param {Object} auditValues - { indicatorId: number (0-100 percentage) }
 * @param {Object} auditData - AUDIT_DATA for all departments
 * @param {string[]} departments - selected department IDs
 * @returns {number} 0–100
 */
export function calculateAuditScore(auditValues, auditData, departments) {
  if (departments.length === 0) return 0;

  let totalScore = 0;

  departments.forEach((dept) => {
    const data = auditData[dept];
    if (!data) return;

    // Group indicators by phase
    const phases = {};
    data.indicators.forEach((ind) => {
      if (!phases[ind.phase]) {
        phases[ind.phase] = { weight: ind.phaseWeight, indicators: [] };
      }
      phases[ind.phase].indicators.push(ind);
    });

    let deptScore = 0;
    Object.values(phases).forEach(({ weight, indicators }) => {
      const phaseAvg =
        indicators.reduce((sum, ind) => sum + (auditValues[ind.id] || 0), 0) /
        indicators.length;
      deptScore += phaseAvg * weight;
    });

    totalScore += deptScore;
  });

  // Average across departments
  return totalScore / departments.length;
}

/**
 * PRM Score: PREM (60%) + PROM (40%).
 * Each answer is Likert 1–5, normalized to 0–100.
 *
 * @param {Object} premAnswers - { questionId: number (1-5) }
 * @param {Object} promAnswers - { questionId: number (1-5) }
 * @param {Object} prmData - PRM_DATA
 * @param {string[]} departments - selected departments
 * @returns {number} 0–100
 */
export function calculatePRMScore(premAnswers, promAnswers, prmData, departments) {
  // Check for aggregated patient survey scores first
  if (premAnswers.__aggregate_score !== undefined && promAnswers.__aggregate_score !== undefined) {
    const premScore = premAnswers.__aggregate_score;
    const promScore = promAnswers.__aggregate_score;
    return premScore * prmData.prem.weight + promScore * prmData.prom.weight;
  }

  // Fallback to manual Likert answers
  // PREM score
  const premValues = prmData.prem.questions
    .map((q) => premAnswers[q.id] || 0)
    .filter((v) => v > 0);
  const premAvg = premValues.length > 0
    ? (premValues.reduce((a, b) => a + b, 0) / premValues.length / 5) * 100
    : 0;

  // PROM score — department-specific questions
  const allPromQuestions = departments.flatMap(
    (dept) => prmData.prom.questions[dept] || []
  );
  const promValues = allPromQuestions
    .map((q) => promAnswers[q.id] || 0)
    .filter((v) => v > 0);
  const promAvg = promValues.length > 0
    ? (promValues.reduce((a, b) => a + b, 0) / promValues.length / 5) * 100
    : 0;

  return premAvg * prmData.prem.weight + promAvg * prmData.prom.weight;
}

/**
 * Total weighted score.
 * @param {number} rsbk - 0–100
 * @param {number} audit - 0–100
 * @param {number} prm - 0–100
 * @param {Object} weights - { rsbk, audit, prm } (defaults to INITIAL_WEIGHTS)
 * @returns {number} 0–100
 */
export function calculateTotalScore(rsbk, audit, prm, weights = INITIAL_WEIGHTS) {
  return rsbk * weights.rsbk + audit * weights.audit + prm * weights.prm;
}

/**
 * Compute all scores from raw form data.
 */
export function computeAllScores(
  rsbkQuantities, rsbkData,
  auditValues, auditData,
  premAnswers, promAnswers, prmData,
  departments,
  weights
) {
  const rsbk = calculateRSBKScore(rsbkQuantities, rsbkData, departments);
  const audit = calculateAuditScore(auditValues, auditData, departments);
  const prm = calculatePRMScore(premAnswers, promAnswers, prmData, departments);
  const total = calculateTotalScore(rsbk, audit, prm, weights);

  return { rsbk, audit, prm, total };
}

/**
 * Get total score from a hospital's score object.
 */
export function getTotalFromScores(scores, weights = INITIAL_WEIGHTS) {
  return calculateTotalScore(scores.rsbk, scores.audit, scores.prm, weights);
}
