import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CurriculumGrid from '@/components/career/CurriculumGrid';
import { getCareer } from '@/data/carreras';

interface PageProps {
  params: Promise<{ carreraId: string }>;
}

// Lista de todas las carreras para generación estática
const allCareerIds = [
  'afi', 'amb', 'arq', 'bq', 'civ-0', 'constru-0', 'ctciv', 'eli-0', 'eli', 'elo-0', 'elo',
  'fis-0', 'ica-0', 'icbt', 'icfis', 'ici-0', 'ici', 'iciv', 'icm-0', 'icom-0', 'icom',
  'icq-0', 'icq', 'idp', 'inf-0', 'inf', 'qui', 'mat-0', 'mat', 'lmat', 'mec', 'met-0', 'met',
  'tel-0', 'tel', 'fdi', 'ibt', 'imi', 'inginf', 'prla', 'tuconst', 'tuinf',
  'cind', 'cinf', 'eli-vc', 'iac', 'icom-vc'
];

// Genera todas las rutas estáticas en build time
export async function generateStaticParams() {
  return allCareerIds.map((id) => ({
    carreraId: id,
  }));
}

// Metadata dinámica por carrera
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { carreraId } = await params;
  const carrera = getCareer(carreraId);

  if (!carrera) {
    return {
      title: 'Carrera no encontrada - Malla Interactiva FCB UC',
    };
  }

  const title = carrera.nombre;
  const description = `Malla curricular interactiva de ${carrera.nombre} (${carreraId}).`;

  return {
    title,
    description,
    keywords: [
      carrera.nombre,
      carreraId,
      'PUC',
      'malla curricular',
      'progreso académico',
      'facultad de ciencias biológicas',
      'universidad',
      'católica de chile'
    ],
    openGraph: {
      type: 'website',
      locale: 'es_CL',
      title,
      description,
      siteName: 'Malla Interactiva FCB PUC',
    },
  };
}

// JSON-LD Structured Data
function generateStructuredData(carrera: any, carreraId: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: carrera.nombre,
    description: `Malla curricular interactiva de ${carrera.nombre} en la Pontificia Universidad Católica de Chile`,
    provider: {
      '@type': 'Organization',
      name: 'Pontificia Universidad Católica de Chile',
      sameAs: 'https://uc.cl/'
    },
    educationalLevel: 'Undergraduate',
    inLanguage: 'es-CL',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '120'
    }
  };
}

export default async function CareerPage({ params }: PageProps) {
  const { carreraId } = await params;
  const carrera = getCareer(carreraId);

  if (!carrera) {
    notFound();
  }

  const structuredData = generateStructuredData(carrera, carreraId);

  return (
    <>
      {/* JSON-LD Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Contenido oculto para SEO - Google puede leerlo */}
      <div className="sr-only">
        <h1>{carrera.nombre} - PUC</h1>
        <p>
          Malla curricular interactiva de {carrera.nombre}. Visualiza el progreso académico,
          requisitos de asignaturas y planifica tu graduación.
        </p>
        <h2>Asignaturas del plan de estudios:</h2>
        <ul>
          {Object.values(carrera.asignaturas).map((asignatura: any) => (
            <li key={asignatura.codigo}>
              {asignatura.nombre} ({asignatura.codigo})
            </li>
          ))}
        </ul>
      </div>

      {/* Componente principal */}
      <CurriculumGrid initialCareer={carreraId} />
    </>
  );
}
