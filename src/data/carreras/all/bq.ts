import { Carrera } from '@/types/curriculum';

// ═══════════════════════════════════════════════════════════════════════
// LICENCIATURA EN BIOQUÍMICA Y TÍTULO PROFESIONAL DE BIOQUÍMICO
// Major en Bioquímica · Resolución VRA N°316/2026 (Anexo III)
//
// Prerrequisitos y correquisitos verificados en el catálogo UC.
// ═══════════════════════════════════════════════════════════════════════

export const bq: Carrera = {
  codigo: 'BQ',
  nombre: 'Bioquímica',
  campus: 'all',
  color: '#8A6BBE',

  categorias: [
    {
        "id": "FB",
        "nombre": "Formación Básica Fundante",
        "color": "#5A6FB3"
    },
    {
        "id": "LP",
        "nombre": "Cursos Propios de Licenciatura",
        "color": "#7C6DB0"
    },
    {
        "id": "CM",
        "nombre": "Cursos Mínimos",
        "color": "#C2873C"
    },
    {
        "id": "MJ",
        "nombre": "Cursos del Major en Bioquímica",
        "color": "#B35C8D"
    },
    {
        "id": "OP",
        "nombre": "Optativos o Minor",
        "color": "#4F8F8B"
    },
    {
        "id": "FT",
        "nombre": "Cursos de Fase de Título",
        "color": "#5F7688"
    },
    {
        "id": "FG",
        "nombre": "Cursos de Formación General",
        "color": "#C2A23A"
    },
    {
        "id": "TEST",
        "nombre": "Habilidades Comunicativas y Perfil UC",
        "color": "#9EA772"
    }
],

  asignaturas: [
    {
        "name": "Desafíos de la Bioquímica",
        "code": "BIO110B",
        "sctCredits": 3,
        "type": "CM",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Biología de la Célula",
        "code": "BIO114B",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Precálculo",
        "code": "MAT1000",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Química General I",
        "code": "QIM100N",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Laboratorio de Química General",
        "code": "QIM101L",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Filosofía: ¿Para qué?",
        "code": "FIL2001",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Examen de Comunicación Escrita (ECE)",
        "code": "VRA100C",
        "sctCredits": 0,
        "type": "TEST",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Test de Inglés",
        "code": "VRA2000",
        "sctCredits": 0,
        "type": "TEST",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Integridad Académica en la UC",
        "code": "VRA4000",
        "sctCredits": 0,
        "type": "TEST",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Física para Ciencias",
        "code": "FIS109C",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [],
        "corequisites": ["FIS0109"],
        "semester": "s2"
    },
    {
        "name": "Laboratorio de Física para Ciencias",
        "code": "FIS0109",
        "sctCredits": 0,
        "type": "CM",
        "prerequisites": [],
        "corequisites": ["FIS109C"],
        "semester": "s2"
    },
    {
        "name": "Cálculo I",
        "code": "MAT1100",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": ["MAT1000"],
        "semester": "s2"
    },
    {
        "name": "Química General II",
        "code": "QIM100C",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["QIM100N", "QIM101L"],
        "semester": "s2"
    },
    {
        "name": "Formación General",
        "code": "FG1",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Formación General",
        "code": "FG2",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Biología de los Microorganismos",
        "code": "BIO235C",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["BIO114B"],
        "semester": "s3"
    },
    {
        "name": "Bioestadística",
        "code": "BIO230C",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["MAT1000"],
        "semester": "s3"
    },
    {
        "name": "Biología Computacional",
        "code": "BIO210C",
        "sctCredits": 3,
        "type": "CM",
        "prerequisites": ["MAT1000", "BIO114B"],
        "semester": "s3"
    },
    {
        "name": "Química Orgánica I",
        "code": "QIM102C",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["QIM100C"],
        "semester": "s3"
    },
    {
        "name": "Química Analítica I",
        "code": "QIM109C",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["QIM100C"],
        "semester": "s3"
    },
    {
        "name": "Formación General",
        "code": "FG3",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Análisis Instrumental",
        "code": "QIM111",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": ["QIM109C"],
        "semester": "s4"
    },
    {
        "name": "Bioquímica I: Biomoléculas",
        "code": "BIO240B",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["QIM102C"],
        "semester": "s4"
    },
    {
        "name": "Laboratorio de Bioquímica I",
        "code": "BIO250B",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": ["BIO235C", "QIM102C"],
        "semester": "s4"
    },
    {
        "name": "Química Orgánica II",
        "code": "QIM103B",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": ["QIM102C"],
        "semester": "s4"
    },
    {
        "name": "Formación Teológica",
        "code": "TTF",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Genética Molecular y Evolutiva",
        "code": "BIO357B",
        "sctCredits": 9,
        "type": "MJ",
        "prerequisites": ["BIO240B"],
        "semester": "s5"
    },
    {
        "name": "Bioquímica II: Metabolismo",
        "code": "BIO345B",
        "sctCredits": 6,
        "type": "MJ",
        "prerequisites": ["BIO240B"],
        "semester": "s5"
    },
    {
        "name": "Fisiología Celular",
        "code": "BIO324C",
        "sctCredits": 6,
        "type": "MJ",
        "prerequisites": ["BIO114B", "FIS109C"],
        "semester": "s5"
    },
    {
        "name": "Laboratorio de Bioquímica II",
        "code": "BIO370B",
        "sctCredits": 6,
        "type": "MJ",
        "prerequisites": ["BIO240B", "BIO250B"],
        "semester": "s5"
    },
    {
        "name": "Filosofía y Ética de la Ciencia",
        "code": "ETI2010",
        "sctCredits": 3,
        "type": "CM",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Bioinformática Molecular",
        "code": "BIO360B",
        "sctCredits": 6,
        "type": "MJ",
        "prerequisites": ["BIO357B", "BIO210C"],
        "semester": "s6"
    },
    {
        "name": "Fisiología de Sistemas",
        "code": "BIO390C",
        "sctCredits": 6,
        "type": "MJ",
        "prerequisites": ["BIO324C"],
        "semester": "s6"
    },
    {
        "name": "Biomatemática: Modelación de Sistemas Biológicos",
        "code": "BIO310C",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": ["BIO210C", "BIO230C", "MAT1100"],
        "semester": "s6"
    },
    {
        "name": "Química-Física",
        "code": "QIM150B",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": ["FIS109C", "MAT1100", "QIM100C"],
        "semester": "s6"
    },
    {
        "name": "Formación General",
        "code": "FG4",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Seminario de Investigación en Bioquímica I",
        "code": "BIO415B",
        "sctCredits": 6,
        "type": "MJ",
        "prerequisites": ["BIO250B", "BIO370B"],
        "semester": "s7"
    },
    {
        "name": "Optativo o Minor",
        "code": "OPT1",
        "sctCredits": 6,
        "type": "OP",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo o Minor",
        "code": "OPT2",
        "sctCredits": 6,
        "type": "OP",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo o Minor",
        "code": "OPT3",
        "sctCredits": 6,
        "type": "OP",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Formación General",
        "code": "FG5",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigación en Bioquímica II",
        "code": "BIO416B",
        "sctCredits": 15,
        "type": "MJ",
        "prerequisites": ["BIO415B"],
        "semester": "s8"
    },
    {
        "name": "Optativo o Minor",
        "code": "OPT4",
        "sctCredits": 6,
        "type": "OP",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Optativo o Minor",
        "code": "OPT5",
        "sctCredits": 6,
        "type": "OP",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Formación General",
        "code": "FG6",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Laboratorio Clínico (Bioquímica)",
        "code": "MEB176B",
        "sctCredits": 6,
        "type": "FT",
        "prerequisites": ["BIO250B", "BIO370B"],
        "semester": "s9"
    },
    {
        "name": "Técnicas Avanzadas en Bioquímica",
        "code": "BIO432B",
        "sctCredits": 24,
        "type": "FT",
        "prerequisites": ["BIO416B"],
        "electiveTrack": "track-s9",
        "trackOption": "A",
        "trackName": "Técnicas Avanzadas",
        "semester": "s9"
    },
    {
        "name": "Optativo",
        "code": "OPT6",
        "sctCredits": 6,
        "type": "FT",
        "prerequisites": [],
        "electiveTrack": "track-s9",
        "trackOption": "B",
        "trackName": "Práctica Inmersiva",
        "semester": "s9"
    },
    {
        "name": "Práctica Profesional Inmersiva",
        "code": "BIO458E",
        "sctCredits": 18,
        "type": "FT",
        "prerequisites": ["BIO416B"],
        "electiveTrack": "track-s9",
        "trackOption": "B",
        "trackName": "Práctica Inmersiva",
        "semester": "s9"
    },
    {
        "name": "Optativos",
        "code": "OPT7",
        "sctCredits": 24,
        "type": "FT",
        "prerequisites": [],
        "electiveTrack": "track-s9",
        "trackOption": "C",
        "trackName": "Solo Optativos",
        "semester": "s9"
    },
    {
        "name": "Memoria Profesional en Bioquímica",
        "code": "BIO480B",
        "sctCredits": 30,
        "type": "FT",
        "prerequisites": ["BIO416B"],
        "electiveGroup": "10-TIT",
        "semester": "s10"
    },
    {
        "name": "Memoria de Investigación en Bioquímica",
        "code": "BIO490B",
        "sctCredits": 30,
        "type": "FT",
        "prerequisites": ["BIO416B"],
        "electiveGroup": "10-TIT",
        "semester": "s10"
    }
],
};
