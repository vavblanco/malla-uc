# 🧬 Malla Interactiva FCB UC

Una aplicación web interactiva para visualizar y planificar el avance curricular de las carreras de la **Facultad de Ciencias Biológicas** de la **Pontificia Universidad Católica de Chile**.

---

## 📖 Descripción

**Malla Interactiva FCB UC** es una herramienta diseñada para estudiantes de Ciencias Biológicas de la UC que permite:

-  **Visualizar** la malla curricular completa de tu carrera
-  **Marcar** ramos aprobados, en curso o reprobados
-  **Calcular** automáticamente tu avance en créditos UC y SCT
-  **Planificar** tu graduación semestre por semestre
-  **Identificar** prerrequisitos, correquisitos y requisitos de créditos
-  **Guardar** tu progreso automáticamente en el navegador

### 🎯 ¿Para quién es?

- Estudiantes de **Biología**, **Biología Marina** y **Bioquímica**
- Estudiantes que quieren planificar su avance académico
- Quienes necesitan visualizar dependencias entre ramos
- Personas que quieren calcular cuántos semestres les quedan

---

## ✨ Características

### 🎨 Interfaz Interactiva

- **Estados de Ramos**: Marca tus ramos como pendientes, aprobados, en curso o reprobados
- **Drag & Drop**: Reorganiza ramos en el planificador de graduación
- **Tema Oscuro**: Se adapta automáticamente a tus preferencias del sistema
- **Responsive**: Funciona perfectamente en móvil, tablet y desktop
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion

### 📊 Calculadora de Avance

- **Créditos UC**: Sistema oficial de la UC
- **Créditos SCT**: Sistema de Créditos Transferibles Chile
- **Conversión Automática**: 5 SCT = 3 UC
- **Progreso Visual**: Barras de progreso por categoría
- **Estadísticas Detalladas**: Total de ramos, créditos aprobados, porcentaje de avance

### 🗓️ Planificador de Graduación

- **Distribución Inteligente**: Organiza automáticamente tus ramos pendientes
- **Validación de Prerrequisitos**: Asegura que puedas tomar cada ramo
- **Límites de Créditos**: Respeta los límites de 60 créditos UC (máximo) por semestre
- **Drag & Drop**: Reorganiza ramos entre semestres fácilmente
- **Grupos Electivos**: Maneja correctamente ramos electivos y sus opciones

### 🎓 Características Académicas UC

- **OFG Flexibles**: Indica que el orden de los OFG es referencial
- **8 Áreas OFG**: Filosofía, Teología, Artes, Ciencias Sociales, Humanidades, Salud y Bienestar, Ecología y Sustentabilidad, y Créditos Libres.
- **Tracks Electivos**: Certificados, Prácticas, Optativos
- **Correquisitos**: Ramos que deben cursarse juntos
- **Requisitos de Créditos**: Para Práctica Profesional, Seminarios, etc

### 💾 Guardado Automático

- **LocalStorage**: Tu progreso se guarda automáticamente
- **Sin Cuenta**: No requiere registro ni inicio de sesión
- **Privado**: Tus datos nunca salen de tu navegador

---

## 🎓 Carreras Disponibles

### Facultad de Ciencias Biológicas

- 🧬 **Biología** (Licenciatura en Ciencias Biológicas)
- 🌊 **Biología Marina** (Licenciatura en Biología Marina)
- ⚗️ **Bioquímica** (Licenciatura en Bioquímica)

> **Nota**: Si estudias otra carrera de la UC o de otra universidad, puedes adaptar el proyecto.

---

## 🎮 Uso

### 1. Selecciona tu Carrera

Al abrir la aplicación, selecciona tu carrera de la lista (Biología, Biología Marina o Bioquímica).

### 2. Marca tus Ramos

Haz clic en cada ramo para cambiar su estado:

- 🔵 **Pendiente** (por defecto)
- ✅ **Aprobado** (verde)

### 3. Revisa tu Avance

La **Calculadora de Créditos** se actualiza automáticamente mostrando:

- Total de créditos UC y SCT
- Ramos aprobados vs totales
- Porcentaje de avance
- Progreso por categoría

### 4. Planifica tu Graduación

Abre el **Plan de Graduación** para:

- Ver cuántos semestres te quedan
- Reorganizar ramos entre semestres
- Validar que cumples prerrequisitos
- Respetar límites de créditos

### 5. Consulta la Guía

Haz clic en el botón **📚 Guía** para aprender sobre:

- Cómo usar la malla
- Estrategias para tomar ramos
- Equivalencia de créditos UC/SCT
- OFG y su flexibilidad

---

## 📁 Estructura del Proyecto

```
malla-fcb-uc/
├── public/                  # Assets estáticos
│   ├── favicon.svg
│   ├── icon.png
│   └── screenshots/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Layout raíz + SEO
│   │   ├── page.tsx        # Página principal
│   │   └── globals.css     # Estilos globales
│   ├── components/         # Componentes React
│   │   ├── career/         # CurriculumGrid, CareerHeader
│   │   ├── layout/         # Footer, StatsBar
│   │   ├── modals/         # Todos los modales
│   │   ├── semester/       # SemesterCard, SubjectCard
│   │   └── ui/             # Componentes UI reutilizables
│   ├── data/               # Datos de carreras
│   │   └── fcb/            # Biología, Biología Marina, Bioquímica
│   ├── hooks/              # Custom React Hooks
│   │   ├── useCalculator.ts
│   │   ├── useCareerData.ts
│   │   └── useGraduationPlan.ts
│   ├── types/              # Definiciones TypeScript
│   │   └── curriculum.ts
│   └── utils/              # Utilidades
├── next.config.ts          # Configuración Next.js
├── tailwind.config.ts      # Configuración Tailwind
└── tsconfig.json           # Configuración TypeScript
```

Ver [STRUCTURE.md](./STRUCTURE.md) para documentación detallada de la arquitectura.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Hay varias formas de contribuir:

### 🎓 Agregar Carreras

Si quieres agregar otra carrera de la UC:

1. Fork el repositorio
2. Crea los archivos `data_CODIGO.ts` y `colors_CODIGO.ts` en `src/data/all/`
3. Sigue la estructura de las carreras existentes
4. Abre un Pull Request

### 📝 Mejorar Documentación

Ayuda a mejorar la documentación:

- Corrige errores o typos
- Agrega más ejemplos
- Traduce a otros idiomas
- Mejora las capturas de pantalla

---

## 🎖️ Créditos

### Proyecto Original

Este proyecto está **basado y adaptado** del trabajo de:

**[Malla Interactiva USM](https://github.com/MarceloMejias/malla-interactiva)** por [@MarceloMejias](https://github.com/MarceloMejias)

El proyecto original fue creado para la Universidad Técnica Federico Santa María (USM) y soporta **46 carreras** de múltiples campus. Este proyecto toma esa base sólida y la adapta específicamente para las carreras de **Ciencias Biológicas de la UC**.

### Agradecimientos Especiales

- **Marcelo Mejías** - Por crear la aplicación original y el sistema modular que permitió esta adaptación
- **Facultad de Ciencias Biológicas UC** - Por la información académica

### Adaptaciones Realizadas para la UC

- ✅ Sistema de créditos UC/SCT con conversión automática
- ✅ Manejo de OFG (Optativos de Formación General) flexibles
- ✅ Tracks electivos (Certificados, Prácticas, Optativos)
- ✅ Requisitos de créditos para ramos específicos
- ✅ Mallas de Biología, Biología Marina y Bioquímica
- ✅ Guía específica para estudiantes UC
- ✅ Calculadora adaptada al sistema UC
- ✅ Colores y branding UC

---

# 📞 Contacto y Soporte

## Mantener del Proyecto

- **Nombre**: Vicente Villalobos Blanco
- **GitHub**: [@vavblanco](https://github.com/vavblanco)
- **Organización**: Consejería Académica de Ciencias Biológicas

## Proyecto Original

- **Autor**: Marcelo Mejías
- **Repo Original**: [malla-interactiva](https://github.com/MarceloMejias/malla-interactiva)

## Reportar Problemas

- [Issues de este proyecto](https://github.com/vavblanco/malla-uc/issues)
- [Issues del proyecto original](https://github.com/MarceloMejias/malla-interactiva/issues)

---

## 📚 Recursos Adicionales

### Documentación

- [STRUCTURE.md](./STRUCTURE.md) - Arquitectura del proyecto

### Enlaces Útiles

- [Facultad de Ciencias Biológicas UC](https://biologia.uc.cl/)
- [Sistema de Créditos UC](https://registrosacademicos.uc.cl/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)

---


<div align="center">
  
  **Hecho con ❤️ para estudiantes de Ciencias Biológicas UC**
  
  Basado en [Malla Interactiva USM](https://github.com/MarceloMejias/malla-interactiva) por [@MarceloMejias](https://github.com/MarceloMejias)
  
  [⬆ Volver arriba](#-malla-interactiva-fcb-uc)

</div>

