import { Carrera } from '@/types/curriculum';

export const biomar_0: Carrera = {
  codigo: 'BIOMAR-0',
  nombre: 'Biología Marina (Malla Antigua)',
  campus: 'all',
  color: '#4F7CAC',
  
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
        "nombre": "Habilidades Comunicativas y Perfil UC",
        "color": "#9EA772"
    }
],

  asignaturas: [
    {
        "name": "Biología Marina",
        "code": "BIO116M",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "LP",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Biología de la Célula",
        "code": "BIO141C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Laboratorio de Química General",
        "code": "QIM101L",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
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
        "name": "Precálculo",
        "code": "MAT1000",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s1"
    },
    {
        "name": "Filosofía: ¿Para qué?",
        "code": "FIL2001",
        "sctCredits": 6,
        "ucCredits": 10,
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
        "name": "Biología de Organismos y Comunidades",
        "code": "BIO110C",
        "sctCredits": 0,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Invertebrados Marinos",
        "code": "BIO150M",
        "sctCredits": 0,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO116M"
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
        "name": "Bases Físicas de los Procesos Biológicos",
        "code": "BIO152C",
        "sctCredits": 6,
        "ucCredits": 10,
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
        "name": "Formación General",
        "code": "OFG1",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Formación General",
        "code": "OFG2",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Biología de los Microorganismos",
        "code": "BIO151E",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FB",
        "prerequisites": [
            "BIO141C"
        ],
        "semester": "s4"
    },
    {
        "name": "Botánica Marina",
        "code": "BIO120M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": ["BIO116M"],
        "semester": "s4"
    },
    {
        "name": "Química-Física",
        "code": "QIM150",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "LP",
        "prerequisites": [
            "MAT1100",
            "FIS109C",
            "QIM100B"
        ],
        "semester": "s4"
    },
    {
        "name": "Formación General",
        "code": "OFG3",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Formación General",
        "code": "OFG4",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Genética y Evolución",
        "code": "BIO226E",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO141C",
            "BIO242C"
        ],
        "semester": "s5"
    },
    {
        "name": "Vertebrados Marinos",
        "code": "BIO250M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO116M"
        ],
        "semester": "s5"
    },
    {
        "name": "Bioquímica y Genética Molecular",
        "code": "BIO228C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "QIM200"
        ],
        "semester": "s5"
    },
    {
        "name": "Laboratorio de Bioquímica: Biología Celular",
        "code": "BIO297C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "QIM200",
            "BIO151E"
        ],
        "semester": "s5"
    },
    {
        "name": "Formación General",
        "code": "OFG5",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Ecología",
        "code": "BIO231C",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO110C",
            "BIO242C"
        ],
        "corequisites": ["BIO298M"],
        "semester": "s6"
    },
    {
        "name": "Trabajo Experimental en Ecología Marina",
        "code": "BIO298M",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "CM",
        "prerequisites": [
            "BIO242C"
        ],
        "corequisites": [
            "BIO237M",
            "BIO231C"
        ],
        "semester": "s6"
    },
    {
        "name": "Oceanografía General",
        "code": "BIO237M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "FIS109C",
            "MAT1100"
        ],
        "semester": "s6"
    },
    {
        "name": "Fisiología",
        "code": "BIO299E",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO152C",
            "BIO228C"
        ],
        "corequisites": [
            "BIO299L"
        ],
        "semester": "s6"
    },
    {
        "name": "Laboratorio de Fisiología",
        "code": "BIO299L",
        "sctCredits": 3,
        "ucCredits": 5,
        "type": "CM",
        "prerequisites": [],
        "corequisites": [
            "BIO299E"
        ],
        "semester": "s6"
    },
    {
        "name": "Formación General",
        "code": "OFG6",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Microbiología Marina",
        "code": "BIO277M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "TL",
        "prerequisites": [
            "BIO151E"
        ],
        "semester": "s7"
    },
    {
        "name": "Oceanografía Físico-Biológica",
        "code": "BIO327M",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "TL",
        "prerequisites": [
            "BIO237M"
        ],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigacion Departamental",
        "code": "BIO295A",
        "sctCredits": 9,
        "type": "TL",
        "prerequisites": [
            "BIO299L"
        ],
        "semester": "s7"
    },
    {
        "name": "Formación General",
        "code": "OFG7",
        "sctCredits": 6,
        "ucCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigación",
        "code": "BIO296M",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "TL",
        "prerequisites": [
            "BIO295A",
            "BIO297C",
            "BIO298M",
            "BIO299L"
        ],
        "electiveTrack": "track-especialidad",           
        "trackOption": "A",                              
        "trackName": "Cursos + Investigación",
        "semester": "s8"
    },
    {
        "name": "Práctica Extramural",
        "code": "BIO258E",
        "sctCredits": 18,
        "ucCredits": 30,
        "type": "TL",
        "prerequisites": [
            "BIO295A",
            "BIO297C",
            "BIO298M",
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
        "semester": "s8",
        "electiveTrack": "track-especialidad",           
        "trackOption": "C",                              
        "trackName": "Cursos + Cursos" 
    },
    {
        "name": "Optativos de Profundización",
        "code": "OPR1",
        "sctCredits": 15,
        "ucCredits": 25,
        "type": "TL",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Examen de Grado",
        "code": "EXAMEN GRADO",
        "sctCredits": 0,
        "ucCredits": 0,
        "type": "TL",
        "prerequisites": [
            "VRA2000",
            "VRA100C",
            "VRA4000"
        ],
        "creditRequirement": 405,
        "semester": "s8"
    },
    {
        "name": "Optativos de Profundización del Título Profesional",
        "code": "OPRT",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "FT",
        "prerequisites": [],
        "semester": "s9"
    },
    {
        "name": "Memoria Investigación Dirigida",
        "code": "BIO2350",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "FT",
        "prerequisites": [
          "EXAMEN GRADO"
        ],
        "electiveGroup": "10-TIT",
        "semester": "s10"
    },
    {
        "name": "Memoria de Investigación en Biología Marina",
        "code": "BIO285M",
        "sctCredits": 30,
        "ucCredits": 50,
        "type": "FT",
        "prerequisites": [
          "EXAMEN GRADO"
        ],
        "electiveGroup": "10-TIT",
        "semester": "s10"
    }
],
};
