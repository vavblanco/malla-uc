/**
 * Convierte créditos SCT a créditos UC
 * 30 SCT = 50 UC
 * 1 SCT = 5/3 UC ≈ 1.667 UC
 */
export function sctToUc(sctCredits: number): number {
  return Math.round((sctCredits * 5) / 3);
}

/**
 * Convierte créditos UC a créditos SCT
 * 50 UC = 30 SCT
 * 1 UC = 3/5 SCT = 0.6 SCT
 */
export function ucToSct(ucCredits: number): number {
  return Math.round((ucCredits * 3) / 5);
}

/**
 * Obtiene los créditos UC de una asignatura
 * Si tiene ucCredits definido, usa ese valor
 * Si no, convierte desde sctCredits
 */
export function getUcCredits(subject: { sctCredits: number; ucCredits?: number }): number {
  return subject.ucCredits ?? sctToUc(subject.sctCredits);
}

// Límites de créditos UC por semestre
export const UC_CREDITS_NORMAL = 50; // Carga normal
export const UC_CREDITS_MAX = 60;     // Máximo permitido