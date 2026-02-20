'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheck, faLink, faTrophy, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import type { Subject, SubjectState, CalculatorState, SubjectColors } from '@/types/curriculum';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '../ui/Tooltip';
import { getUcCredits } from '@/hooks/credits';
import GradeInputModal from '../modals/GradeInputModal';
import { formatDecimal } from '@/hooks/formatDecimal';


interface SubjectCardProps {
  subject: Subject;
  state: SubjectState | undefined;
  onStateChange: (state: SubjectState) => void;
  color: string;
  categoryName: string;
  onPrerequisiteClick: (subjectCode: string) => void;
  findSubjectByCode: (code: string) => Subject | undefined;
  subjectStates: CalculatorState;
  colors: SubjectColors;
  darkMode?: boolean;
  approvedCredits?: number;
  allSubjects?: Subject[];
}

export default function SubjectCard({ 
  subject, 
  state, 
  onStateChange, 
  color,
  categoryName,
  onPrerequisiteClick,
  findSubjectByCode,
  subjectStates,
  colors,
  darkMode = false,
  approvedCredits = 0,
  allSubjects = []
}: SubjectCardProps) {

  // ⭐ NUEVO: Estados para el modal de nota y long press
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  // Verificar si otro ramo del mismo grupo electivo está aprobado
  const getElectiveGroupConflict = () => {
    if (!subject.electiveGroup) return null;
    
    const conflictingSubject = allSubjects.find(s => 
      s.electiveGroup === subject.electiveGroup && 
      s.code !== subject.code && 
      subjectStates[s.code]?.status === 'approved'
    );
    
    return conflictingSubject || null;
  };

  // NUEVO: Verificar si otro ramo de un track diferente está aprobado
  const getElectiveTrackConflict = () => {
    if (!subject.electiveTrack) return null;
    
    // Buscar ramos de OTRAS opciones del mismo track que estén aprobados
    const conflictingSubject = allSubjects.find(s => 
      s.electiveTrack === subject.electiveTrack && 
      s.trackOption !== subject.trackOption &&
      subjectStates[s.code]?.status === 'approved'
    );
    
    return conflictingSubject || null;
  };

  const electiveConflict = getElectiveGroupConflict();
  const electiveTrackConflict = getElectiveTrackConflict();

  const canTakeSubject = () => {
    // Si hay un conflicto de track (aprobaste una opción diferente) y este ramo no está aprobado, está bloqueado
    if (electiveTrackConflict && state?.status !== 'approved') {
      return false;
    }

    // Si hay un conflicto de grupo electivo y este ramo no está aprobado, está bloqueado
    if (electiveConflict && state?.status !== 'approved') {
      return false;
    }

    // Si no tiene prerrequisitos ni requisitos de créditos, siempre se puede tomar
    const hasNoRequirements = 
      subject.prerequisites.length === 0 && 
      !subject.alternativePrerequisites &&
      !subject.creditRequirement;
    
    if (hasNoRequirements) return true;
    
    // Verificar que todos los prerrequisitos NORMALES estén aprobados (AND lógico)
    const prerequisitesMet = subject.prerequisites.every((prereqCode: string) => {
      const prereqState = subjectStates[prereqCode];
      return prereqState?.status === 'approved';
    });
    
    // ⭐ NUEVO: Verificar prerrequisitos OPCIONALES (OR lógico por grupo)
    // Para cada grupo, verificar que AL MENOS UNO esté aprobado
    const alternativePrerequisitesMet = !subject.alternativePrerequisites || 
      subject.alternativePrerequisites.every((group: string[]) => {
        return group.some((prereqCode: string) => {
          const prereqState = subjectStates[prereqCode];
          return prereqState?.status === 'approved';
        });
      });
    
    // Verificar requisito de créditos si existe
    const creditRequirementMet = !subject.creditRequirement || 
      approvedCredits >= subject.creditRequirement;
    
    return prerequisitesMet && alternativePrerequisitesMet && creditRequirementMet;
  };

  // ⭐ NUEVO: Obtener grupos de prerrequisitos opcionales que faltan
  const getMissingAlternativeGroups = () => {
    if (!subject.alternativePrerequisites) return [];
    
    return subject.alternativePrerequisites
      .map((group, index) => {
        const hasApprovedOne = group.some((prereqCode: string) => {
          const prereqState = subjectStates[prereqCode];
          return prereqState?.status === 'approved';
        });
        
        return hasApprovedOne ? null : { index, group };
      })
      .filter(Boolean) as { index: number; group: string[] }[];
  };

  // Verificar si hay correquisitos no cumplidos
  const getMissingCorequisites = () => {
    if (!subject.corequisites || subject.corequisites.length === 0) return [];
    
    return subject.corequisites.filter((coreqCode: string) => {
      const coreqState = subjectStates[coreqCode];
      return state?.status === 'approved' && coreqState?.status !== 'approved';
    });
  };

  const isBlocked = !canTakeSubject() && state?.status !== 'approved';
  const missingCorequisites = getMissingCorequisites();
  const hasCorequisiteWarning = missingCorequisites.length > 0;

  // Obtener otros ramos del mismo grupo electivo
  const getElectiveGroupMembers = () => {
    if (!subject.electiveGroup) return [];
    return allSubjects.filter(s => 
      s.electiveGroup === subject.electiveGroup && s.code !== subject.code
    );
  };

  const electiveGroupMembers = getElectiveGroupMembers();

  // NUEVO: Obtener todos los ramos del mismo track organizados por opción
  const getElectiveTrackMembers = () => {
    if (!subject.electiveTrack) return {};
    
    const trackMembers: Record<string, Subject[]> = {};
    
    allSubjects
      .filter(s => s.electiveTrack === subject.electiveTrack)
      .forEach(s => {
        const option = s.trackOption || 'unknown';
        if (!trackMembers[option]) {
          trackMembers[option] = [];
        }
        trackMembers[option].push(s);
      });
    
    return trackMembers;
  };

  const electiveTrackMembers = getElectiveTrackMembers();

  const getStatusColor = () => {
    if (isBlocked) {
      return 'border-gray-300 cursor-not-allowed';
    }
    switch (state?.status) {
      case 'approved':
        return 'border-green-300';
      default:
        return 'border-gray-200 hover:border-gray-400';
    }
  };

  const getTextColor = () => {
    if (isBlocked) return '#9ca3af';
    if (state?.status === 'approved') return '#fff';
    return '#fff';
  };

  const getBackgroundColor = () => {
    if (isBlocked) return darkMode ? '#4b5563' : '#6b7280';
    // ⭐ NUEVO: Color rojo para reprobados
    if (state?.status === 'failed') return '#ef4444'; // red-500
    if (state?.status === 'approved') return '#10b981'; // green-500
    return color || (darkMode ? '#374151' : '#fff');
  };

  // ⭐ NUEVO: Handlers para click vs long press
  const handleMouseDown = () => {
    if (isBlocked) return;
    
    setIsLongPress(false);
    
    // Timer de 500ms para detectar long press
    const timer = setTimeout(() => {
      setIsLongPress(true);
      setShowGradeModal(true); // Abrir modal
      
      // Vibración en móviles (feedback táctil)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
    
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (isBlocked) return;
    
    // Cancelar el timer si se suelta antes de 500ms
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    // Si NO fue long press, hacer el cambio rápido
    if (!isLongPress) {
      handleQuickClick();
    }
    
    setIsLongPress(false);
  };

  const handleQuickClick = () => {
    if (!state || state.status === 'pending') {
      // Pendiente → Aprobado (sin nota todavía)
      onStateChange({ status: 'approved' });
    } else if (state.status === 'approved') {
      // Aprobado → Reprobado (mantener nota si existe)
      onStateChange({ status: 'failed', grade: state.grade });
    } else {
      // Reprobado → Pendiente (limpiar nota)
      onStateChange({ status: 'pending', grade: undefined });
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsLongPress(false);
  };

  const handleGradeSave = (newState: SubjectState) => {
    onStateChange(newState);
    setShowGradeModal(false);
  };

  const PrerequisiteChip = ({ prereqCode }: { prereqCode: string }) => {
    const prereqSubject = findSubjectByCode(prereqCode);
    const prereqState = subjectStates[prereqCode];
    if (!prereqSubject) {
      return (
        <span className="inline-block text-xs px-2 py-1 rounded bg-white/20 text-white/80">
          {prereqCode}
        </span>
      );
    }
    const prereqColor = colors[prereqSubject.type]?.[0] || '#6b7280';
    
    const prereqTooltip = (
      <div className="space-y-1">
        <div className="font-bold">{prereqSubject.name}</div>
        <div className="text-xs opacity-70">{prereqCode} • {getUcCredits(prereqSubject)} créditos UC</div>
        <div className="text-xs pt-1 border-t border-gray-300 dark:border-gray-600">
          {prereqState?.status === 'approved' ? '✓ Aprobada' : '⚠️ Pendiente de aprobar'}
        </div>
        <div className="text-xs opacity-70">Click para ir al ramo</div>
      </div>
    );
    
    return (
      <Tooltip content={prereqTooltip}>
        <button
          onClick={e => {
            e.stopPropagation();
            onPrerequisiteClick(prereqCode);
          }}
          className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-xl font-bold text-white hover:brightness-110 transition-all border border-white`}
          style={{ backgroundColor: prereqColor }}
        >
          <span>{prereqCode}</span>
          <div 
            className={`w-2 h-2 rounded-full border border-white ${
              prereqState?.status === 'approved' ? 'bg-green-400' : 'bg-red-400'
            }`}
          />
        </button>
      </Tooltip>
    );
  };

  const CorequisiteChip = ({ coreqCode }: { coreqCode: string }) => {
    const coreqSubject = findSubjectByCode(coreqCode);
    const coreqState = subjectStates[coreqCode];
    if (!coreqSubject) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-orange-500/80 text-white">
          <FontAwesomeIcon icon={faLink} className="text-[0.6rem]" />
          {coreqCode}
        </span>
      );
    }
    
    const coreqColor = colors[coreqSubject.type]?.[0] || '#6b7280';
    
    const coreqTooltip = (
      <div className="space-y-1">
        <div className="font-bold flex items-center gap-1">
          <FontAwesomeIcon icon={faLink} />
          Correquisito
        </div>
        <div className="text-sm">{coreqSubject.name}</div>
        <div className="text-xs opacity-70">{coreqCode} • {getUcCredits(coreqSubject)} créditos UC</div>
        <div className="text-xs pt-1 border-t border-gray-300 dark:border-gray-600">
          Debe cursarse simultáneamente
        </div>
        <div className="text-xs opacity-70">Click para ir al ramo</div>
      </div>
    );
    
    return (
      <Tooltip content={coreqTooltip}>
        <button
          onClick={e => {
            e.stopPropagation();
            onPrerequisiteClick(coreqCode);
          }}
          className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-xl font-bold text-white hover:brightness-110 transition-all border-2 border-dashed border-white`}
          style={{ backgroundColor: coreqColor }}
        >
          <FontAwesomeIcon icon={faLink} className="text-[0.6rem]" />
          <span>{coreqCode}</span>
        </button>
      </Tooltip>
    );
  };

  // ⭐ NUEVO: Chip para prerrequisitos opcionales
  const AlternativePrerequisiteChip = ({ prereqCode }: { prereqCode: string }) => {
    const prereqSubject = findSubjectByCode(prereqCode);
    const prereqState = subjectStates[prereqCode];
    
    if (!prereqSubject) {
      return (
        <span className="inline-block text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
          {prereqCode}
        </span>
      );
    }
    
    const prereqColor = colors[prereqSubject.type]?.[0] || '#6b7280';
    
    const prereqTooltip = (
      <div className="space-y-1">
        <div className="font-bold flex items-center gap-1">
          <FontAwesomeIcon icon={faCodeBranch} />
          Prerrequisito Opcional
        </div>
        <div className="text-sm">{prereqSubject.name}</div>
        <div className="text-xs opacity-70">{prereqCode} • {getUcCredits(prereqSubject)} créditos UC</div>
        <div className="text-xs pt-1 border-t border-gray-300 dark:border-gray-600">
          {prereqState?.status === 'approved' ? '✓ Aprobada' : '⚠️ Pendiente'}
        </div>
        <div className="text-xs opacity-70 italic">
          Solo necesitas UNO de este grupo
        </div>
        <div className="text-xs opacity-70">Click para ir al ramo</div>
      </div>
    );
    
    return (
      <Tooltip content={prereqTooltip}>
        <button
          onClick={e => {
            e.stopPropagation();
            onPrerequisiteClick(prereqCode);
          }}
          className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-xl font-bold text-white hover:brightness-110 transition-all border-2 border-dashed ${
            prereqState?.status === 'approved' 
              ? 'border-green-400' 
              : 'border-yellow-400'
          }`}
          style={{ backgroundColor: prereqColor, opacity: 0.85 }}
        >
          <span>{prereqCode}</span>
          <div 
            className={`w-2 h-2 rounded-full border border-white ${
              prereqState?.status === 'approved' ? 'bg-green-400' : 'bg-yellow-400'
            }`}
          />
        </button>
      </Tooltip>
    );
  };

  const tooltipContent = (
    <div className="space-y-1">
      <div className="font-bold">{subject.name}</div>
      <div className="text-xs opacity-70">{subject.code} • {getUcCredits(subject)} créditos UC</div>
      
      {/* ⭐ NUEVO: Mostrar nota si existe */}
      {state?.grade && (
        <div className={`text-sm font-bold pt-1 border-t border-gray-300 dark:border-gray-600 ${
          state.status === 'approved' ? 'text-green-500' : 'text-red-500'
        }`}>
          Nota: {formatDecimal(state.grade)}
          {state.status === 'failed' && ' (Reprobado)'}
        </div>
      )}
      
      {/* NUEVO: Mostrar información del track */}
      {subject.electiveTrack && Object.keys(electiveTrackMembers).length > 0 && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <div className="font-bold mb-1 flex items-center gap-1">
            📚 {subject.trackName || 'Especialización'}
          </div>
          {Object.entries(electiveTrackMembers)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([option, members]) => {
              const isCurrentOption = option === subject.trackOption;
              const hasApproved = members.some(m => subjectStates[m.code]?.status === 'approved');
              
              return (
                <div 
                  key={option} 
                  className={`ml-2 mb-2 ${isCurrentOption ? 'font-bold' : 'opacity-60'}`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold">Opción {option}:</span>
                    {hasApproved && <span className="text-green-500">✓</span>}
                  </div>
                  <div className="ml-4 text-[10px] space-y-0.5">
                    {members.map(m => (
                      <div key={m.code} className={subjectStates[m.code]?.status === 'approved' ? 'text-green-500 font-bold' : ''}>
                        • {m.name} ({m.code})
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {electiveTrackConflict && (
        <div className="text-xs text-red-500 dark:text-red-400 pt-1 border-t border-gray-300 dark:border-gray-600">
          📚 Bloqueado: Ya elegiste la opción {electiveTrackConflict.trackOption} de este track
        </div>
      )}
      
      {subject.electiveGroup && electiveGroupMembers.length > 0 && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faCodeBranch} className="mr-1" />
          Electivo (elige uno):
          <div className="mt-1 space-y-0.5">
            {electiveGroupMembers.map(member => (
              <div key={member.code} className="ml-4 flex items-center gap-1">
                <span className={subjectStates[member.code]?.status === 'approved' ? 'font-bold text-green-500' : ''}>
                  • {member.name}
                </span>
                {subjectStates[member.code]?.status === 'approved' && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {electiveConflict && (
        <div className="text-xs text-purple-500 dark:text-purple-400 pt-1 border-t border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faCodeBranch} className="mr-1" />
          Bloqueado: Ya aprobaste "{electiveConflict.name}"
        </div>
      )}
      
      {subject.prerequisites.length > 0 && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          Prerrequisitos: {subject.prerequisites.map(code => findSubjectByCode(code)?.name || code).join(', ')}
        </div>
      )}
      
      {/* ⭐ NUEVO: Mostrar prerrequisitos opcionales */}
      {subject.alternativePrerequisites && subject.alternativePrerequisites.length > 0 && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <div className="font-bold flex items-center gap-1 mb-1">
            <FontAwesomeIcon icon={faCodeBranch} />
            Prerrequisitos opcionales:
          </div>
          {subject.alternativePrerequisites.map((group, groupIndex) => {
            const hasApprovedOne = group.some(code => 
              subjectStates[code]?.status === 'approved'
            );
            
            return (
              <div key={groupIndex} className="ml-2 mt-1">
                <div className={`flex items-center gap-1 text-[11px] ${hasApprovedOne ? 'text-green-500' : 'text-yellow-500'}`}>
                  {hasApprovedOne ? '✓' : '⚠'} <span className="font-semibold">Uno de:</span>
                </div>
                <div className="ml-4 mt-0.5 space-y-0.5">
                  {group.map(code => {
                    const prereq = findSubjectByCode(code);
                    const isApproved = subjectStates[code]?.status === 'approved';
                    return (
                      <div key={code} className={`flex items-center gap-1 text-[11px] ${isApproved ? 'font-bold text-green-500' : ''}`}>
                        {isApproved ? '✓' : '○'} {prereq?.name || code}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {subject.corequisites && subject.corequisites.length > 0 && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faLink} className="mr-1" />
          Correquisitos: {subject.corequisites.map(code => findSubjectByCode(code)?.name || code).join(', ')}
        </div>
      )}
      
      {subject.creditRequirement && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faTrophy} className="mr-1" />
          Requiere {subject.creditRequirement} créditos UC aprobados
          {approvedCredits >= subject.creditRequirement ? (
            <span className="text-green-500 ml-1">✓</span>
          ) : (
            <span className="text-red-500 ml-1">({approvedCredits}/{subject.creditRequirement})</span>
          )}
        </div>
      )}
      
      {hasCorequisiteWarning && (
        <div className="text-xs text-orange-500 dark:text-orange-400 pt-1">
          ⚠️ Faltan correquisitos por aprobar
        </div>
      )}
      
      {isBlocked ? (
        <div className="text-xs text-red-500 dark:text-red-400 pt-1">
          ⚠️ Bloqueada: completa los requisitos
        </div>
      ) : (
        <div className="text-xs text-green-600 dark:text-green-400 pt-1">
          {state?.status === 'approved' ? '✓ Aprobada' : 'Click para marcar como aprobada'}
        </div>
      )}
    </div>
  );

  return (
    <>
    <Tooltip content={tooltipContent}>
      <div className="relative group">
        <motion.div
          animate={{ 
            backgroundColor: getBackgroundColor(),
            scale: 1
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, type: "spring", damping: 20, stiffness: 300 }}
          className={`relative rounded-xl cursor-pointer overflow-hidden min-h-[90px] md:min-h-[100px] flex flex-col ${
            state?.status === 'approved' 
              ? hasCorequisiteWarning
                ? 'shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/50'
                : 'shadow-lg shadow-green-500/30 ring-2 ring-green-400/50'
              : state?.status === 'failed'
                ? 'shadow-lg shadow-red-500/30 ring-2 ring-red-400/50'
                : subject.electiveGroup || subject.electiveTrack
                  ? 'shadow-md hover:shadow-lg ring-1 ring-purple-400/30'
                  : 'shadow-md hover:shadow-lg'
          }`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseLeave}
        >
        {state?.status === 'approved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"
          />
        )}
        
        <AnimatePresence>
          {state?.status === 'approved' && !hasCorequisiteWarning && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
            >
              <FontAwesomeIcon 
                icon={faCheck} 
                className="text-white drop-shadow-md"
                style={{ fontSize: '2rem', opacity: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Código como carátula en esquina superior izquierda */}
        <div className={`absolute top-0 left-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/85'} rounded-br-lg px-2 py-0.5 flex items-center gap-1`}>
          {subject.electiveTrack && (
            <span className="text-[0.6rem] font-bold" style={{ color: getBackgroundColor() }}>
              {subject.trackOption}
            </span>
          )}
          {subject.electiveGroup && (
            <FontAwesomeIcon icon={faCodeBranch} className="text-[0.6rem] text-purple-500" />
          )}
          <span className="subject-code text-xs" style={{ color: getBackgroundColor() }}>
            {subject.code}
          </span>
        </div>
        
        <div className={`absolute top-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/85'} rounded-bl-lg px-2 py-0.5`}>
          <span className="credits text-xs" style={{ color: getBackgroundColor() }}>
            {getUcCredits(subject)}
          </span>
        </div>
        
        <AnimatePresence>
          {isBlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute bottom-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/85'} rounded-tl-lg px-2 py-0.5`}
            >
              <FontAwesomeIcon icon={faLock} className="text-xs" style={{ color: getBackgroundColor() }} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {hasCorequisiteWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 bg-orange-500/90 rounded-tr-lg px-2 py-0.5"
            >
              <FontAwesomeIcon icon={faLink} className="text-xs text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex-1 px-2 md:px-3 pt-8 md:pt-10 pb-1 md:pb-2">
          <h3 className="subject-name text-xs leading-tight text-white mb-1 flex items-center gap-1">
            {subject.name}
          </h3>
          
          {subject.creditRequirement && (
            <div className="mb-1">
              <div className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-lg ${
                approvedCredits >= subject.creditRequirement
                  ? 'bg-green-500/80'
                  : 'bg-red-500/80'
              } text-white`}>
                <FontAwesomeIcon icon={faTrophy} className="text-[0.6rem]" />
                <span>{subject.creditRequirement} créditos UC</span>
              </div>
            </div>
          )}
          
          {(subject.prerequisites.length > 0 || (subject.corequisites && subject.corequisites.length > 0) || (subject.alternativePrerequisites && subject.alternativePrerequisites.length > 0)) && (
            <div className="mt-auto space-y-1">
              {/* Prerrequisitos normales */}
              {subject.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {subject.prerequisites.map((prereq: string) => (
                    <PrerequisiteChip key={prereq} prereqCode={prereq} />
                  ))}
                </div>
              )}
              
              {/* ⭐ NUEVO: Prerrequisitos opcionales */}
              {subject.alternativePrerequisites && subject.alternativePrerequisites.length > 0 && (
                <div className="space-y-1">
                  {subject.alternativePrerequisites.map((group, groupIndex) => {
                    const hasApprovedOne = group.some(code => 
                      subjectStates[code]?.status === 'approved'
                    );
                    
                    return (
                      <div key={groupIndex} className="flex flex-wrap gap-1 items-center">
                        <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
                          hasApprovedOne 
                            ? 'bg-green-500/20 text-green-700 dark:text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {hasApprovedOne ? '✓' : '⚠'} Uno de:
                        </span>
                        {group.map((prereqCode, index) => (
                          <React.Fragment key={prereqCode}>
                            <AlternativePrerequisiteChip prereqCode={prereqCode} />
                            {index < group.length - 1 && (
                              <span className="text-[10px] text-white/60">o</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Correquisitos */}
              {subject.corequisites && subject.corequisites.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {subject.corequisites.map((coreq: string) => (
                    <CorequisiteChip key={coreq} coreqCode={coreq} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
      </div>
    </Tooltip>
    
    {/* ⭐ NUEVO: Modal para ingresar nota con long press */}
    <GradeInputModal
      show={showGradeModal}
      subject={subject}
      currentState={state}
      onSave={handleGradeSave}
      onClose={() => setShowGradeModal(false)}
      darkMode={darkMode}
    />
  </>
  );
}