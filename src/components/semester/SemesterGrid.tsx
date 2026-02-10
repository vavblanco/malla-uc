import SemesterCard from './SemesterCard';
import { Subject, SubjectColors, SubjectState } from '@/types/curriculum';

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

  return (
    <div className="w-full">
      {/* Indicador de scroll solo en desktop para carreras largas */}
      {maxSemesters > 4 && (
        <div className={`text-xs text-center mb-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        } hidden md:block`}>
          ← Desliza para ver todos los semestres →
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

      {/* Desktop: Flex horizontal con scroll visible y centrado */}
      <div className="hidden md:block md:w-full">
        <div 
          className="overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: darkMode ? '#4b5563 #1f2937' : '#9ca3af #e5e7eb'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: ${darkMode ? '#1f2937' : '#e5e7eb'};
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: ${darkMode ? '#4b5563' : '#9ca3af'};
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: ${darkMode ? '#6b7280' : '#6b7280'};
            }
          `}</style>
          
          {/* Contenedor centrado */}
          <div className="flex justify-center min-w-full">
            <div 
              className="flex flex-row gap-2"
              style={{ 
                width: maxSemesters <= 4 ? 'auto' : `${maxSemesters * 168}px`,
                maxWidth: '100%'
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
    </div>
  );
}