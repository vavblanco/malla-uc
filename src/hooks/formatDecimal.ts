// ==========================================
// Helper para formatear números con coma decimal
// ==========================================

/**
 * Formatea un número para usar coma como separador decimal 
 * @param num - Número a formatear
 * @param decimals - Cantidad de decimales (default: 1)
 * @returns String formateado con coma decimal
 * 
 * Ejemplos:
 * formatDecimal(5.5) → "5,5"
 * formatDecimal(4.75, 2) → "4,75"
 * formatDecimal(6.0, 1) → "6,0"
 */
export function formatDecimal(num: number, decimals: number = 1): string {
  return num.toFixed(decimals).replace('.', ',');
}

/**
 * Formatea un número con 2 decimales y coma
 * @param num - Número a formatear
 * @returns String con 2 decimales y coma
 * 
 * Ejemplo: formatDecimal2(5.42) → "5,42"
 */
export function formatDecimal2(num: number): string {
  return num.toFixed(2).replace('.', ',');
}

// ==========================================
// USO EN TUS COMPONENTES
// ==========================================

// ANTES:
// {state.grade.toFixed(1)}           → "5.5"
// {ppaResult.ppa.toFixed(2)}         → "4.50"
// {stats.percentage.toFixed(1)}      → "75.3"

// AHORA:
// {formatDecimal(state.grade)}       → "5,5"
// {formatDecimal2(ppaResult.ppa)}    → "4,50"
// {formatDecimal(stats.percentage)}  → "75,3"
