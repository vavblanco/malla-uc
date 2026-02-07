import { Carrera } from '@/types/curriculum';

export const biomar: Carrera = {
  codigo: 'BIOMAR',
  nombre: 'Biología Marina',
  campus: 'cc',
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
        "prerequisites": [
          "QIM100I",
          "QIM101L"
        ],
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
        "name": "Formación General",
        "code": "OFG1",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Formación General",
        "code": "OFG2",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s2"
    },
    {
        "name": "Bases Físicas de los Procesos Biológicos",
        "code": "BIO152C",
        "sctCredits": 10,
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
        "sctCredits": 10,
        "type": "LP",
        "prerequisites": [
            "MAT1000"
        ],
        "semester": "s3"
    },
    {
        "name": "Química Orgánica I",
        "code": "QIM102B",
        "sctCredits": 10,
        "type": "LP",
        "prerequisites": [
            "QIM100B"
        ],
        "semester": "s3"
    },
    {
        "name": "Química Analítica I",
        "code": "QIM109B",
        "sctCredits": 10,
        "type": "LP",
        "prerequisites": [
            "QIM100B"
        ],
        "semester": "s3"
    },
    {
        "name": "Formación General",
        "code": "OFG3",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s3"
    },
    {
        "name": "Biología de los Microorganismos",
        "code": "BIO151E",
        "sctCredits": 10,
        "type": "FB",
        "prerequisites": [
            "BIO141C"
        ],
        "semester": "s4"
    },
    {
        "name": "Química Orgánica II",
        "code": "QIM103A",
        "sctCredits": 10,
        "type": "LP",
        "prerequisites": [
            "QIM102B"
        ],
        "semester": "s4"
    },
    {
        "name": "Análisis Instrumental",
        "code": "QIM111",
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "QIM109B"
        ],
        "semester": "s4"
    },
    {
        "name": "Formación General",
        "code": "OFG4",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Formación General",
        "code": "OFG5",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s4"
    },
    {
        "name": "Genética y Evolución",
        "code": "BIO226E",
        "sctCredits": 10,
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
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "BIO152C"
        ],
        "semester": "s5"
    },
    {
        "name": "Biología y Fisiología Celular",
        "code": "BIO274E",
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO151E",
            "BIO152C"
        ],
        "semester": "s5"
    },
    {
        "name": "Bioquímica",
        "code": "BIO257C",
        "sctCredits": 10,
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
        "sctCredits": 5,
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
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "QIM103A"
        ],
        "semester": "s5"
    },
    {
        "name": "Formación General",
        "code": "OFG6",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s5"
    },
    {
        "name": "Genética Molecular",
        "code": "BIO288C",
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO257C"
        ],
        "semester": "s6"
    },
    {
        "name": "Laboratorio de Bioquímica II: Genética Molecular",
        "code": "BIO266E",
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO257C",
            "BIO266D"
        ],
        "semester": "s6"
    },
    {
        "name": "Fisiología",
        "code": "BIO299E",
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "BIO152C",
            "BIO257C"
        ],
        "semester": "s6"
    },
    {
        "name": "Laboratorio de Fisiología",
        "code": "BIO299L",
        "sctCredits": 5,
        "type": "CM",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Química-Física I",
        "code": "QIM114B",
        "sctCredits": 10,
        "type": "CM",
        "prerequisites": [
            "MAT1100"
        ],
        "semester": "s6"
    },
    {
        "name": "Formación General",
        "code": "OFG7",
        "sctCredits": 10,
        "type": "FG",
        "prerequisites": [],
        "semester": "s6"
    },
    {
        "name": "Química-Física II",
        "code": "QIM115",
        "sctCredits": 10,
        "type": "TL",
        "prerequisites": [
            "QIM114B"
        ],
        "semester": "s7"
    },
    {
        "name": "Introducción al Laboratorio Clínico",
        "code": "MEB176B",
        "sctCredits": 10,
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
        "sctCredits": 15,
        "type": "TL",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización",
        "code": "OPR1",
        "sctCredits": 5,
        "type": "TL",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Optativo de Profundización",
        "code": "OPR2",
        "sctCredits": 10,
        "type": "TL",
        "prerequisites": [],
        "semester": "s7"
    },
    {
        "name": "Seminario de Investigación",
        "code": "BIO296F",
        "sctCredits": 30,
        "type": "TL",
        "prerequisites": [
            "BIO295A",
            "BIO266D",
            "BIO266E",
            "BIO299L"
        ],
        "semester": "s8"
    },
    {
        "name": "Práctica Extramural",
        "code": "BIO258F",
        "sctCredits": 30,
        "type": "TL",
        "prerequisites": [
            "BIO266D",
            "BIO266E",
            "BIO299L"
        ],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización",
        "code": "OPR3",
        "sctCredits": 10,
        "type": "TL",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Optativo de Profundización",
        "code": "OPR4",
        "sctCredits": 10,
        "type": "TL",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Examen de Grado",
        "code": "EXAMEN GRADO",
        "sctCredits": 10,
        "type": "TL",
        "prerequisites": [],
        "semester": "s8"
    },
    {
        "name": "Técnicas Avanzadas en Bioquímica",
        "code": "BIO3319",
        "sctCredits": 50,
        "type": "FT",
        "prerequisites": [
          "EXAMEN GRADO"
        ],
        "semester": "s9"
    },
    {
        "name": "Memoria de Investigación",
        "code": "BIO285D",
        "sctCredits": 50,
        "type": "FT",
        "prerequisites": [
          "BIO3319"
        ],
        "semester": "s10"
    }
],
};
