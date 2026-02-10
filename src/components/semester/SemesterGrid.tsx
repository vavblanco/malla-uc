import SemesterCard from './SemesterCard';
import { Subject, SubjectColors, SubjectState } from '@/types/curriculum';
import { useRef, useEffect, useState } from 'react';

interface SemesterGridProps {
  subjects: Subject[];
  subjectStates: Record<string, SubjectState>;
  onStateChange: (code: string, state: SubjectState) => void;
  colors: SubjectColors;
  onPrerequisiteClick: (subjectCode: string) => void;
  findSubjectByCode: (code: string) => Subject | undefined;
  darkMode: boolean;
  subjectRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  approvedCredits?: number;
}

export default function SemesterGrid({
  subjects,
  subjectStates,
  onStateChange,
  colors,
  onPrerequisiteClick,
  findSubjectByCode,
  darkMode,
  subjectRefs,
  approvedCredits = 0
}: SemesterGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const getSemesterSubjects = (semester: string) => {
    return subjects.filter(subject => subject.semester === semester);
  };

  // Calcular el número máximo de semestres dinámicamente
  const getMaxSemesters = () => {
    if (subjects.length === 0) return 8;
    
    const semesterNumbers = subjects
      .map(subject => subject.semester)
      .filter((semester): semester is string => semester !== undefined && semester.startsWith('s'))
      .map(semester => parseInt(semester.replace('s', '')))
      .filter(num => !isNaN(num));
    
    return semesterNumbers.length > 0 ? Math.max(...semesterNumbers) : 8;
  };

  const maxSemesters = getMaxSemesters();

  // Actualizar progreso del scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Calcular inicial

    return () => container.removeEventListener('scroll', handleScroll);
  }, [maxSemesters]);

  return (
    <div className="w-full">
      {/* Móvil: Grid de 2 columnas que se adapta al contenido */}
      <div className="grid grid-cols-2 gap-1 w-full md:hidden">
        {Array.from({ length: maxSemesters }, (_, i) => `s${i + 1}`).map((semester) => {
          const semesterSubjects = getSemesterSubjects(semester);
          
          return (
            <SemesterCard
              key={semester}
              semester={semester}
              subjects={semesterSubjects}
              subjectStates={subjectStates}
              onStateChange={onStateChange}
              colors={colors}
              onPrerequisiteClick={onPrerequisiteClick}
              findSubjectByCode={findSubjectByCode}
              darkMode={darkMode}
              subjectRefs={subjectRefs}
              approvedCredits={approvedCredits}
              allSubjects={subjects}
            />
          );
        })}
      </div>

      {/* Desktop: Flex horizontal con scroll */}
      <div className="hidden md:block md:w-full">
        {/* Barra de scroll visual arriba */}
        {maxSemesters > 4 && (
          <div className="mb-4 px-4">
            <div className={`relative h-1 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`absolute h-1 rounded-full transition-all duration-200 ${
                  darkMode ? 'bg-blue-500' : 'bg-blue-600'
                }`}
                style={{ 
                  width: `${Math.max(20, (1 / maxSemesters) * 100 * 4)}%`,
                  left: `${scrollProgress}%`,
                  transform: `translateX(-${scrollProgress}%)`
                }}
              />
            </div>
            <div className={`text-xs text-center mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              ← Desliza para ver todos los semestres →
            </div>
          </div>
        )}

        {/* Contenedor con scroll */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div 
            className="flex flex-row gap-2 px-2"
            style={{ 
              minWidth: `${maxSemesters * 168}px`,
              width: 'max-content'
            }}
          >
            {Array.from({ length: maxSemesters }, (_, i) => `s${i + 1}`).map((semester) => {
              const semesterSubjects = getSemesterSubjects(semester);
              
              return (
                <SemesterCard
                  key={semester}
                  semester={semester}
                  subjects={semesterSubjects}
                  subjectStates={subjectStates}
                  onStateChange={onStateChange}
                  colors={colors}
                  onPrerequisiteClick={onPrerequisiteClick}
                  findSubjectByCode={findSubjectByCode}
                  darkMode={darkMode}
                  subjectRefs={subjectRefs}
                  approvedCredits={approvedCredits}
                  allSubjects={subjects}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}