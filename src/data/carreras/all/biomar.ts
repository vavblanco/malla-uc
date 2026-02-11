import { Carrera } from '@/types/curriculum';

export const biomar: Carrera = {
  codigo: 'BIOMAR',
  nombre: 'Biología Marina',
  campus: 'all',
  color: '#4F7CAC',
  
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
        "color": "#C4893A"
    },
    {
        "id": "MJ",
        "nombre": "Major",
        "color": "#B05A8C"
    },
    {
        "id": "OPT",
        "nombre": "Optativo o Minor",
        "color": "#4F8F8B"
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
        "name": "Biología Marina",
        "code": "BIO130M",
        "sctCredits": 6,
        "ucCredits": 10,
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
        "name": "Invertebrados Marinos",
        "code": "BIO140M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [],
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
        "name": "Artes",
        "code": "ARTS",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Vertebrados Marinos",
        "code": "BIO205M",
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
        "type": "CM",
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
        "name": "Botánica Marina",
        "code": "BIO260M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO118C"
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
        "name": "Oceanografía General",
        "code": "BIO355M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "QIM100I",
            "FIS109C"
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
        "name": "Microbiología Marina",
        "code": "BIO342M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO355M"
        ],
        "semester": "s5"
    },
    {
        "name": "Ecología",
        "code": "BIO330C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "MJ",
        "prerequisites": [
            "BIO118C",
            "BIO230C"
        ],
        "semester": "s5"
    },
    {
        "name": "Fisiología Celular",
        "code": "BIO324C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "MJ",
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
        "type": "MJ",
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
        "type": "MJ",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Humanidades",
        "code": "HUMS",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Trabajo Experimental en Biología Marina",
        "code": "BIO374M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "MJ",
        "prerequisites": [
            "BIO130M",
            "BIO230C",
            "BIO330C"
        ],
        "semester": "s6"
    },
    {
        "name": "Fisiología Animal Comparada",
        "code": "BIO372C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "MJ",
        "prerequisites": [
            "BIO324C",
            "BIO227E"
        ],
        "semester": "s6"
    },
    {
        "name": "Ecoinformática",
        "code": "BIO408C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "MJ",
        "prerequisites": [
            "BIO230C",
            "BIO210C"
        ],
        "semester": "s6"
    },
    {
        "name": "Ciencias Sociales",
        "code": "CSOC",
        "sctCredits": 3,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Ecología Integral y Sustentabilidad",
        "code": "EISU",
        "sctCredits": 3,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Seminario de Investigación en Biología Marina I",
        "code": "BIO415M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "MJ",
        "prerequisites": [
            "BIO374M"
        ],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT1",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "OPT",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT2",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "OPT",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT3",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "OPT",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Salud y Bienestar",
        "code": "SBIE",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigación en Biología Marina II",
        "code": "BIO416M",
        "sctCredits": 15,
        "ucCredits": 25,
        "type": "MJ",
        "prerequisites": [
            "BIO415M"
        ],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT4",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "OPT",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización o Minor",
        "code": "OPT5",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "OPT",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Créditos Libres",
        "code": "OFG",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Técnicas Avanzadas en Biología Marina",
        "code": "BIO320M",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "MJ",
        "prerequisites": [
            "BIO416M"
        ],
        "electiveTrack": "track-especialidad",           
        "trackOption": "A",                              
        "trackName": "Investigación",
        "semester": "s9"
    },
    {
        "name": "Práctica Profesional Inversiva",
        "code": "BIO458E",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "MJ",
        "prerequisites": [
            "BIO416M"
        ],
        "electiveTrack": "track-especialidad",          
        "trackOption": "B",                              
        "trackName": "Experiencia Profesional",
        "semester": "s9"
    },
    {
        "name": "Optativos de Profundización",
        "code": "OPTC",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "OPT",
        "prerequisites": [],
        "electiveTrack": "track-especialidad",          
        "trackOption": "C",                             
        "trackName": "Cursos",
        "semester": "s9"
    },
    {
        "name": "Gestión, Producción y Restauración Marina",
        "code": "BIO402M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s9"
    },
    {
        "name": "Socioecología y Conservación Marina",
        "code": "BIO412M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [],
        "semester": "s9"
    },
    {
        "name": "Memoria Profesional en Biología Marina",
        "code": "BIO480M",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "CM",
        "prerequisites": [
            "BIO416M"
        ],
        "electiveGroup": "10-PI",
        "semester": "s10"
    },
    {
        "name": "Memoria de Investigación en Biología Marina",
        "code": "BIO490M",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "CM",
        "prerequisites": [
            "BIO416M"
        ],
        "electiveGroup": "10-PI",
        "semester": "s10"
    }
],
};
