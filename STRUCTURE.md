# 📁 Estructura del Proyecto - Malla FCB UC

> Documentación de la arquitectura y organización del código  
> Adaptado de [Malla Interactiva USM](https://github.com/MarceloMejias/malla-interactiva)

---

## 🏗️ Arquitectura General

```
malla-fcb-uc/
├── public/              # Archivos estáticos y assets públicos
├── scripts/             # Scripts de utilidad para desarrollo (opcional)
├── src/                 # Código fuente de la aplicación
│   ├── app/            # Next.js App Router (páginas y layout)
│   ├── components/     # Componentes React organizados por dominio
│   ├── data/           # Datos de carreras FCB
│   ├── hooks/          # Custom React Hooks
│   ├── types/          # Definiciones TypeScript
│   └── utils/          # Utilidades y helpers
├── out/                # Build estático generado (git-ignored)
└── node_modules/       # Dependencias (git-ignored)
```

---

## 📦 Directorio `src/`

### `src/app/` - Next.js App Router

```
app/
├── layout.tsx          # Layout raíz con metadata SEO
├── page.tsx            # Página principal (/)
├── globals.css         # Estilos globales Tailwind
└── favicon.svg         # Favicon del sitio (o en /public/malla-uc/)
```

**`layout.tsx`**: 
- Configuración de fonts (Geist Sans & Mono o Inter)
- Meta tags SEO completos (Open Graph, Twitter Cards)
- PWA metadata y configuración iOS
- Favicon references apuntando a `/malla-uc/favicon.svg`
- Providers de tema y service worker (opcional)

**`page.tsx`**: 
- Punto de entrada de la aplicación
- Renderiza `CurriculumGrid` principal
- Manejo de selección de carrera

---

### `src/components/` - Componentes React

Organización por dominio funcional para mejor mantenibilidad:

```
components/
├── career/             # Componentes relacionados a carreras
│   ├── CareerHeader.tsx      # Header con selector y acciones
│   └── CurriculumGrid.tsx    # Componente principal de la app
│
├── layout/             # Componentes de layout y estructura
│   ├── Footer.tsx            # Footer con créditos y links
│   └── StatsBar.tsx          # Barra de estadísticas de progreso
│
├── modals/             # Todos los modales de la aplicación
│   ├── CareerSelector.tsx           # Modal de selección de carrera
│   ├── CategoriesModal.tsx          # Modal de info de categorías
│   ├── ContributeModal.tsx          # Modal de contribución (opcional)
│   ├── GraduationPlanModal.tsx      # Planificador de graduación ⭐
│   └── GuideModal.tsx               # Guía de uso adaptada UC ⭐
│
├── semester/           # Componentes de semestres y materias
│   ├── SemesterCard.tsx      # Card de semestre individual
│   ├── SemesterGrid.tsx      # Grid de todos los semestres
│   └── SubjectCard.tsx       # Card de materia con drag & drop ⭐
│
├── ui/                 # Componentes UI reutilizables
│   ├── ProgressToast.tsx     # Toast de progreso
│   └── Tooltip.tsx           # Tooltip genérico
│
└── utils/              # Componentes de utilidad y configuración
    ├── AppleSplashScreens.tsx    # Splash screens para iOS (opcional)
    ├── ServiceWorkerRegister.tsx # Registro de SW para PWA (opcional)
    └── ThemeColor.tsx            # Meta theme-color dinámico
```

#### Componentes Principales Adaptados

**`CurriculumGrid.tsx`**:
- Componente principal que orquesta toda la aplicación
- Maneja estado global con custom hooks
- Lazy loading de modales pesados (GraduationPlan, Guide)
- Coordinación de drag & drop y actualización de estado
- **Adaptación UC**: Manejo de créditos UC/SCT

**`SubjectCard.tsx`** ⭐ **ADAPTADO PARA UC**:
- Tarjeta de materia con estados (pending/approved/current/failed)
- Drag & drop functionality
- **Nuevos indicadores UC**:
  - 🔀 Grupos electivos (borde morado)
  - A/B/C Tracks electivos (letra con anillo morado)
  - 🔗 Correquisitos (borde punteado naranja)
  - 🏆 Requisitos de créditos (ej: 120 UC para Práctica)
- Click en prerrequisitos para buscarlos
- Animaciones con Framer Motion
- Tooltip con información detallada UC/SCT

**`GraduationPlanModal.tsx`** ⭐ **ADAPTADO PARA UC**:
- Planificador semestral drag & drop
- Validación de prerrequisitos
- **Límites de créditos UC**: 50 UC normal, 60 UC máximo
- Distribución inteligente de materias
- **Manejo de grupos electivos**: Solo una opción por grupo
- **Manejo de tracks electivos**: Opciones mutuamente excluyentes (A/B/C)
- **OFG flexibles**: Indica que el orden es referencial
- Exportación de plan (opcional)

**`GuideModal.tsx`** ⭐ **NUEVO - ESPECÍFICO UC**:
3 pestañas con información para estudiantes UC:
1. **Usar la Malla**: Estados, indicadores visuales, funciones
2. **Tomar Ramos**: 
   - Límites de créditos (50/60 UC)
   - OFG flexibles (orden referencial)
   - 4 áreas obligatorias
   - Estrategias de planificación
3. **Créditos**:
   - Equivalencia UC ↔ SCT (5 SCT = 3 UC)
   - Ejemplos de conversión
   - Totales de graduación (~300 UC)

---

### `src/data/` - Datos de Carreras FCB

Estructura organizada para Facultad de Ciencias Biológicas:

```
data/
├── carreras/
│   └── index.ts           # Índice maestro de todas las carreras FCB
│
└── fcb/                   # Facultad de Ciencias Biológicas UC
    ├── data_BIO.ts        # Biología (Licenciatura en Ciencias Biológicas)
    ├── colors_BIO.ts      # Colores por categoría para Biología
    ├── data_BIOMAR.ts     # Biología Marina
    ├── colors_BIOMAR.ts   # Colores para Biología Marina
    ├── data_BIOQ.ts       # Bioquímica
    └── colors_BIOQ.ts     # Colores para Bioquímica
```

**Convención de nombres**:
- `data_CODIGO.ts`: Estructura de la malla curricular
- `colors_CODIGO.ts`: Paleta de colores por categoría

**Ejemplo de estructura adaptada UC**:

```typescript
import { Subject } from '@/types/curriculum';

export const BIO: Subject[] = [
  {
    name: 'Cálculo I',
    code: 'MAT1610',
    sctCredits: 10,      // Créditos SCT (conversión: 10 * 5/3 ≈ 17)
    ucCredits: 17,   // Créditos UC 
    category: 'Formación Básica',
    prerequisites: [],
    semester: 's1',
  },
  {
    name: 'Biología Celular y Molecular',
    code: 'BIO141E',
    credits: 10,
    sctCredits: 17,
    category: 'Ciencias Biológicas',
    prerequisites: [],
    corequisites: ['BIO142E'], // ⭐ NUEVO: Correquisitos
    semester: 's1',
  },
  {
    name: 'Práctica Profesional',
    code: 'BIO458E',
    credits: 10,
    sctCredits: 17,
    category: 'Práctica',
    prerequisites: [],
    creditRequirement: 120,     // ⭐ NUEVO: Requiere 120 UC aprobados
    semester: 's9',
    electiveTrack: 'track_s9',  // ⭐ NUEVO: Track electivo
    trackOption: 'B',           // Opción B del track
  },
  {
    name: 'OFG Salud',
    code: 'OFG-SALUD',
    credits: 5,
    sctCredits: 8,
    category: 'OFG',
    prerequisites: [],
    semester: 's3',
    electiveGroup: 'ofg_salud', // ⭐ Grupo electivo (uno de varios)
  },
];
```

**Nuevas propiedades para UC**:

```typescript
interface Subject {
  // ... propiedades básicas
  ucCredits?: number;           // ⭐ Créditos UC (conversión automática si no se especifica)
  corequisites?: string[];       // ⭐ Ramos que deben cursarse juntos
  creditRequirement?: number;    // ⭐ UC necesarios para tomar el ramo
  electiveGroup?: string;        // Grupo electivo (ej: ofg_salud)
  electiveTrack?: string;        // Track electivo (ej: track_s9)
  trackOption?: 'A' | 'B' | 'C'; // Opción del track (mutuamente excluyente)
  trackName?: string;            // Nombre descriptivo del track
}
```

---

### `src/hooks/` - Custom React Hooks

```
hooks/
├── useCalculator.ts         # Lógica de cálculo de progreso ⭐ ADAPTADO
├── useCareerData.ts         # Carga de datos de carreras FCB
├── useConfetti.ts           # Animación de confetti
├── useDarkMode.ts           # Detección y manejo de tema
├── useGraduationPlan.ts     # Lógica del planificador ⭐ ADAPTADO
└── useOGImage.ts            # Generación de OG images (opcional)
```

#### Hooks Adaptados para UC

**`useCalculator.ts`** ⭐ **ADAPTADO**:
- Estado de materias (pending/approved/current/failed)
- **Cálculo dual**: Créditos UC y SCT
- **Conversión automática**: Si falta `sctCredits`, calcula `credits * 5/3`
- Validación de prerrequisitos
- **Validación de correquisitos**: Ramos que deben cursarse juntos
- **Validación de requisitos de créditos**: Ej: 120 UC para Práctica
- Persistencia en localStorage con clave `fcb_uc_progress`
- Manejo de drag & drop entre estados

**`useCareerData.ts`**:
- Carga dinámica de datos de carrera FCB
- Manejo de colores por categoría
- Caché en memoria
- Gestión de errores de carga

**`useGraduationPlan.ts`** ⭐ **ADAPTADO**:
- Distribución de materias por semestre
- **Validación de límites UC**: 50 UC normal, 60 UC máximo
- Drag & drop entre semestres
- Cálculo de materias habilitadas
- **Manejo de grupos electivos**: Solo cuenta uno del grupo
- **Manejo de tracks electivos**: Opciones A/B/C mutuamente excluyentes
- **OFG como referencia**: No fuerza orden específico
- Persistencia del plan con clave `fcb_uc_graduation_plan`

**`useDarkMode.ts`**:
- Detección de preferencia del sistema
- Toggle manual de tema
- Actualización de meta theme-color
- Sincronización con localStorage

---

### `src/types/` - Definiciones TypeScript

```
types/
└── curriculum.ts           # Todas las interfaces del proyecto
```

**Interfaces adaptadas para UC**:

```typescript
// Materia individual - EXTENDIDA PARA UC
interface Subject {
  name: string;
  code: string;
  sctCredits: number;              // Créditos SCT (sistema oficial)
  ucCredits?: number;          // ⭐ Créditos UC (conversión automática si no existe)
  category: string;
  prerequisites: string[];
  semester: string;             // 's1', 's2', etc.
  
  // ⭐ NUEVAS PROPIEDADES UC
  corequisites?: string[];      // Ramos que deben cursarse simultáneamente
  creditRequirement?: number;   // UC necesarios antes de tomar este ramo
  electiveGroup?: string;       // ID del grupo electivo (uno de varios)
  electiveTrack?: string;       // ID del track electivo
  trackOption?: 'A' | 'B' | 'C';// Opción del track (mutuamente excluyente)
  trackName?: string;           // Nombre descriptivo del track
}

// Estado de una materia
type SubjectState = 'pending' | 'approved' | 'current' | 'failed';

// Carrera completa
interface Career {
  name: string;
  code: string;
  faculty: 'FCB';              // Facultad de Ciencias Biológicas
  subjects: Subject[];
}

// Colores por categoría
interface SubjectColors {
  [categoria: string]: [string, string]; // [color, descripción]
}

// Estado global del calculador
interface CalculatorState {
  [codigo: string]: SubjectState;
}

// ⭐ NUEVO: Estadísticas de progreso UC
interface ProgressStats {
  totalSubjects: number;
  approvedSubjects: number;
  totalCreditsUC: number;
  approvedCreditsUC: number;
  totalCreditsSCT: number;
  approvedCreditsSCT: number;
  progressPercentage: number;
  creditsByCategory: {
    [category: string]: {
      totalUC: number;
      approvedUC: number;
      totalSCT: number;
      approvedSCT: number;
    };
  };
}
```

---

### `src/utils/` - Utilidades

```
utils/
├── logger.ts              # Logger condicional para desarrollo
└── creditConverter.ts     # ⭐ NUEVO: Conversión UC ↔ SCT
```

**`logger.ts`**:
```typescript
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => isDev && console.error(...args),
  warn: (...args) => isDev && console.warn(...args),
  info: (...args) => isDev && console.info(...args),
};
```

**`creditConverter.ts`** ⭐ **NUEVO**:
```typescript
/**
 * Convierte créditos UC a SCT
 * Fórmula: SCT = UC × (5/3)
 */
export function ucToSct(uc: number): number {
  return Math.round((uc * 5) / 3);
}

/**
 * Convierte créditos SCT a UC
 * Fórmula: UC = SCT × (3/5)
 */
export function sctToUc(sct: number): number {
  return Math.round((sct * 3) / 5);
}

/**
 * Retorna ambos valores en un objeto
 */
export function convertCredits(value: number, from: 'UC' | 'SCT') {
  if (from === 'UC') {
    return { uc: value, sct: ucToSct(value) };
  } else {
    return { uc: sctToUc(value), sct: value };
  }
}
```

---

## 🎨 `public/` - Assets Públicos

```
public/
├── malla-uc/              # Assets específicos del proyecto ⭐
│   ├── favicon.svg        # Favicon vectorial optimizado (472 bytes)
│   ├── icon.png           # PWA icon 192x192
│   ├── android-chrome-512x512.png
│   └── apple-touch-icon.png
├── og-image.svg           # Open Graph image (opcional)
├── thumbnail.png          # Preview image
├── site.webmanifest       # PWA manifest
├── robots.txt
└── sitemap.xml
```

---

## 🔧 Archivos de Configuración

### `next.config.ts`

```typescript
const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',           // Static export para GitHub Pages
  basePath: isProd ? '/malla-fcb-uc' : '',
  images: {
    unoptimized: true,        // Requerido para static export
  },
  compiler: {
    removeConsole: isProd ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      'framer-motion',
    ],
  },
};
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `tailwind.config.ts`

```typescript
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // Automático según preferencia del sistema
  theme: {
    extend: {
      colors: {
        // Colores UC/FCB
        uc: {
          blue: '#003D7C',
          green: '#00703C',
          lightblue: '#009FE3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
```

### `package.json`

Scripts disponibles:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build && next export"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "@fortawesome/free-solid-svg-icons": "^6.5.0"
  }
}
```

---

## 🔄 Flujo de Datos

```
Usuario → CurriculumGrid
           ↓
     useCalculator (estado + conversión UC/SCT)
           ↓
   useCareerData (datos FCB)
           ↓
     SemesterGrid → SemesterCard → SubjectCard
           ↓                          ↓
   localStorage (persistencia)    Indicadores UC
                                  (correquisitos,
                                   tracks, OFG)
```

### Estado Global (sin Redux)

El proyecto usa **React Hooks** para manejo de estado:

1. **Estado local**: `useState` en componentes
2. **Estado compartido**: Custom hooks
3. **Persistencia**: `localStorage` con prefijo `fcb_uc_`
4. **Caché**: Variables de módulo para datos estáticos

**Ventajas**:
- Simplicidad: No requiere Redux/Zustand
- Performance: Memoización con `useMemo`/`useCallback`
- Type-safe: TypeScript en toda la cadena
- Testeable: Hooks son funciones puras

---

## 🎯 Patrones de Diseño Aplicados

### 1. **Lazy Loading** (Code Splitting)

```typescript
const GraduationPlanModal = dynamic(
  () => import('./modals/GraduationPlanModal'),
  { ssr: false }
);
const GuideModal = dynamic(
  () => import('./modals/GuideModal'),
  { ssr: false }
);
```

Reduce bundle inicial cargando modales bajo demanda.

### 2. **Custom Hooks** (Separation of Concerns)

Lógica de negocio separada de la presentación:
- `useCalculator`: Lógica de cálculo + conversión UC/SCT
- `SubjectCard`: Presentación + indicadores visuales UC

### 3. **Compound Components**

```typescript
<SemesterGrid>
  <SemesterCard>
    <SubjectCard />
  </SemesterCard>
</SemesterGrid>
```

### 4. **Conditional Rendering** (Loading States)

```typescript
{!careerData ? <Loading /> : <CurriculumGrid />}
```

---

## 🚀 Optimizaciones Implementadas

### Bundle Size

- ✅ Lazy loading de modales (~2000 líneas on-demand)
- ✅ Tree-shaking de Font Awesome e íconos
- ✅ Optimización de imports con `experimental.optimizePackageImports`
- ✅ Favicon SVG

### Performance

- ✅ Memoización de conversiones UC/SCT (`useMemo`)
- ✅ Callbacks estables (`useCallback`)
- ✅ Caché de datos de carreras en memoria
- ✅ Scroll optimizado con `scroll-smooth`

### SEO

- ✅ Meta tags completos (Open Graph, Twitter Cards)
- ✅ Sitemap.xml y robots.txt
- ✅ Structured data para buscadores
- ✅ Favicon multi-formato (SVG, PNG, ICO)

### Developer Experience

- ✅ TypeScript strict mode
- ✅ Path aliases (`@/*`)
- ✅ Logger condicional (solo dev)
- ✅ Hot reload con Turbopack
- ✅ Documentación inline + README detallado

---

## 📊 Métricas del Proyecto

### Tamaño del Código

- **Total**: ~8,000 líneas (vs ~15,000 del proyecto original)
- **Componentes**: ~2,500 líneas
- **Hooks**: ~1,000 líneas
- **Datos**: ~3,500 líneas (3 carreras FCB)
- **Nuevos componentes UC**: ~1,000 líneas

### Bundle Size (estimado)

- **Initial**: ~180KB gzipped (incluye conversión UC/SCT)
- **Modals** (lazy): ~100KB gzipped (GuideModal nuevo)
- **Total hydrated**: ~280KB gzipped

### Carreras Soportadas

- **Facultad de Ciencias Biológicas**: 3 carreras
  - Biología
  - Biología Marina
  - Bioquímica
- **Total**: 3 mallas curriculares UC

---

## 🤝 Guías de Contribución

### Agregar Nuevo Componente

1. **Crear archivo** en la carpeta correspondiente:
   ```
   src/components/[dominio]/ComponentName.tsx
   ```

2. **Seguir estructura**:
   ```typescript
   'use client'; // si usa hooks
   
   import { ... } from '...';
   
   interface ComponentNameProps {
     // props con JSDoc
   }
   
   export default function ComponentName({ ... }: ComponentNameProps) {
     // lógica
     return (/* JSX */);
   }
   ```

3. **Importar donde se necesite**:
   ```typescript
   import ComponentName from '@/components/dominio/ComponentName';
   ```

### Agregar Nueva Carrera FCB

1. **Crear archivos de datos**:
   ```
   src/data/fcb/data_CODIGO.ts
   src/data/fcb/colors_CODIGO.ts
   ```

2. **Seguir estructura de Subject** con propiedades UC:
   ```typescript
   export const CODIGO: Subject[] = [
     {
       name: '...',
       code: '...',
       credits: 10,        // UC
       sctCredits: 17,     // SCT (o conversión automática)
       category: '...',
       prerequisites: [],
       corequisites: [],   // Si aplica
       creditRequirement: 120, // Si aplica
       semester: 's1',
     },
   ];
   ```

3. **Agregar a índice**:
   ```typescript
   // src/data/carreras/index.ts
   import { CODIGO } from '../fcb/data_CODIGO';
   
   export const careers = {
     // ...
     CODIGO,
   };
   ```

---

## 📚 Referencias y Recursos

### Documentación

- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Proyecto Original

- [Malla Interactiva USM](https://github.com/MarceloMejias/malla-interactiva) por [@MarceloMejias](https://github.com/MarceloMejias)
- [Documentación Original](https://github.com/MarceloMejias/malla-interactiva/blob/main/STRUCTURE.md)

### UC

- [Sistema de Créditos UC](https://registrosacademicos.uc.cl/)
- [Facultad de Ciencias Biológicas](https://biologia.uc.cl/)

---

## 🎖️ Créditos y Adaptaciones

### Proyecto Base

Este proyecto está **basado y adaptado** de:

**[Malla Interactiva USM](https://github.com/MarceloMejias/malla-interactiva)**  
Creado por [@MarceloMejias](https://github.com/MarceloMejias)

El proyecto original fue diseñado para la **Universidad Técnica Federico Santa María (USM)** y soporta 46 carreras de múltiples campus. Esta versión toma esa sólida base y la adapta específicamente para las carreras de **Ciencias Biológicas de la UC**.

### Adaptaciones Realizadas para UC

#### 1. Sistema de Créditos Dual (UC/SCT)

- ✅ Conversión automática UC ↔ SCT (5 SCT = 3 UC)
- ✅ Ambos sistemas visibles en tooltips y calculadora
- ✅ Fórmulas: `UC = SCT × (3/5)` y `SCT = UC × (5/3)`

#### 2. Nuevas Propiedades de Subject

- ✅ `sctCredits`: Créditos SCT
- ✅ `corequisites`: Ramos que deben cursarse juntos
- ✅ `creditRequirement`: UC necesarios para tomar el ramo
- ✅ `electiveTrack` + `trackOption`: Opciones mutuamente excluyentes

#### 3. Indicadores Visuales UC

- ✅ 🔀 Grupos electivos (borde morado)
- ✅ A/B/C Tracks electivos (letra con anillo morado)
- ✅ 🔗 Correquisitos (borde punteado naranja)
- ✅ 🏆 Requisitos de créditos (icono de trofeo)

#### 4. OFG (Optativos de Formación General)

- ✅ Orden flexible (no obligatorio seguir la malla)
- ✅ 4 áreas obligatorias: Salud, Artes, Humanidades, Ciencias Sociales
- ✅ Documentación específica en GuideModal

#### 5. Límites de Créditos UC

- ✅ Normal: 50 UC por semestre
- ✅ Máximo: 60 UC por semestre
- ✅ Validación en GraduationPlanModal

#### 6. GuideModal Nuevo

- ✅ 3 pestañas: Usar la Malla / Tomar Ramos / Créditos
- ✅ Información específica UC
- ✅ Ejemplos de conversión UC/SCT
- ✅ Consejos para estudiantes UC

#### 7. Datos de Carreras FCB

- ✅ Biología (Licenciatura en Ciencias Biológicas)
- ✅ Biología Marina (Licenciatura en Ciencias Biológicas Marinas)
- ✅ Bioquímica (Licenciatura en Bioquímica)

#### 8. Branding y Colores

- ✅ Colores UC/FCB (azul UC, verde UC)
- ✅ Favicon optimizado (91KB → 472 bytes)
- ✅ Meta tags con Open Graph

---

**Basado en**: [Malla Interactiva USM](https://github.com/MarceloMejias/malla-interactiva) por [@MarceloMejias](https://github.com/MarceloMejias)
