// ============================================================
// Reference Config Data — SIAP PERSI (Production-Ready)
// No seed data — all hospital/ranking data managed via AppStore
// ============================================================

export const DEPARTMENTS = [
  { id: 'cardiology', name: 'Kardiologi', icon: 'HeartPulse', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)' },
  { id: 'neurology', name: 'Neurologi', icon: 'Brain', color: '#8b5cf6', bgColor: 'rgba(139,92,246,0.1)' },
];

export const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali',
  'Sumatera Utara', 'Sumatera Barat', 'Sumatera Selatan', 'Kalimantan Timur',
  'Sulawesi Selatan', 'DI Yogyakarta', 'Banten', 'Aceh', 'Riau', 'Papua',
];

// ─── RSBK Data (15%) ────────────────────────────────────────
export const RSBK_DATA = {
  cardiology: {
    sdm: [
      { id: 'c_sdm_1', label: 'Sp.JP', target: 3 },
      { id: 'c_sdm_2', label: 'Sp.PD', target: 3 },
      { id: 'c_sdm_3', label: 'Sp.B', target: 2 },
      { id: 'c_sdm_4', label: 'Sp.A', target: 2 },
      { id: 'c_sdm_5', label: 'Sp.PD-KKV', target: 1 },
      { id: 'c_sdm_6', label: 'Sp.JP (Sub) Kardio Intervensi', target: 2 },
      { id: 'c_sdm_7', label: 'Sp.B-Sub Onk', target: 1 },
      { id: 'c_sdm_8', label: 'Sp.JP (Sub) Perawatan Intensif', target: 1 },
      { id: 'c_sdm_9', label: 'Sp.An', target: 2 },
      { id: 'c_sdm_10', label: 'Sp.PK', target: 1 },
      { id: 'c_sdm_11', label: 'Sp.Rad', target: 1 },
      { id: 'c_sdm_12', label: 'Sp.B-Sub BVE', target: 1 },
      { id: 'c_sdm_13', label: 'Sp.BTKV', target: 1 },
      { id: 'c_sdm_14', label: 'Sp.A-Sub Kardio', target: 1 },
      { id: 'c_sdm_15', label: 'Sp.JP (Sub) Pencitraan', target: 1 },
      { id: 'c_sdm_16', label: 'Sp.JP (Sub) Ekokardiografi', target: 1 },
      { id: 'c_sdm_17', label: 'Sp.JP (Sub) Aritmia', target: 1 },
      { id: 'c_sdm_18', label: 'Sp.JP (Sub) Kedokteran Vaskular', target: 1 },
      { id: 'c_sdm_19', label: 'Sp.JP (Sub) Prevensi Rehabilitasi', target: 1 },
      { id: 'c_sdm_20', label: 'Sp.An (Sub) Intensive Care', target: 1 },
      { id: 'c_sdm_21', label: 'Sp.KFR', target: 1 },
      { id: 'c_sdm_22', label: 'Sp.GK', target: 1 },
      { id: 'c_sdm_23', label: 'Sp.P', target: 1 },
      { id: 'c_sdm_24', label: 'Sp.N', target: 1 },
    ],
    rooms: [
      { id: 'c_rm_1', label: 'HCU', target: 5 },
      { id: 'c_rm_2', label: 'ICU', target: 5 },
      { id: 'c_rm_3', label: 'ICCU', target: 5 },
      { id: 'c_rm_4', label: 'PICU', target: 3 },
      { id: 'c_rm_5', label: 'NICU', target: 3 },
      { id: 'c_rm_6', label: 'R. Operasi', target: 3 },
      { id: 'c_rm_7', label: 'R. Operasi Mayor', target: 2 },
      { id: 'c_rm_8', label: 'R. Cathlab', target: 2 },
    ],
    equipment: [
      { id: 'c_eq_1', label: 'EKG', target: 5 }, { id: 'c_eq_2', label: 'USG ECHO', target: 3 },
      { id: 'c_eq_3', label: 'X-ray', target: 2 }, { id: 'c_eq_4', label: 'Holter', target: 2 },
      { id: 'c_eq_5', label: 'Treadmill', target: 2 }, { id: 'c_eq_6', label: 'Bedside Monitor', target: 10 },
      { id: 'c_eq_7', label: 'Ventilator', target: 10 }, { id: 'c_eq_8', label: 'ABPM', target: 2 },
      { id: 'c_eq_9', label: 'Advance ECHO (3D)', target: 1 }, { id: 'c_eq_10', label: 'CT Scan', target: 1 },
      { id: 'c_eq_11', label: 'IVUS', target: 1 }, { id: 'c_eq_12', label: 'Sternal Saw', target: 1 },
      { id: 'c_eq_13', label: 'ACT', target: 1 }, { id: 'c_eq_14', label: 'IABP', target: 1 },
      { id: 'c_eq_15', label: 'Heart Lung Machine', target: 1 }, { id: 'c_eq_16', label: 'EECP', target: 1 },
      { id: 'c_eq_17', label: 'Rotablator', target: 1 }, { id: 'c_eq_18', label: 'Gamma Camera', target: 1 },
      { id: 'c_eq_19', label: 'ICE', target: 1 }, { id: 'c_eq_20', label: 'Tilt Table', target: 1 },
      { id: 'c_eq_21', label: 'LVAD', target: 1 }, { id: 'c_eq_22', label: 'Nitric Oxide Machine', target: 1 },
      { id: 'c_eq_23', label: 'ECMO', target: 1 }, { id: 'c_eq_24', label: 'Heart Transplant Set', target: 1 },
    ],
  },
  neurology: {
    sdm: [
      { id: 'n_sdm_1', label: 'Sp.N', target: 3 }, { id: 'n_sdm_2', label: 'Sp.PD', target: 2 },
      { id: 'n_sdm_3', label: 'Sp.A', target: 1 }, { id: 'n_sdm_4', label: 'Sp.N (Sub) Neurovaskular/Intervensi', target: 1 },
      { id: 'n_sdm_5', label: 'Sp.Rad (Sub) Intervensi', target: 1 }, { id: 'n_sdm_6', label: 'Sp.BS', target: 1 },
      { id: 'n_sdm_7', label: 'Sp.BS (Sub) Vaskular', target: 1 }, { id: 'n_sdm_8', label: 'Sp.PK', target: 1 },
      { id: 'n_sdm_9', label: 'Sp.An', target: 1 }, { id: 'n_sdm_10', label: 'Sp.PA', target: 1 },
      { id: 'n_sdm_11', label: 'Sp.KFR', target: 1 }, { id: 'n_sdm_12', label: 'Sp.GK', target: 1 },
      { id: 'n_sdm_13', label: 'Sp.An (Sub) KIC/Neuroanestesi', target: 1 },
    ],
    rooms: [
      { id: 'n_rm_1', label: 'HCU', target: 5 }, { id: 'n_rm_2', label: 'ICU', target: 5 },
      { id: 'n_rm_3', label: 'PICU/NICU', target: 3 }, { id: 'n_rm_4', label: 'Unit Stroke', target: 5 },
      { id: 'n_rm_5', label: 'Ruang EEG', target: 1 }, { id: 'n_rm_6', label: 'R. Tindakan', target: 2 },
      { id: 'n_rm_7', label: 'R. Cathlab', target: 1 }, { id: 'n_rm_8', label: 'R. Operasi', target: 2 },
      { id: 'n_rm_9', label: 'R. CT', target: 1 }, { id: 'n_rm_10', label: 'R. MRI', target: 1 },
    ],
    equipment: [
      { id: 'n_eq_1', label: 'Mikroskop', target: 2 }, { id: 'n_eq_2', label: 'Hematoanalyzer', target: 1 },
      { id: 'n_eq_3', label: 'X-Ray', target: 1 }, { id: 'n_eq_4', label: 'USG', target: 1 },
      { id: 'n_eq_5', label: 'Funduscopy', target: 1 }, { id: 'n_eq_6', label: 'TCD', target: 1 },
      { id: 'n_eq_7', label: 'CT Scan (64/128/256 Slice)', target: 1 }, { id: 'n_eq_8', label: 'MRI (1.5/3 Tesla)', target: 1 },
      { id: 'n_eq_9', label: 'Cathlab Biplane', target: 1 }, { id: 'n_eq_10', label: 'EEG/Video EEG', target: 1 },
      { id: 'n_eq_11', label: 'EMG', target: 1 }, { id: 'n_eq_12', label: 'Radiofrequency Lesion Generator', target: 1 },
      { id: 'n_eq_13', label: 'Neuronavigasi', target: 1 }, { id: 'n_eq_14', label: 'ICP Monitoring', target: 1 },
    ],
  },
};

// ─── Audit Data (60%) ────────────────────────────────────────
export const AUDIT_DATA = {
  cardiology: {
    disease: 'STEMI',
    indicators: [
      { id: 'ca_1', label: '% EKG < 10 menit', phase: 'diagnosa', phaseWeight: 0.25 },
      { id: 'ca_2', label: '% Revaskularisasi (Fibrinolitik/PCI)', phase: 'tatalaksana', phaseWeight: 0.25 },
      { id: 'ca_3', label: '% Stratifikasi Killip', phase: 'tatalaksana', phaseWeight: 0.25 },
      { id: 'ca_4', label: '% Door to Balloon ≤ 90 menit', phase: 'tatalaksana', phaseWeight: 0.25 },
      { id: 'ca_5', label: '% Pasien Hidup', phase: 'outcome', phaseWeight: 0.50 },
      { id: 'ca_6', label: '% LOS < 5 hari (kecuali Killip III/IV)', phase: 'outcome', phaseWeight: 0.50 },
    ],
  },
  neurology: {
    disease: 'Stroke Non-Hemoragik',
    indicators: [
      { id: 'na_1', label: '% CT Scan < 30 menit', phase: 'diagnosa', phaseWeight: 0.25 },
      { id: 'na_2', label: '% Cek Gula Darah saat masuk', phase: 'diagnosa', phaseWeight: 0.25 },
      { id: 'na_3', label: '% Pemberian rtPA (Alteplase)', phase: 'tatalaksana', phaseWeight: 0.25 },
      { id: 'na_4', label: '% Antiplatelet/Antikoagulan', phase: 'tatalaksana', phaseWeight: 0.25 },
      { id: 'na_5', label: '% Pasien Pulang Hidup', phase: 'outcome', phaseWeight: 0.50 },
      { id: 'na_6', label: '% LOS < 7 hari (tanpa komplikasi)', phase: 'outcome', phaseWeight: 0.50 },
    ],
  },
};

// ─── PRM Data (25%) ──────────────────────────────────────────
export const PRM_DATA = {
  prem: {
    weight: 0.60,
    questions: [
      { id: 'prem_1', text: 'Sejauh mana dokter menjelaskan rencana tindakan (Primary PCI/Trombolisis) dengan bahasa yang mudah dimengerti?' },
      { id: 'prem_2', text: 'Apakah staf medis merespons dengan cepat saat Anda mengalami nyeri dada/gejala stroke berulang di bangsal?' },
      { id: 'prem_3', text: 'Seberapa terlibat Anda/keluarga dalam pengambilan keputusan mengenai prosedur medis?' },
      { id: 'prem_4', text: 'Bagaimana kebersihan dan kenyamanan ruang perawatan intensif (ICCU/Stroke Unit)?' },
    ],
  },
  prom: {
    weight: 0.40,
    questions: {
      cardiology: [
        { id: 'prom_c1', text: 'Seberapa sering Anda merasa sesak napas saat beraktivitas ringan dalam seminggu terakhir?', scaleInverted: true },
        { id: 'prom_c2', text: 'Apakah Anda mampu berjalan 100 meter tanpa nyeri dada?' },
      ],
      neurology: [
        { id: 'prom_n1', text: 'Sejauh mana Anda mampu melakukan aktivitas harian (makan/mandi) secara mandiri?' },
        { id: 'prom_n2', text: 'Apakah Anda mengalami kesulitan bicara atau memahami pembicaraan orang lain?', scaleInverted: true },
      ],
    },
  },
  scale: [
    { value: 5, label: 'Sangat Puas / Sangat Mandiri' },
    { value: 4, label: 'Puas / Mandiri' },
    { value: 3, label: 'Cukup' },
    { value: 2, label: 'Kurang' },
    { value: 1, label: 'Sangat Kurang / Tergantung Total' },
  ],
};

export const INITIAL_WEIGHTS = { rsbk: 0.15, audit: 0.60, prm: 0.25 };
export const AUDIT_THRESHOLDS = {
  cardiology: { ekg_time: 10, dtb_time: 90, los_days: 5 },
  neurology: { ct_time: 30, los_days: 7 },
};

// ─── Submission Statuses ─────────────────────────────────────
export const STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  REVISION: 'revision',
  APPROVED: 'approved',
  PUBLISHED: 'published',
};

export const STATUS_META = {
  [STATUS.NOT_STARTED]: { label: 'Belum Diisi', color: 'text-ice-400', bg: 'bg-ice-400/10', border: 'border-ice-400/20' },
  [STATUS.IN_PROGRESS]: { label: 'Sedang Berlangsung', color: 'text-cobalt-400', bg: 'bg-cobalt-400/10', border: 'border-cobalt-400/20' },
  [STATUS.SUBMITTED]: { label: 'Menunggu Review', color: 'text-gold-500', bg: 'bg-gold-500/10', border: 'border-gold-500/20' },
  [STATUS.IN_REVIEW]: { label: 'Sedang Direview', color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20' },
  [STATUS.REVISION]: { label: 'Perlu Revisi', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  [STATUS.APPROVED]: { label: 'Disetujui', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  [STATUS.PUBLISHED]: { label: 'Telah Dipublikasi', color: 'text-cobalt-400', bg: 'bg-cobalt-400/10', border: 'border-cobalt-400/20' },
};
