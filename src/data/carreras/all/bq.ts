import { Carrera } from '@/types/curriculum';

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
        "id": "TL",
        "nombre": "Cursos Terminales de Licenciatura",
        "color": "#B35C8D"
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
        "nombre": "Habilidades Comunicativas",
        "color": "#9EA772"
    }
],

  asignaturas: [
    {
        "name": "Tópicos en Bioquímica",
        "code": "BIO101B",
        "sctCredits": 3,
        "type": "LP",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Biología de la Célula",
        "code": "BIO141C",
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
        "name": "Química General I",
        "code": "QIM100I",
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
        "name": "Filosofía: ¿Para qué?",
        "code": "FIL2001",
        "sctCredits": 6,
        "type": "FG",
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
        "name": "Examen de Comunicación Escrita (ECE)",
        "code": "VRA100C",
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
        "type": "FB",
        "prerequisites": [],
        "corequisites": ["FIS109C"],
        "semester": "s2"
    },
    {
        "name": "Química General II",
        "code": "QIM100B",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": [
          "QIM100I",
          "QIM101L"
        ],
        "semester": "s2"
    },
    {
        "name": "Cálculo I",
        "code": "MAT1100",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": [
            "MAT1000"
        ],
        "semester": "s2"
    },
    {
        "name": "Formación Teológica",
        "code": "TTF",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Artes",
        "code": "ARTS",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Bases Físicas de los Procesos Biológicos",
        "code": "BIO152C",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [
            "MAT1000",
            "FIS109C",
            "QIM100I",
            "BIO141C"
        ],
        "semester": "s3"
    },
    {
        "name": "Bioestadística",
        "code": "BIO242C",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": [
            "MAT1000"
        ],
        "semester": "s3"
    },
    {
        "name": "Química Orgánica I",
        "code": "QIM102B",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": [
            "QIM100B"
        ],
        "semester": "s3"
    },
    {
        "name": "Química Analítica I",
        "code": "QIM109B",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": [
            "QIM100B"
        ],
        "corequisites": ["BIO242C"],
        "semester": "s3"
    },
    {
        "name": "Humanidades",
        "code": "HUMS",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Biología de los Microorganismos",
        "code": "BIO151E",
        "sctCredits": 6,
        "type": "FB",
        "prerequisites": [
            "BIO141C"
        ],
        "semester": "s4"
    },
    {
        "name": "Química Orgánica II",
        "code": "QIM103A",
        "sctCredits": 6,
        "type": "LP",
        "prerequisites": [
            "QIM102B"
        ],
        "semester": "s4"
    },
    {
        "name": "Análisis Instrumental",
        "code": "QIM111",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "QIM109B"
        ],
        "semester": "s4"
    },
    {
        "name": "Ciencias Sociales",
        "code": "CSOC",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Ecología Integral y Sustentabilidad",
        "code": "EISU",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Genética y Evolución",
        "code": "BIO226E",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO141C",
            "BIO242C"
        ],
        "semester": "s5"
    },
    {
        "name": "Fisiología y Bioquímica Vegetal",
        "code": "BIO225C",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "BIO152C"
        ],
        "electiveGroup": "3-bio-elect",
        "semester": "s5"
    },
    {
        "name": "Biología y Fisiología Celular",
        "code": "BIO274E",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "BIO152C"
        ],
        "electiveGroup": "3-bio-elect",
        "semester": "s5"
    },
    {
        "name": "Bioquímica",
        "code": "BIO257C",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "QIM103A"
        ],
        "semester": "s5"
    },
    {
        "name": "Laboratorio de Bioquímica I: Biología Celular",
        "code": "BIO266D",
        "sctCredits": 3,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "QIM103A",
            "QIM111"
        ],
        "semester": "s5"
    },
    {
        "name": "Laboratorio de Química Orgánica",
        "code": "QIM104A",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "QIM103A"
        ],
        "semester": "s5"
    },
    {
        "name": "Salud y Bienestar",
        "code": "SBIE",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Genética Molecular",
        "code": "BIO288C",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO257C"
        ],
        "semester": "s6"
    },
    {
        "name": "Laboratorio de Bioquímica II: Genética Molecular",
        "code": "BIO266E",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO257C",
            "BIO266D"
        ],
        "corequisites": ["BIO288C"],
        "semester": "s6"
    },
    {
        "name": "Fisiología",
        "code": "BIO299E",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "BIO152C",
            "BIO257C"
        ],
        "corequisites": ["BIO299L"],
        "semester": "s6"
    },
    {
        "name": "Laboratorio de Fisiología",
        "code": "BIO299L",
        "sctCredits": 3,
        "type": "CM",
        "prerequisites": [],
        "corequisites": ["BIO299E"],
        "semester": "s6"
    },
    {
        "name": "Química-Física I",
        "code": "QIM114B",
        "sctCredits": 6,
        "type": "CM",
        "prerequisites": [
            "MAT1100"
        ],
        "semester": "s6"
    },
    {
        "name": "Créditos Libres",
        "code": "OFG",
        "sctCredits": 6,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Química-Física II",
        "code": "QIM115",
        "sctCredits": 6,
        "type": "TL",
        "prerequisites": [
            "QIM114B"
        ],
        "semester": "s7"
    },
    {
        "name": "Introducción al Laboratorio Clínico",
        "code": "MEB176B",
        "sctCredits": 6,
        "type": "TL",
        "prerequisites": [
            "BIO266D",
            "BIO266E"
        ],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigacion Departamental",
        "code": "BIO295A",
        "sctCredits": 9,
        "type": "TL",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización",
        "code": "OPR1",
        "sctCredits": 6,
        "type": "TL",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización",
        "code": "OPR2",
        "sctCredits": 6,
        "type": "TL",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigación",
        "code": "BIO296F",
        "sctCredits": 18,
        "type": "TL",
        "prerequisites": [
            "BIO295A",
            "BIO266D",
            "BIO266E",
            "BIO299L"
        ],
        "electiveTrack": "track-especialidad",           
        "trackOption": "A",                              
        "trackName": "Cursos + Investigación",
        "semester": "s8"
    },
    {
        "name": "Práctica Extramural",
        "code": "BIO258F",
        "sctCredits": 18,
        "type": "TL",
        "prerequisites": [
            "BIO266D",
            "BIO266E",
            "BIO299L"
        ],
        "electiveTrack": "track-especialidad",           
        "trackOption": "B",                              
        "trackName": "Cursos + Experiencia Profesional",
        "semester": "s8"
    },
    {
        "name": "Optativos de Profundización de Licenciatura",
        "code": "OPR Lic",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "TL",
        "prerequisites": [],
        "electiveTrack": "track-especialidad",           
        "trackOption": "C",                              
        "trackName": "Cursos + Cursos",
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización de Licenciatura",
        "code": "OPR4",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "TL",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización de Licenciatura",
        "code": "OPR5",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "TL",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Examen de Grado",
        "code": "EXAMEN GRADO",
        "sctCredits": 0,
        "type": "TL",
        "prerequisites": [
            "VRA2000",
            "VRA100C",
            "VRA4000"
        ],
        "creditRequirement": 415,
        "semester": "s8"
    },
    {
        "name": "Técnicas Avanzadas en Bioquímica",
        "code": "BIO3319",
        "sctCredits": 30,
        "type": "FT",
        "prerequisites": [
          "EXAMEN GRADO"
        ],
        "electiveGroup": "9-TIT",
        "semester": "s9"
    },
    {
        "name": "Optativos de Profundización del Título Profesional",
        "code": "OPRT",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "FT",
        "prerequisites": [
          "EXAMEN GRADO"
        ],
        "electiveGroup": "9-TIT",
        "semester": "s9"
    },
    {
        "name": "Memoria de Investigación",
        "code": "BIO285D",
        "sctCredits": 30,
        "type": "FT",
        "prerequisites": [
          "BIO3319"
        ],
        "electiveGroup": "10-TIT",
        "semester": "s10"
    },
    {
        "name": "Memoria Profesional",
        "code": "BIO285E",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "FT",
        "prerequisites": [
          "OPRT"
        ],
        "electiveGroup": "10-TIT",
        "semester": "s10"
    }
],
};
