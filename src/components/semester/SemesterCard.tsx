import { useRef } from 'react';
import SubjectCard from './SubjectCard';
import { Subject, SubjectColors, SubjectState } from '@/types/curriculum';
import { getUcCredits } from '@/hooks/credits';

interface SemesterCardProps {
  semester: string;
  subjects: Subject[];
  subjectStates: Record<string, SubjectState>;
  onStateChange: (code: string, state: SubjectState) => void;
  colors: SubjectColors;
  onPrerequisiteClick: (subjectCode: string) => void;
  findSubjectByCode: (code: string) => Subject | undefined;
  darkMode: boolean;
  subjectRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  approvedCredits?: number;
  allSubjects?: Subject[];
}

export default function SemesterCard({
  semester,
  subjects,
  subjectStates,
  onStateChange,
  colors,
  onPrerequisiteClick,
  findSubjectByCode,
  darkMode,
  subjectRefs,
  approvedCredits = 0,
  allSubjects = []
}: SemesterCardProps) {
  const getSemesterTitle = (semester: string) => {
    const semesterNumber = semester.replace('s', '');
    return `${semesterNumber}° Semestre`;
  };

  // ACTUALIZADO: Filtrar ramos contables considerando tracks y grupos electivos
  const getCountableSemesterSubjects = (subjects: Subject[]): Subject[] => {
    const electiveGroups = new Map<string, Subject[]>();
    const electiveTracks = new Map<string, Map<string, Subject[]>>();
    const regularSubjects: Subject[] = [];

    subjects.forEach(subject => {
      // Agrupar por tracks primero (prioridad)
      if (subject.electiveTrack) {
        if (!electiveTracks.has(subject.electiveTrack)) {
          electiveTracks.set(subject.electiveTrack, new Map());
        }
        const track = electiveTracks.get(subject.electiveTrack)!;
        const option = subject.trackOption || 'unknown';
        if (!track.has(option)) {
          track.set(option, []);
        }
        track.get(option)!.push(subject);
      }
      // Luego por grupos electivos
      else if (subject.electiveGroup) {
        const group = electiveGroups.get(subject.electiveGroup) || [];
        group.push(subject);
        electiveGroups.set(subject.electiveGroup, group);
      } 
      // Ramos regulares
      else {
        regularSubjects.push(subject);
      }
    });

    const countableSubjects: Subject[] = [...regularSubjects];

    // Para cada track, contar solo los ramos de la opción seleccionada
    electiveTracks.forEach((track) => {
      let selectedOption: string | null = null;
      
      // Encontrar qué opción tiene ramos aprobados
      for (const [option, members] of track.entries()) {
        if (members.some(s => subjectStates[s.code]?.status === 'approved')) {
          selectedOption = option;
          break;
        }
      }
      
      if (selectedOption) {
        // Contar todos los ramos aprobados de esa opción
        const approvedMembers = track.get(selectedOption)!
          .filter(s => subjectStates[s.code]?.status === 'approved');
        countableSubjects.push(...approvedMembers);
      } else {
        // Si no hay ninguno aprobado, contar el primero de la primera opción (para cálculo total)
        const firstOption = Array.from(track.keys()).sort()[0];
        const firstMember = track.get(firstOption)?.[0];
        if (firstMember) {
          countableSubjects.push(firstMember);
        }
      }
    });

    // Para cada grupo electivo, contar solo uno
    electiveGroups.forEach((group) => {
      const approved = group.find(s => subjectStates[s.code]?.status === 'approved');
      if (approved) {
        countableSubjects.push(approved);
      } else {
        countableSubjects.push(group[0]);
      }
    });

    return countableSubjects;
  };

  const getSemesterCredits = (subjects: Subject[]) => {
    const countableSubjects = getCountableSemesterSubjects(subjects);
    return countableSubjects.reduce((total, subject) => total + getUcCredits(subject), 0);
  };

  const getSemesterApprovedCredits = (subjects: Subject[]) => {
    const countableSubjects = getCountableSemesterSubjects(subjects);
    return countableSubjects.reduce((total, subject) => {
      const state = subjectStates[subject.code];
      return total + (state?.status === 'approved' ? getUcCredits(subject) : 0);
    }, 0);
  };

  const semesterCredits = getSemesterCredits(subjects);
  const semesterApprovedCredits = getSemesterApprovedCredits(subjects);

  if (subjects.length === 0) return null;

  return (
    <div 
      className={`
        flex flex-col rounded-2xl shadow-md border w-full
        md:max-w-[180px] md:w-40 md:flex-shrink-0
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}
      `}
    >
      {/* Header del semestre */}
      <div className={`rounded-t-2xl p-2 md:p-3 text-center border-b ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
      }`}>
        <h3 className={`font-bold text-xs md:text-sm ${
          darkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>
          {getSemesterTitle(semester)}
        </h3>
        <div className={`text-xs mt-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <span className="font-medium">{semesterApprovedCredits}</span>
          <span className="mx-1">/</span>
          <span>{semesterCredits} Créditos UC</span>
        </div>
        <div className={`w-full rounded-full h-2 mt-2 overflow-hidden ${
          darkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${semesterCredits > 0 ? (semesterApprovedCredits / semesterCredits) * 100 : 0}%` }}
          />
        </div>
      </div>
      
      {/* Asignaturas del semestre */}
      <div className="flex flex-col gap-2 md:gap-3 p-2 md:p-3 rounded-b-2xl">
        {subjects.map((subject) => (
          <div
            key={subject.code}
            ref={(el) => {
              subjectRefs.current[subject.code] = el;
            }}
            className="transition-all duration-300 ease-in-out"
          >
            <SubjectCard
              subject={subject}
              state={subjectStates[subject.code]}
              onStateChange={(state) => onStateChange(subject.code, state)}
              color={colors[subject.type]?.[0] || '#6B7280'}
              categoryName={colors[subject.type]?.[1] || 'Sin categoría'}
              onPrerequisiteClick={onPrerequisiteClick}
              findSubjectByCode={findSubjectByCode}
              subjectStates={subjectStates}
              colors={colors}
              darkMode={darkMode}
              approvedCredits={approvedCredits}
              allSubjects={allSubjects}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
