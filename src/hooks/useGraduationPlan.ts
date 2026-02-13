import { useState, useCallback } from 'react';
import { Subject, SubjectState } from '@/types/curriculum';
import { getUcCredits, UC_CREDITS_MAX } from '@/hooks/credits';

interface SemesterPlan {
  semester: string;
  subjects: Subject[];
  credits: number;
  electiveOptions?: {
    groupId: string;
    options: Subject[][];
  }[];
}

export const useGraduationPlan = (
  subjects: Subject[], 
  subjectStates: Record<string, SubjectState>
) => {
  const [showGraduationPlan, setShowGraduationPlan] = useState(false);
  const [graduationPlan, setGraduationPlan] = useState<SemesterPlan[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // ⭐ ACTUALIZADO: Validar prerrequisitos normales, opcionales Y requisitos de créditos
  const isSubjectAvailable = (
    subject: Subject, 
    completedSubjects: Set<string>,
    accumulatedCredits: number = 0
  ): boolean => {
    // Validar prerrequisitos normales (TODOS deben estar completos - AND lógico)
    const normalPrereqsMet = subject.prerequisites.every(prereq => 
      completedSubjects.has(prereq)
    );
    
    // ⭐ Validar prerrequisitos opcionales (AL MENOS UNO por grupo - OR lógico)
    const alternativePrereqsMet = !subject.alternativePrerequisites || 
      subject.alternativePrerequisites.every((group: string[]) => {
        return group.some(prereq => completedSubjects.has(prereq));
      });
    
    // ⭐ NUEVO: Validar requisito de créditos
    const creditRequirementMet = !subject.creditRequirement || 
      accumulatedCredits >= subject.creditRequirement;
    
    return normalPrereqsMet && alternativePrereqsMet && creditRequirementMet;
  };

  // ⭐ NUEVO: Calcular créditos UC acumulados (aprobados + en el plan)
  const calculateAccumulatedCredits = (completedSubjects: Set<string>): number => {
    return subjects
      .filter(s => completedSubjects.has(s.code))
      .reduce((sum, s) => sum + getUcCredits(s), 0);
  };

  const getCurrentAcademicLevel = (completedSubjects: Set<string>): string => {
    const semesterLevels = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'];

    for (let i = semesterLevels.length - 1; i >= 0; i--) {
      const semesterSubjects = subjects.filter(s => s.semester === semesterLevels[i]);
      const completedInSemester = semesterSubjects.filter(s => completedSubjects.has(s.code));
      
      if (completedInSemester.length > 0) {
        return semesterLevels[Math.min(i + 1, semesterLevels.length - 1)];
      }
    }
    
    return 's1';
  };

  const canTakeSubjectFromSemester = (
    subjectSemester: string, 
    currentLevel: string, 
    completedSubjects: Set<string>
  ): boolean => {
    const semesterLevels = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];
    const currentIndex = semesterLevels.indexOf(currentLevel);
    const subjectIndex = semesterLevels.indexOf(subjectSemester);
    
    if (currentLevel === 's1') {
      return subjectIndex === 0;
    }
    
    if (currentLevel === 's2') {
      return subjectIndex <= 1;
    }
    
    return true;
  };

  const calculateGraduationPlan = useCallback(() => {
    // Obtener materias no aprobadas
    const allPendingSubjects = subjects.filter(subject => 
      !subjectStates[subject.code]?.status || 
      subjectStates[subject.code].status !== 'approved'
    );

    // ACTUALIZADO: Filtrar grupos donde ya aprobaste uno Y tracks donde ya elegiste una opción
    const pendingSubjects = allPendingSubjects.filter(subject => {
      // Verificar grupos electivos
      if (subject.electiveGroup) {
        const approvedInGroup = subjects.find(s => 
          s.electiveGroup === subject.electiveGroup && 
          subjectStates[s.code]?.status === 'approved'
        );
        if (approvedInGroup) return false;
      }
      
      // NUEVO: Verificar tracks electivos
      if (subject.electiveTrack) {
        // Buscar si ya aprobaste algún ramo de OTRA opción del mismo track
        const approvedDifferentOption = subjects.find(s => 
          s.electiveTrack === subject.electiveTrack && 
          s.trackOption !== subject.trackOption &&
          subjectStates[s.code]?.status === 'approved'
        );
        if (approvedDifferentOption) return false;
      }
      
      return true;
    });

    if (pendingSubjects.length === 0) {
      setGraduationPlan([]);
      return;
    }

    const completedSubjects = new Set(
      subjects
        .filter(subject => subjectStates[subject.code]?.status === 'approved')
        .map(subject => subject.code)
    );

    const plan: SemesterPlan[] = [];
    const remainingSubjects = [...pendingSubjects];
    let currentSemester = 1;
    const maxCreditsPerSemester = UC_CREDITS_MAX;

    const getSemesterName = (semesterNumber: number): string => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      let baseYear = currentYear;
      let baseSemester = 1;
      if (currentMonth >= 8) {
        baseSemester = 2;
      } else {
        baseSemester = 1;
      }
      const totalSemesters = semesterNumber - 1;
      const additionalYears = Math.floor(totalSemesters / 2);
      const semesterInYear = (totalSemesters % 2);
      const finalYear = baseYear + additionalYears;
      const finalSemester = ((baseSemester - 1 + semesterInYear) % 2) + 1;
      if (baseSemester + semesterInYear > 2) {
        return `${finalYear + 1}-${finalSemester}`;
      }
      return `${finalYear}-${finalSemester}`;
    };

    const semesterLevels = Array.from(new Set(subjects.map(s => s.semester))).filter(Boolean);
    semesterLevels.sort((a, b) => {
      const numA = parseInt((a || '').replace('s', ''));
      const numB = parseInt((b || '').replace('s', ''));
      return numA - numB;
    });

    // NUEVO: Función helper para procesar ramos (grupos electivos Y tracks)
    const processSubject = (
      subject: Subject,
      semesterCredits: number,
      semesterSubjects: Subject[],
      electiveGroupsInSemester: Map<string, Subject[]>,
      electiveTracksInSemester: Map<string, Map<string, Subject[]>>
    ): number => {
      const subjectUcCredits = getUcCredits(subject);
      
      // NUEVO: Si es parte de un track electivo
      if (subject.electiveTrack) {
        if (!electiveTracksInSemester.has(subject.electiveTrack)) {
          electiveTracksInSemester.set(subject.electiveTrack, new Map());
        }
        const track = electiveTracksInSemester.get(subject.electiveTrack)!;
        const option = subject.trackOption || 'unknown';
        if (!track.has(option)) {
          track.set(option, []);
        }
        
        const optionSubjects = track.get(option)!;
        // Solo contar créditos de la PRIMERA opción que encontremos del track
        const trackHasCredits = Array.from(track.values()).some(opts => opts.length > 0);
        if (!trackHasCredits && semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
          optionSubjects.push(subject);
          return semesterCredits + subjectUcCredits;
        } else if (trackHasCredits) {
          // Agregar a la opción sin contar créditos adicionales
          optionSubjects.push(subject);
        }
        return semesterCredits;
      }
      // Si es parte de un grupo electivo (pero NO de un track)
      else if (subject.electiveGroup) {
        const group = electiveGroupsInSemester.get(subject.electiveGroup) || [];
        if (group.length === 0) {
          if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
            group.push(subject);
            electiveGroupsInSemester.set(subject.electiveGroup, group);
            return semesterCredits + subjectUcCredits;
          }
        } else {
          group.push(subject);
        }
        return semesterCredits;
      }
      // Ramo normal
      else {
        if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
          semesterSubjects.push(subject);
          completedSubjects.add(subject.code);
          const index = remainingSubjects.findIndex(s => s.code === subject.code);
          if (index !== -1) {
            remainingSubjects.splice(index, 1);
          }
          return semesterCredits + subjectUcCredits;
        }
        return semesterCredits;
      }
    };

    while (remainingSubjects.length > 0 && currentSemester <= 20) {
      let maxApprovedSemester = 0;
      for (const s of subjects) {
        if (completedSubjects.has(s.code) && s.semester && s.semester.startsWith('s')) {
          const n = parseInt(s.semester.replace('s', ''));
          if (!isNaN(n) && n > maxApprovedSemester) maxApprovedSemester = n;
        }
      }
      const realSemester = Math.max(1, maxApprovedSemester + 1);

      let vaAlDia = true;
      for (let i = 1; i < realSemester; i++) {
        if (remainingSubjects.some(s => s.semester === `s${i}`)) {
          vaAlDia = false;
          break;
        }
      }

      const semesterSubjects: Subject[] = [];
      let semesterCredits = 0;
      const electiveGroupsInSemester = new Map<string, Subject[]>();
      const electiveTracksInSemester = new Map<string, Map<string, Subject[]>>(); // NUEVO

      if (vaAlDia) {
        const currentSemesterCode = `s${realSemester}`;
        const accumulatedCredits = calculateAccumulatedCredits(completedSubjects); // ⭐ NUEVO
        const available = remainingSubjects.filter(subject => {
          return subject.semester === currentSemesterCode && isSubjectAvailable(subject, completedSubjects, accumulatedCredits);
        });
        
        for (const subject of available) {
          semesterCredits = processSubject(subject, semesterCredits, semesterSubjects, electiveGroupsInSemester, electiveTracksInSemester);
        }
        
        // Procesar grupos electivos
        electiveGroupsInSemester.forEach((group) => {
          semesterSubjects.push(group[0]);
          completedSubjects.add(group[0].code);
          group.forEach(subject => {
            const index = remainingSubjects.findIndex(s => s.code === subject.code);
            if (index !== -1) {
              remainingSubjects.splice(index, 1);
            }
          });
        });
        
        // NUEVO: Procesar tracks electivos
        electiveTracksInSemester.forEach((track) => {
          // Elegir la primera opción disponible (ordenada alfabéticamente)
          const firstOption = Array.from(track.keys()).sort()[0];
          const optionSubjects = track.get(firstOption)!;
          
          optionSubjects.forEach(subject => {
            semesterSubjects.push(subject);
            completedSubjects.add(subject.code);
          });
          
          // Remover TODOS los ramos del track (todas las opciones) de remainingSubjects
          track.forEach((subjects) => {
            subjects.forEach(subject => {
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            });
          });
        });
      } else if (realSemester === 1) {
        const accumulatedCredits = calculateAccumulatedCredits(completedSubjects); // ⭐ NUEVO
        const availableFirst = remainingSubjects.filter(subject => {
          return subject.semester === 's1' && isSubjectAvailable(subject, completedSubjects, accumulatedCredits);
        });
        for (const subject of availableFirst) {
          semesterCredits = processSubject(subject, semesterCredits, semesterSubjects, electiveGroupsInSemester, electiveTracksInSemester);
        }
        
        electiveGroupsInSemester.forEach((group) => {
          semesterSubjects.push(group[0]);
          completedSubjects.add(group[0].code);
          group.forEach(subject => {
            const index = remainingSubjects.findIndex(s => s.code === subject.code);
            if (index !== -1) {
              remainingSubjects.splice(index, 1);
            }
          });
        });
        
        electiveTracksInSemester.forEach((track) => {
          const firstOption = Array.from(track.keys()).sort()[0];
          const optionSubjects = track.get(firstOption)!;
          optionSubjects.forEach(subject => {
            semesterSubjects.push(subject);
            completedSubjects.add(subject.code);
          });
          track.forEach((subjects) => {
            subjects.forEach(subject => {
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            });
          });
        });
      } else if (realSemester === 2) {
        const accumulatedCredits = calculateAccumulatedCredits(completedSubjects); // ⭐ NUEVO
        const availableFirstSecond = remainingSubjects.filter(subject => {
          return (subject.semester === 's1' || subject.semester === 's2') && isSubjectAvailable(subject, completedSubjects, accumulatedCredits);
        });
        availableFirstSecond.sort((a, b) => {
          const aN = parseInt((a.semester || '').replace('s', ''));
          const bN = parseInt((b.semester || '').replace('s', ''));
          return bN - aN;
        });
        for (const subject of availableFirstSecond) {
          semesterCredits = processSubject(subject, semesterCredits, semesterSubjects, electiveGroupsInSemester, electiveTracksInSemester);
        }
        
        electiveGroupsInSemester.forEach((group) => {
          semesterSubjects.push(group[0]);
          completedSubjects.add(group[0].code);
          group.forEach(subject => {
            const index = remainingSubjects.findIndex(s => s.code === subject.code);
            if (index !== -1) {
              remainingSubjects.splice(index, 1);
            }
          });
        });
        
        electiveTracksInSemester.forEach((track) => {
          const firstOption = Array.from(track.keys()).sort()[0];
          const optionSubjects = track.get(firstOption)!;
          optionSubjects.forEach(subject => {
            semesterSubjects.push(subject);
            completedSubjects.add(subject.code);
          });
          track.forEach((subjects) => {
            subjects.forEach(subject => {
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            });
          });
        });
      } else {
        const accumulatedCredits = calculateAccumulatedCredits(completedSubjects); // ⭐ NUEVO
        const adelantables = remainingSubjects.filter(subject => {
          return isSubjectAvailable(subject, completedSubjects, accumulatedCredits);
        });
        adelantables.sort((a, b) => {
          const aIdx = semesterLevels.indexOf(a.semester);
          const bIdx = semesterLevels.indexOf(b.semester);
          return aIdx - bIdx;
        });
        for (const subject of adelantables) {
          semesterCredits = processSubject(subject, semesterCredits, semesterSubjects, electiveGroupsInSemester, electiveTracksInSemester);
          if (semesterCredits >= maxCreditsPerSemester) break;
        }
        
        electiveGroupsInSemester.forEach((group) => {
          semesterSubjects.push(group[0]);
          completedSubjects.add(group[0].code);
          group.forEach(subject => {
            const index = remainingSubjects.findIndex(s => s.code === subject.code);
            if (index !== -1) {
              remainingSubjects.splice(index, 1);
            }
          });
        });
        
        electiveTracksInSemester.forEach((track) => {
          const firstOption = Array.from(track.keys()).sort()[0];
          const optionSubjects = track.get(firstOption)!;
          optionSubjects.forEach(subject => {
            semesterSubjects.push(subject);
            completedSubjects.add(subject.code);
          });
          track.forEach((subjects) => {
            subjects.forEach(subject => {
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            });
          });
        });
      }

      if (semesterSubjects.length > 0) {
        // ACTUALIZADO: Convertir grupos electivos Y tracks a formato de opciones
        const electiveOptions: { groupId: string; options: Subject[][]; }[] = [];
        
        // Agregar grupos electivos
        electiveGroupsInSemester.forEach((options, groupId) => {
          electiveOptions.push({
            groupId,
            options: options.map(opt => [opt])
          });
        });
        
        // NUEVO: Agregar tracks electivos
        electiveTracksInSemester.forEach((track, trackId) => {
          const allOptions: Subject[][] = [];
          track.forEach((subjects) => {
            allOptions.push(subjects);
          });
          electiveOptions.push({
            groupId: trackId,
            options: allOptions
          });
        });

        plan.push({
          semester: getSemesterName(currentSemester),
          subjects: semesterSubjects,
          credits: semesterCredits,
          electiveOptions: electiveOptions.length > 0 ? electiveOptions : undefined
        });
      }

      currentSemester++;
    }

    setGraduationPlan(plan);
  }, [subjects, subjectStates]);

  const playGraduationAnimation = useCallback(() => {
    calculateGraduationPlan();
    setShowGraduationPlan(true);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, graduationPlan.length * 1000 + 2000);
  }, [calculateGraduationPlan, graduationPlan.length]);

  const closeGraduationPlan = useCallback(() => {
    setShowGraduationPlan(false);
    setIsAnimating(false);
  }, []);

  return {
    showGraduationPlan,
    graduationPlan,
    isAnimating,
    playGraduationAnimation,
    closeGraduationPlan
  };
};