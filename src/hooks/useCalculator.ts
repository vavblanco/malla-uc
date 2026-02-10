import { useState, useCallback } from 'react';
import { Subject, SubjectState, CalculatorState } from '@/types/curriculum';
import { getUcCredits } from '@/hooks/credits';

export const useCalculator = (subjects: Subject[]) => {
  const [subjectStates, setSubjectStates] = useState<CalculatorState>({});

  const handleStateChange = useCallback((code: string, state: SubjectState) => {
    setSubjectStates(prev => ({
      ...prev,
      [code]: state
    }));
  }, []);

  // ACTUALIZADO: Filtrar ramos contables considerando tracks y grupos electivos
  const getCountableSubjects = (subjects: Subject[]): Subject[] => {
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
    electiveTracks.forEach((track, trackId) => {
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

  const calculateCredits = useCallback(() => {
    // Filtrar solo ramos contables (excluir duplicados de grupos electivos y tracks)
    const countableSubjects = getCountableSubjects(subjects);
    
    const totalCredits = countableSubjects.reduce((sum, subject) => {
      return sum + getUcCredits(subject);
    }, 0);

    const approvedCredits = countableSubjects.reduce((sum, subject) => {
      if (subjectStates[subject.code]?.status === 'approved') {
        return sum + getUcCredits(subject);
      }
      return sum;
    }, 0);

    const pendingCredits = totalCredits - approvedCredits;

    return {
      totalCredits,
      approvedCredits,
      pendingCredits
    };
  }, [subjects, subjectStates]);

  const getApprovedCredits = useCallback(() => {
    // Contar solo ramos individualmente aprobados
    return subjects.reduce((sum, subject) => {
      if (subjectStates[subject.code]?.status === 'approved') {
        return sum + getUcCredits(subject);
      }
      return sum;
    }, 0);
  }, [subjects, subjectStates]);

  const calculateSubjects = useCallback(() => {
    // Filtrar solo ramos contables
    const countableSubjects = getCountableSubjects(subjects);
    
    const totalSubjects = countableSubjects.length;
    const approvedSubjects = countableSubjects.filter(
      subject => subjectStates[subject.code]?.status === 'approved'
    ).length;
    const pendingSubjects = totalSubjects - approvedSubjects;

    return {
      totalSubjects,
      approvedSubjects,
      pendingSubjects
    };
  }, [subjects, subjectStates]);

  return {
    subjectStates,
    handleStateChange,
    calculateCredits,
    calculateSubjects,
    getApprovedCredits
  };
};
