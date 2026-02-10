import { useState, useCallback } from 'react';
import { Subject, SubjectState } from '@/types/curriculum';
import { getUcCredits, UC_CREDITS_MAX } from '@/hooks/credits';

interface SemesterPlan {
  semester: string;
  subjects: Subject[];
  credits: number;
  electiveOptions?: { // NUEVO: Para grupos electivos
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

  const isSubjectAvailable = (subject: Subject, completedSubjects: Set<string>): boolean => {
    return subject.prerequisites.every(prereq => completedSubjects.has(prereq));
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
    // Función para identificar grupos electivos en la lista de pendientes
    const identifyElectiveGroups = (pendingSubjects: Subject[]) => {
      const electiveGroups = new Map<string, Subject[]>();
      const nonElectiveSubjects: Subject[] = [];

      pendingSubjects.forEach(subject => {
        if (subject.electiveGroup) {
          const group = electiveGroups.get(subject.electiveGroup) || [];
          group.push(subject);
          electiveGroups.set(subject.electiveGroup, group);
        } else {
          nonElectiveSubjects.push(subject);
        }
      });

      return { electiveGroups, nonElectiveSubjects };
    };

    // Obtener materias no aprobadas
    const allPendingSubjects = subjects.filter(subject => 
      !subjectStates[subject.code]?.status || 
      subjectStates[subject.code].status !== 'approved'
    );

    // Filtrar grupos donde ya aprobaste uno
    const pendingSubjects = allPendingSubjects.filter(subject => {
      if (!subject.electiveGroup) return true;
      
      // Verificar si ya aprobaste alguno del grupo
      const approvedInGroup = subjects.find(s => 
        s.electiveGroup === subject.electiveGroup && 
        subjectStates[s.code]?.status === 'approved'
      );
      
      return !approvedInGroup; // Solo incluir si NO hay ninguno aprobado del grupo
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

      if (vaAlDia) {
        const currentSemesterCode = `s${realSemester}`;
        const available = remainingSubjects.filter(subject => {
          return subject.semester === currentSemesterCode && isSubjectAvailable(subject, completedSubjects);
        });
        
        for (const subject of available) {
          const subjectUcCredits = getUcCredits(subject);
          
          // Si es parte de un grupo electivo, guardar todas las opciones
          if (subject.electiveGroup) {
            const group = electiveGroupsInSemester.get(subject.electiveGroup) || [];
            if (group.length === 0) {
              // Solo contar créditos una vez por grupo
              if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
                group.push(subject);
                electiveGroupsInSemester.set(subject.electiveGroup, group);
                semesterCredits += subjectUcCredits;
              }
            } else {
              // Agregar como opción sin contar créditos adicionales
              group.push(subject);
            }
          } else {
            // Ramo normal
            if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
              semesterSubjects.push(subject);
              semesterCredits += subjectUcCredits;
              completedSubjects.add(subject.code);
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            }
          }
        }
        
        // Agregar el primer ramo de cada grupo electivo a semesterSubjects
        // y remover todos los del grupo de remainingSubjects
        electiveGroupsInSemester.forEach((group, groupId) => {
          semesterSubjects.push(group[0]); // Agregar el primero
          completedSubjects.add(group[0].code);
          
          // Remover todos los del grupo de remainingSubjects
          group.forEach(subject => {
            const index = remainingSubjects.findIndex(s => s.code === subject.code);
            if (index !== -1) {
              remainingSubjects.splice(index, 1);
            }
          });
        });
      } else if (realSemester === 1) {
        const availableFirst = remainingSubjects.filter(subject => {
          return subject.semester === 's1' && isSubjectAvailable(subject, completedSubjects);
        });
        for (const subject of availableFirst) {
          const subjectUcCredits = getUcCredits(subject);
          
          if (subject.electiveGroup) {
            const group = electiveGroupsInSemester.get(subject.electiveGroup) || [];
            if (group.length === 0) {
              if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
                group.push(subject);
                electiveGroupsInSemester.set(subject.electiveGroup, group);
                semesterCredits += subjectUcCredits;
              }
            } else {
              group.push(subject);
            }
          } else {
            if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
              semesterSubjects.push(subject);
              semesterCredits += subjectUcCredits;
              completedSubjects.add(subject.code);
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            }
          }
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
      } else if (realSemester === 2) {
        const availableFirstSecond = remainingSubjects.filter(subject => {
          return (subject.semester === 's1' || subject.semester === 's2') && isSubjectAvailable(subject, completedSubjects);
        });
        availableFirstSecond.sort((a, b) => {
          const aN = parseInt((a.semester || '').replace('s', ''));
          const bN = parseInt((b.semester || '').replace('s', ''));
          return bN - aN;
        });
        for (const subject of availableFirstSecond) {
          const subjectUcCredits = getUcCredits(subject);
          
          if (subject.electiveGroup) {
            const group = electiveGroupsInSemester.get(subject.electiveGroup) || [];
            if (group.length === 0) {
              if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
                group.push(subject);
                electiveGroupsInSemester.set(subject.electiveGroup, group);
                semesterCredits += subjectUcCredits;
              }
            } else {
              group.push(subject);
            }
          } else {
            if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
              semesterSubjects.push(subject);
              semesterCredits += subjectUcCredits;
              completedSubjects.add(subject.code);
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            }
          }
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
      } else {
        const adelantables = remainingSubjects.filter(subject => {
          return isSubjectAvailable(subject, completedSubjects);
        });
        adelantables.sort((a, b) => {
          const aIdx = semesterLevels.indexOf(a.semester);
          const bIdx = semesterLevels.indexOf(b.semester);
          return aIdx - bIdx;
        });
        for (const subject of adelantables) {
          const subjectUcCredits = getUcCredits(subject);
          
          if (subject.electiveGroup) {
            const group = electiveGroupsInSemester.get(subject.electiveGroup) || [];
            if (group.length === 0) {
              if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
                group.push(subject);
                electiveGroupsInSemester.set(subject.electiveGroup, group);
                semesterCredits += subjectUcCredits;
              }
            } else {
              group.push(subject);
            }
          } else {
            if (semesterCredits + subjectUcCredits <= maxCreditsPerSemester) {
              semesterSubjects.push(subject);
              semesterCredits += subjectUcCredits;
              completedSubjects.add(subject.code);
              const index = remainingSubjects.findIndex(s => s.code === subject.code);
              if (index !== -1) {
                remainingSubjects.splice(index, 1);
              }
            }
          }
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
      }

      if (semesterSubjects.length > 0) {
        // Convertir grupos electivos a formato de opciones
        const electiveOptions = Array.from(electiveGroupsInSemester.entries()).map(([groupId, options]) => ({
          groupId,
          options: options.map(opt => [opt]) // Cada opción como array individual
        }));

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