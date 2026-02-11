import { Carrera } from '@/types/curriculum';

export const bio: Carrera = {
  codigo: 'BIO',
  nombre: 'Biología',
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
        "name": "Desafíos de las Ciencias Biológicas",
        "code": "BIO105C",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "LP",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Evolución",
        "code": "BIO118C",
        "sctCredits": 3,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Biología de la Célula",
        "code": "BIO114B",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Precálculo",
        "code": "MAT1000",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Química General I",
        "code": "QIM100I",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
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
        "name": "Biología y Diversidad Vegetal",
        "code": "BIO120C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
            "BIO118C"
        ],
        "semester": "s2"
    },
    {
        "name": "Física para Ciencias",
        "code": "FIS109C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "corequisites": ["FIS0109"],
        "semester": "s2"
    },
    {
        "name": "Laboratorio de Física para Ciencias",
        "code": "FIS0109",
        "sctCredits": 0,
        "ucCredits": 0,
        "type": "FB",
        "prerequisites": [],
        "corequisites": ["FIS109C"],
        "semester": "s2"
    },
    {
        "name": "Química General II",
        "code": "QIM100B",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
          "QIM100I"
        ],
        "semester": "s2"
    },
    {
        "name": "Cálculo I",
        "code": "MAT1100",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
            "MAT1000"
        ],
        "semester": "s2"
    },
    {
        "name": "Formación General",
        "code": "OFG1",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Biología y Diversidad Animal",
        "code": "BIO227E",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
            "BIO118C"
        ],
        "semester": "s3"
    },
    {
        "name": "Bioestadística",
        "code": "BIO230C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
            "MAT1000"
        ],
        "semester": "s3"
    },
    {
        "name": "Biología Computacional",
        "code": "BIO210C",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "CM",
        "prerequisites": [
            "MAT1000",
            "BIO114B"
        ],
        "semester": "s3"
    },
    {
        "name": "Química Orgánica Fundamental",
        "code": "QIM200",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
            "QIM100B"
        ],
        "semester": "s3"
    },
    {
        "name": "Metodología para la Investigación Biológica",
        "code": "BIO215C",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "LP",
        "prerequisites": [
            "BIO114B"
        ],
        "semester": "s3"
    },
    {
        "name": "Filosofía: ¿Para Qué?",
        "code": "FIL2001",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Biología de los Microorganismos",
        "code": "BIO235C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO114B"
        ],
        "semester": "s4"
    },
    {
        "name": "Bioquímica",
        "code": "BIO247C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO114B",
            "QIM200"
        ],
        "semester": "s4"
    },
    {
        "name": "Genética Integrativa",
        "code": "BIO244C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO114B",
            "BIO230C"
        ],
        "semester": "s4"
    },
    {
        "name": "Formación Teológica",
        "code": "TTF",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Formación General",
        "code": "OFG2",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Ecología",
        "code": "BIO330C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO118C",
            "BIO230C"
        ],
        "semester": "s5"
    },
    {
        "name": "Biología del Desarrollo",
        "code": "BIO356C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO114B",
            "BIO244C"
        ],
        "semester": "s5"
    },
    {
        "name": "Fisiología Celular",
        "code": "BIO324C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO114B",
            "FIS109C"
        ],
        "semester": "s5"
    },
    {
        "name": "Biomatemáticas: Modelación de Sistemas Biológicos",
        "code": "BIO310C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "MAT1100",
            "BIO230C",
            "BIO210C"
        ],
        "semester": "s5"
    },
    {
        "name": "Filosofía y Ética de la Ciencia",
        "code": "ETI2010",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "CM",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Formación General",
        "code": "OFG3",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Trabajo Experimental en Biología",
        "code": "BIO385C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO215C",
            "BIO230C",
            "BIO247C",
            "BIO330C"
        ],
        "semester": "s6"
    },
    {
        "name": "Fisiología Animal Comparada",
        "code": "BIO372C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO324C",
            "BIO227E"
        ],
        "electiveGroup": "6-AV",
        "semester": "s6"
    },
    {
        "name": "Fisiología Vegetal",
        "code": "BIO365C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO324C",
            "BIO120C"
        ],
        "electiveGroup": "6-AV",
        "semester": "s6"
    },
    {
        "name": "Ecoinformática",
        "code": "BIO408C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO230C",
            "BIO210C"
        ],
        "electiveGroup": "6-EB",
        "semester": "s6"
    },
    {
        "name": "Bioinformática Molecular",
        "code": "BIO360B",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO230C",
            "BIO244C"
        ],
        "electiveGroup": "6-EB",
        "semester": "s6"
    },
    {
        "name": "Fisiología de Sistemas",
        "code": "BIO390C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO324C"
        ],
        "semester": "s6"
    },
    {
        "name": "Formación General",
        "code": "OFG4",
        "sctCredits": 3,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Seminario de Investigación en Biología I",
        "code": "BIO415C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO385C"
        ],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT1",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT2",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT3",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Formación General",
        "code": "OFG5",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigación en Biología II",
        "code": "BIO416C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO415C"
        ],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT4",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT5",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Formación General",
        "code": "OFG6",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Certificado Académico de Especialidad",
        "code": "CAE",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "TL",
        "prerequisites": [],
        "semester": "s9",
        "electiveTrack": "track-especialidad",           // ← ID del track
        "trackOption": "A",                              // ← Letra de la opción (A, B, C, etc.)
        "trackName": "Opción A" 
    },
    {
        "name": "Práctica Profesional Inversiva",
        "code": "BIO458E",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "TL",
        "prerequisites": [
            "BIO416C"
        ],
        "semester": "s9",
        "electiveGroup": "optativos-b-1", 
        "electiveTrack": "track-especialidad",          
        "trackOption": "B",                              
        "trackName": "Opción A" 
    },
    {
        "name": "Técnicas Avanzadas en Biología",
        "code": "BIO432C",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "TL",
        "prerequisites": [
            "BIO416C"
        ],
        "semester": "s9",
        "electiveGroup": "optativos-b-1", 
        "electiveTrack": "track-especialidad",           
        "trackOption": "B",                              
        "trackName": "Opción B" 
    },
    {
        "name": "Optativos de Profundización",
        "code": "OPTB",
        "sctCredits": 12,
        "ucCredits": 20,
        "type": "TL",
        "prerequisites": [],
        "semester": "s9",
        "electiveTrack": "track-especialidad",           
        "trackOption": "B",                              
        "trackName": "Opción B" 
    },
    {
        "name": "Optativos de Profundización",
        "code": "OPTC",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "TL",
        "prerequisites": [],
        "semester": "s9",
        "electiveTrack": "track-especialidad",          
        "trackOption": "C",                             
        "trackName": "Opción C" 
    },
    {
        "name": "Memoria Profesional en Biología",
        "code": "BIO480C",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "TL",
        "prerequisites": [
            "BIO416C"
        ],
        "electiveGroup": "10-PI",
        "semester": "s10"
    },
    {
        "name": "Memoria de Investigación en Biología",
        "code": "BIO490C",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "TL",
        "prerequisites": [
            "BIO416C"
        ],
        "electiveGroup": "10-PI",
        "semester": "s10"
    }
],
};
