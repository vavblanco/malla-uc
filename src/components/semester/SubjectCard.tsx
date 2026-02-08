'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheck, faLink, faTrophy, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import type { Subject, SubjectState, CalculatorState, SubjectColors } from '@/types/curriculum';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '../ui/Tooltip';
import { getUcCredits } from '@/hooks/credits';

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
  allSubjects?: Subject[]; // NUEVO: Para verificar grupos electivos
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
  allSubjects = [] // NUEVO
}: SubjectCardProps) {

  // NUEVO: Verificar si otro ramo del mismo grupo electivo está aprobado
  const getElectiveGroupConflict = () => {
    if (!subject.electiveGroup) return null;
    
    // Buscar otros ramos del mismo grupo electivo que estén aprobados
    const conflictingSubject = allSubjects.find(s => 
      s.electiveGroup === subject.electiveGroup && 
      s.code !== subject.code && 
      subjectStates[s.code]?.status === 'approved'
    );
    
    return conflictingSubject || null;
  };

  const electiveConflict = getElectiveGroupConflict();

  const canTakeSubject = () => {
    // Si hay un conflicto de grupo electivo y este ramo no está aprobado, está bloqueado
    if (electiveConflict && state?.status !== 'approved') {
      return false;
    }

    // Si no tiene prerrequisitos ni requisitos de créditos, siempre se puede tomar
    const hasNoRequirements = 
      subject.prerequisites.length === 0 && 
      !subject.creditRequirement;
    
    if (hasNoRequirements) return true;
    
    // Verificar que todos los prerrequisitos estén aprobados
    const prerequisitesMet = subject.prerequisites.every((prereqCode: string) => {
      const prereqState = subjectStates[prereqCode];
      return prereqState?.status === 'approved';
    });
    
    // Verificar requisito de créditos si existe
    const creditRequirementMet = !subject.creditRequirement || 
      approvedCredits >= subject.creditRequirement;
    
    return prerequisitesMet && creditRequirementMet;
  };

  // Verificar si hay correquisitos no cumplidos
  const getMissingCorequisites = () => {
    if (!subject.corequisites || subject.corequisites.length === 0) return [];
    
    return subject.corequisites.filter((coreqCode: string) => {
      const coreqState = subjectStates[coreqCode];
      // Un correquisito no está cumplido si el ramo actual está aprobado/pendiente 
      // pero el correquisito no está también aprobado/pendiente
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

  // Devuelve clases de texto y borde con el color de la categoría como texto
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

  // El color del texto principal (ahora blanco para contrastar con el fondo de color)
  const getTextColor = () => {
    if (isBlocked) return '#9ca3af'; // gray-400
    if (state?.status === 'approved') return '#fff'; // blanco para green-50
    // blanco para contrastar con el color de fondo
    return '#fff';
  };

  // El fondo ahora usa el color de la categoría
  const getBackgroundColor = () => {
    if (isBlocked) return darkMode ? '#4b5563' : '#6b7280'; // gray-600 (dark) / gray-500 (light)
    if (state?.status === 'approved') return '#10b981'; // green-500 (same for both modes)
    // color de la categoría del JSON
    return color || (darkMode ? '#374151' : '#fff'); // gray-700 (dark) / white (light)
  };

  const handleClick = () => {
    // No permitir cambios si está bloqueada (excepto si ya está aprobada)
    if (isBlocked) return;
    
    // Alternar entre pendiente y aprobado con un simple click
    const newStatus = state?.status === 'approved' ? 'pending' : 'approved';
    onStateChange({ status: newStatus });
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
    // Color de la categoría del prerrequisito
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

  const tooltipContent = (
    <div className="space-y-1">
      <div className="font-bold">{subject.name}</div>
      <div className="text-xs opacity-70">{subject.code} • {getUcCredits(subject)} créditos UC</div>
      
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
      
      {subject.corequisites && subject.corequisites.length > 0 && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faLink} className="mr-1" />
          Correquisitos: {subject.corequisites.map(code => findSubjectByCode(code)?.name || code).join(', ')}
        </div>
      )}
      
      {subject.creditRequirement && (
        <div className="text-xs opacity-70 pt-1 border-t border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faTrophy} className="mr-1" />
          Requiere {subject.creditRequirement} créditos aprobados
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
              : subject.electiveGroup
                ? 'shadow-md hover:shadow-lg ring-1 ring-purple-400/30'
                : 'shadow-md hover:shadow-lg'
          }`}
          onClick={handleClick}
        >
        {/* Efecto de brillo para asignaturas aprobadas */}
        {state?.status === 'approved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"
          />
        )}
        
        {/* Ícono de check para asignaturas aprobadas */}
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
          {subject.electiveGroup && (
            <FontAwesomeIcon icon={faCodeBranch} className="text-[0.6rem] text-purple-500" />
          )}
          <span className="subject-code text-xs" style={{ color: getBackgroundColor() }}>
            {subject.code}
          </span>
        </div>
        
        {/* Créditos como carátula en esquina superior derecha */}
        <div className={`absolute top-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/85'} rounded-bl-lg px-2 py-0.5`}>
          <span className="credits text-xs" style={{ color: getBackgroundColor() }}>
            {getUcCredits(subject)}
          </span>
        </div>
        
        {/* Icono de bloqueo como carátula en esquina inferior derecha */}
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
        
        {/* Advertencia de correquisitos faltantes */}
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
        
        {/* Contenido principal */}
        <div className="flex-1 px-2 md:px-3 pt-8 md:pt-10 pb-1 md:pb-2">
          <h3 className="subject-name text-xs leading-tight text-white mb-1 flex items-center gap-1">
            {subject.name}
          </h3>
          
          {/* Requisito de créditos */}
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
          
          {/* Prerrequisitos y Correquisitos */}
          {(subject.prerequisites.length > 0 || (subject.corequisites && subject.corequisites.length > 0)) && (
            <div className="mt-auto space-y-1">
              {/* Prerrequisitos */}
              {subject.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {subject.prerequisites.map((prereq: string) => (
                    <PrerequisiteChip key={prereq} prereqCode={prereq} />
                  ))}
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
  );
}