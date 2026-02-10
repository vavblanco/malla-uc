import SemesterCard from './SemesterCard';
import { Subject, SubjectColors, SubjectState } from '@/types/curriculum';
import { useRef, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // Handlers para drag-to-scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicar por 2 para más velocidad
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full">
      {/* Indicador de scroll solo en desktop para carreras largas */}
      {maxSemesters > 4 && (
        <div className={`text-xs text-center mb-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        } hidden md:block`}>
          ← Arrastra para ver todos los semestres →
        </div>
      )}
      
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

      {/* Desktop: Flex horizontal con drag-to-scroll */}
      <div className="hidden md:block md:w-full">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div 
            className="flex flex-row gap-2 px-2 pointer-events-none"
            style={{ 
              minWidth: `${maxSemesters * 168}px`,
              width: 'max-content'
            }}
          >
            {Array.from({ length: maxSemesters }, (_, i) => `s${i + 1}`).map((semester) => {
              const semesterSubjects = getSemesterSubjects(semester);
              
              return (
                <div key={semester} className="pointer-events-auto">
                  <SemesterCard
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}