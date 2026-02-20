'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Subject, SubjectState } from '@/types/curriculum';
import { getUcCredits } from '@/hooks/credits';

interface GradeInputModalProps {
  show: boolean;
  subject: Subject | null;
  currentState: SubjectState | undefined;
  onSave: (state: SubjectState) => void;
  onClose: () => void;
  darkMode?: boolean;
}

export default function GradeInputModal({
  show,
  subject,
  currentState,
  onSave,
  onClose,
  darkMode = false
}: GradeInputModalProps) {
  const [grade, setGrade] = useState<string>(currentState?.grade?.toString() || '');
  const [status, setStatus] = useState<'approved' | 'failed' | 'pending'>(
    currentState?.status || 'pending'
  );

  useEffect(() => {
    if (show && currentState) {
      setGrade(currentState.grade?.toString() || '');
      setStatus(currentState.status);
    }
  }, [show, currentState]);

  const handleSave = () => {
    const gradeNum = parseFloat(grade);
    
    if (status === 'pending') {
      // Si vuelve a pending, limpiar la nota
      onSave({ status: 'pending', grade: undefined });
    } else if (!isNaN(gradeNum) && gradeNum >= 1.0 && gradeNum <= 7.0) {
      onSave({ status, grade: gradeNum });
    } else {
      // Si no hay nota válida, mostrar error
      alert('Ingresa una nota válida entre 1.0 y 7.0');
      return;
    }
    
    onClose();
  };

  const handleCancel = () => {
    setGrade(currentState?.grade?.toString() || '');
    setStatus(currentState?.status || 'pending');
    onClose();
  };

  if (!show || !subject) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${
            darkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
                <div>
                  <h3 className="font-bold text-lg">Ingresar Calificación</h3>
                  <p className="text-sm opacity-90">{subject.name}</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-white/20'
                }`}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Info del ramo */}
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="text-sm opacity-70 mb-1">Ramo</div>
              <div className="font-semibold">{subject.name}</div>
              <div className="text-sm opacity-70 mt-1">
                {subject.code} • {getUcCredits(subject)} créditos UC
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Estado del ramo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setStatus('approved')}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    status === 'approved'
                      ? 'bg-green-500 text-white ring-2 ring-green-400'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✓ Aprobado
                </button>
                <button
                  onClick={() => setStatus('failed')}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    status === 'failed'
                      ? 'bg-red-500 text-white ring-2 ring-red-400'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✗ Reprobado
                </button>
                <button
                  onClick={() => setStatus('pending')}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    status === 'pending'
                      ? 'bg-gray-500 text-white ring-2 ring-gray-400'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ○ Pendiente
                </button>
              </div>
            </div>

            {/* Nota (solo si no es pending) */}
            {status !== 'pending' && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nota final (1.0 - 7.0)
                </label>
                <input
                  type="number"
                  min="1.0"
                  max="7.0"
                  step="0.1"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Ej: 5.5"
                  className={`w-full px-4 py-3 rounded-lg border text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  autoFocus
                />
                
                {/* Indicador de aprobación */}
                {grade && !isNaN(parseFloat(grade)) && (
                  <div className={`mt-2 text-sm text-center font-semibold ${
                    parseFloat(grade) >= 4.0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(grade) >= 4.0 ? '✓ Nota de aprobación' : '✗ Nota insuficiente'}
                  </div>
                )}
              </div>
            )}

            {/* Info adicional */}
            <div className={`p-3 rounded-lg text-xs ${
              darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
            }`}>
              <strong>Nota:</strong> Esta calificación se usará para calcular tu PPA 
              (Promedio Ponderado Acumulado). {status === 'failed' && 
              'Los ramos reprobados también cuentan para el PPA.'}
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex gap-2 ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <button
              onClick={handleCancel}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Guardar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
