import SemesterCard from './SemesterCard';
import { Subject, SubjectColors, SubjectState } from '@/types/curriculum';
import { useRef, useState, useEffect } from 'react';

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
  const [velocity, setVelocity] = useState(0);
  const animationRef = useRef<number | null>(null);

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

  // Momentum scrolling (inercia)
  useEffect(() => {
    if (Math.abs(velocity) > 0.5) {
      animationRef.current = requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft += velocity;
          setVelocity(velocity * 0.95); // Friction
        }
      });
    } else {
      setVelocity(0);
    }

    return () => {
      if (animationRef.current !== null) { // CORREGIDO
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [velocity]);

  // Handlers para drag-to-scroll con momentum
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setVelocity(0); // Detener momentum al empezar drag
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
        scrollContainerRef.current.style.userSelect = 'auto';
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2.5; // Más fluido
    const newScrollLeft = scrollLeft - walk;
    scrollContainerRef.current.scrollLeft = newScrollLeft;
    
    // Calcular velocidad para momentum
    setVelocity(-walk * 0.1);
  };

  // Verificar si el contenido cabe en la pantalla
  const contentFitsScreen = maxSemesters <= 5; // Aproximadamente 5 semestres caben en pantalla típica

  return (
    <div className="w-full">
      {/* Indicador de scroll solo en desktop para carreras largas */}
      {maxSemesters > 4 && !contentFitsScreen && (
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
          className={`overflow-x-auto pb-4 select-none ${contentFitsScreen ? 'flex justify-center' : ''}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: contentFitsScreen ? 'default' : 'grab',
            scrollBehavior: isDragging ? 'auto' : 'smooth'
          }}
          onMouseDown={contentFitsScreen ? undefined : handleMouseDown}
          onMouseLeave={contentFitsScreen ? undefined : handleMouseLeave}
          onMouseUp={contentFitsScreen ? undefined : handleMouseUp}
          onMouseMove={contentFitsScreen ? undefined : handleMouseMove}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div 
            className={`flex flex-row gap-2 px-2 ${contentFitsScreen ? '' : 'pointer-events-none'}`}
            style={contentFitsScreen ? {} : { 
              minWidth: `${maxSemesters * 168}px`,
              width: 'max-content'
            }}
          >
            {Array.from({ length: maxSemesters }, (_, i) => `s${i + 1}`).map((semester) => {
              const semesterSubjects = getSemesterSubjects(semester);
              
              return (
                <div key={semester} className={contentFitsScreen ? '' : 'pointer-events-auto'}>
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