import { Carrera } from '@/types/curriculum';

export const BQ: Carrera = {
  codigo: 'BQ',
  nombre: 'Bioquímica',
  campus: 'all',
  color: '#4CAF50',
  
  categorias: [
    {
        "id": "FB",
        "nombre": "Formación Básica Fundante",
        "color": "#3F51B5"
    },
    {
        "id": "LP",
        "nombre": "Cursos Propios de Licenciatura",
        "color": "#4CAF50"
    },
    {
        "id": "CM",
        "nombre": "Cursos Mínimos",
        "color": "#FF9800"
    },
    {
        "id": "TL",
        "nombre": "Cursos Terminales de Licenciatura",
        "color": "#FF69B4"
    },
    {
        "id": "FT",
        "nombre": "Cursos de Fase de Título",
        "color": "#607D8B"
    },
    {
        "id": "FG",
        "nombre": "Cursos de Formación General",
        "color": "#FFC300"
    },
    {
        "id": "TEST",
        "nombre": "Habilidades Comunicativas",
        "color": "#EFF1C5"
    }
],

  asignaturas: [
    {
        "name": "Tópicos en Bioquímica",
        "code": "BIO101B",
        "sctCredits": 5,
        "type": "LP",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Biología de la Célula",
        "code": "BIO141C",
        "sctCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Laboratorio de Química General",
        "code": "QIM101L",
        "sctCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Química General I",
        "code": "QIM100I",
        "sctCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Precálculo",
        "code": "MAT1000",
        "sctCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Filosofía: ¿Para qué?",
        "code": "FIL2001",
        "sctCredits": 10,
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
        "sctCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Laboratorio de Física para Ciencias",
        "code": "FIS0109",
        "sctCredits": 0,
        "type": "FB",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Química General II",
        "code": "QIM100B",
        "sctCredits": 10,
        "type": "LP",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Cálculo I",
        "code": "MAT1100",
        "sctCredits": 10,
        "type": "LP",
        "prerequisites": [
            "MAT1000"
        ],
        "semester": "s2"
    },
    {
        "name": "Quimica General I",
        "code": "QUI106",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI010"
        ],
        "semester": "s3"
    },
    {
        "name": "Quimica General II",
        "code": "QUI108",
        "sctCredits": 5,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI106"
        ],
        "semester": "s3"
    },
    {
        "name": "Visión Inmanente del Quehacer Humano",
        "code": "HRW102",
        "sctCredits": 3,
        "type": "ESTUDIOS HUMANÍSTICOS",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Fisica General III",
        "code": "FIS130",
        "sctCredits": 8,
        "type": "FÍSICA",
        "prerequisites": [
            "MAT022",
            "FIS110"
        ],
        "semester": "s4"
    },
    {
        "name": "Fisicoquímica I",
        "code": "QUI240",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI106",
            "MAT022",
            "QUI108",
            "FIS120"
        ],
        "semester": "s4"
    },
    {
        "name": "Inglés Científico y Tecnológico II",
        "code": "HCW311",
        "sctCredits": 2,
        "type": "ESTUDIOS HUMANÍSTICOS",
        "prerequisites": [
            "HCW310"
        ],
        "semester": "s4"
    },
    {
        "name": "Laboratorio de Química General",
        "code": "QUI109",
        "sctCredits": 4,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI106",
            "QUI108"
        ],
        "semester": "s4"
    },
    {
        "name": "Matematicas IV",
        "code": "MAT024",
        "sctCredits": 6,
        "type": "MATEMÁTICA",
        "prerequisites": [
            "MAT023"
        ],
        "semester": "s4"
    },
    {
        "name": "Química Inorgánica I",
        "code": "QUI114",
        "sctCredits": 5,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI010",
            "QUI108"
        ],
        "semester": "s4"
    },
    {
        "name": "Deportes",
        "code": "DEW  0",
        "sctCredits": 2,
        "type": "DEFIDER",
        "prerequisites": [
            "DEW101"
        ],
        "semester": "s5"
    },
    {
        "name": "Fisica General IV",
        "code": "FIS140",
        "sctCredits": 8,
        "type": "FÍSICA",
        "prerequisites": [
            "FIS130",
            "FIS120"
        ],
        "semester": "s5"
    },
    {
        "name": "Fisicoquímica II",
        "code": "QUI242",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI240",
            "FIS140"
        ],
        "semester": "s5"
    },
    {
        "name": "Laboratorio de Química Inorgánica I",
        "code": "QUI117",
        "sctCredits": 4,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI114",
            "QUI109"
        ],
        "semester": "s5"
    },
    {
        "name": "Química Analítica Cuantitativa I",
        "code": "QUI224",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI114",
            "QUI109"
        ],
        "semester": "s5"
    },
    {
        "name": "Química Orgánica I",
        "code": "QUI136",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI114",
            "QUI108"
        ],
        "semester": "s5"
    },
    {
        "name": "Fisicoquímica III",
        "code": "QUI244",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI240"
        ],
        "semester": "s6"
    },
    {
        "name": "Laboratorio de Química Orgánica I",
        "code": "QUI137",
        "sctCredits": 4,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI109"
        ],
        "semester": "s6"
    },
    {
        "name": "Química Analítica Cuantitativa II",
        "code": "QUI226",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI224"
        ],
        "semester": "s6"
    },
    {
        "name": "Química Orgánica II",
        "code": "QUI238",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI136"
        ],
        "semester": "s6"
    },
    {
        "name": "Visión Estética del Quehacer Humano",
        "code": "HRW103",
        "sctCredits": 3,
        "type": "ESTUDIOS HUMANÍSTICOS",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Análisis Químico Instrumental I",
        "code": "QUI375",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI136",
            "QUI224"
        ],
        "semester": "s7"
    },
    {
        "name": "Laboratorio de Química Inorgánica II",
        "code": "QUI217",
        "sctCredits": 4,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI117"
        ],
        "semester": "s7"
    },
    {
        "name": "Probabilidad y Estadistica",
        "code": "MAT041",
        "sctCredits": 7,
        "type": "MATEMÁTICA",
        "prerequisites": [
            "MAT023"
        ],
        "semester": "s7"
    },
    {
        "name": "Química Inorgánica II",
        "code": "QUI216",
        "sctCredits": 5,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI114"
        ],
        "semester": "s7"
    },
    {
        "name": "Análisis Químico Instrumental II",
        "code": "QUI376",
        "sctCredits": 6,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI375",
            "QUI226"
        ],
        "semester": "s8"
    },
    {
        "name": "Electivo I",
        "code": "QUI  1",
        "sctCredits": 7,
        "type": "QUÍMICA",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Laboratorio de Fisicoquímica",
        "code": "QUI243",
        "sctCredits": 5,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI240",
            "QUI242"
        ],
        "semester": "s8"
    },
    {
        "name": "Laboratorio de Química Orgánica II",
        "code": "QUI237",
        "sctCredits": 4,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI137"
        ],
        "semester": "s8"
    },
    {
        "name": "Electivo II",
        "code": "QUI  2",
        "sctCredits": 7,
        "type": "QUÍMICA",
        "prerequisites": [],
        "semester": "s9"
    },
    {
        "name": "Electivo III",
        "code": "QUI  3",
        "sctCredits": 7,
        "type": "QUÍMICA",
        "prerequisites": [],
        "semester": "s9"
    },
    {
        "name": "Electivo IV",
        "code": "QUI  4",
        "sctCredits": 7,
        "type": "QUÍMICA",
        "prerequisites": [],
        "semester": "s9"
    },
    {
        "name": "Unidad de Investigacion",
        "code": "QUI390",
        "sctCredits": 9,
        "type": "QUÍMICA",
        "prerequisites": [
            "QUI216",
            "QUI242",
            "QUI238",
            "QUI375"
        ],
        "semester": "s9"
    }
],
};
