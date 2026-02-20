// ==========================================
// Subject (Asignatura) Types
// ==========================================

export interface Subject {
  name: string;
  code: string;
  sctCredits: number;
  ucCredits?: number;
  type: string;
  prerequisites: string[];
  alternativePrerequisites?: string[][];
  corequisites?: string[];
  creditRequirement?: number;
  semester?: string;
  electiveGroup?: string;
  // NUEVO: Para tracks de especialización (múltiples ramos mutuamente excluyentes)
  electiveTrack?: string;    // ID del track (ej: "track-especialidad")
  trackOption?: string;       // Letra de la opción (ej: "A", "B", "C")
  trackName?: string;         // Nombre descriptivo (ej: "Certificado de Especialidad")
}

export interface SubjectState {
  status: 'pending' | 'approved' | 'failed';  
  grade?: number;  
}

export type CalculatorState = Record<string, SubjectState>;

export interface SubjectColors {
  [key: string]: string[];
}

// ==========================================
// Category (Categoría) Types
// ==========================================

export interface Categoria {
	id: string;
	nombre: string;
	color: string;
}

// ==========================================
// Career (Carrera) Types
// ==========================================

export interface Carrera {
	codigo: string;
	nombre: string;
	campus: 'all';
	color: string;
	asignaturas: Subject[];
	categorias: Categoria[];
}

export interface CarreraSimple {
	Nombre: string;
	Link: string;
	Color: string;
}

// ==========================================
// Backwards compatibility aliases
// ==========================================

/** @deprecated Use Subject instead */
export type Asignatura = Subject;
