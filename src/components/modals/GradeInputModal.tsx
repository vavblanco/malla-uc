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

  // ⭐ NUEVO: Sistema de múltiples intentos
  const [hasMultipleAttempts, setHasMultipleAttempts] = useState(
    (currentState?.attempts && currentState.attempts.length > 0) || false
  );
  const [attempts, setAttempts] = useState<Array<{ grade: string; status: 'approved' | 'failed' }>>(
    currentState?.attempts?.map(a => ({ 
      grade: a.grade.toString(), 
      status: a.status 
    })) || [{ grade: '', status: 'failed' }]
  );

  useEffect(() => {
    if (show && currentState) {
      setGrade(currentState.grade?.toString() || '');
      setStatus(currentState.status);
      
      if (currentState.attempts && currentState.attempts.length > 0) {
        setHasMultipleAttempts(true);
        setAttempts(currentState.attempts.map(a => ({
          grade: a.grade.toString(),
          status: a.status
        })));
      } else {
        setHasMultipleAttempts(false);
        setAttempts([{ grade: '', status: 'failed' }]);
      }
    }
  }, [show, currentState]);

  const handleSave = () => {
    if (status === 'pending') {
      onSave({ status: 'pending', grade: undefined });
      onClose();
      return;
    }

    // ⭐ NUEVO: Lógica de múltiples intentos
    if (hasMultipleAttempts) {
      // Validar todas las notas
      const attemptsData = attempts.map(a => ({
        grade: parseFloat(a.grade),
        status: a.status
      }));

      // Verificar que todas las notas sean válidas
      if (attemptsData.some(a => isNaN(a.grade) || a.grade < 1.0 || a.grade > 7.0)) {
        alert('Todas las notas deben estar entre 1,0 y 7,0');
        return;
      }

      // El último intento determina el estado final
      const lastAttempt = attemptsData[attemptsData.length - 1];
      const finalStatus = lastAttempt.grade >= 4.0 ? 'approved' : 'failed';
      
      onSave({
        status: finalStatus,
        grade: lastAttempt.grade,
        attempts: attemptsData
      });
    } else {
      // Lógica normal (un solo intento)
      const gradeNum = parseFloat(grade);
      
      if (isNaN(gradeNum) || gradeNum < 1.0 || gradeNum > 7.0) {
        alert('Ingresa una nota válida entre 1,0 y 7,0');
        return;
      }

      onSave({ status, grade: gradeNum });
    }
    
    onClose();
  };

  const handleCancel = () => {
    setGrade(currentState?.grade?.toString() || '');
    setStatus(currentState?.status || 'pending');
    setHasMultipleAttempts(false);
    setAttempts([{ grade: '', status: 'failed' }]);
    onClose();
  };

  const addAttempt = () => {
    if (attempts.length < 3) {
      setAttempts([...attempts, { grade: '', status: 'failed' }]);
    }
  };

  const removeAttempt = (index: number) => {
    if (attempts.length > 1) {
      setAttempts(attempts.filter((_, i) => i !== index));
    }
  };

  const updateAttempt = (index: number, field: 'grade' | 'status', value: string | 'approved' | 'failed') => {
    const newAttempts = [...attempts];
    if (field === 'grade') {
      newAttempts[index].grade = value as string;
    } else {
      newAttempts[index].status = value as 'approved' | 'failed';
    }
    setAttempts(newAttempts);
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
          className={`w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b flex-shrink-0 ${
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

          {/* Content - Scrolleable */}
          <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
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
                  className={`py-3 px-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center min-h-[60px] ${
                    status === 'approved'
                      ? 'bg-green-500 text-white ring-2 ring-green-400'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl mb-1">✓</span>
                  <span className="text-xs">Aprobado</span>
                </button>
                <button
                  onClick={() => setStatus('failed')}
                  className={`py-3 px-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center min-h-[60px] ${
                    status === 'failed'
                      ? 'bg-red-500 text-white ring-2 ring-red-400'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl mb-1">✗</span>
                  <span className="text-xs">Reprobado</span>
                </button>
                <button
                  onClick={() => setStatus('pending')}
                  className={`py-3 px-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center min-h-[60px] ${
                    status === 'pending'
                      ? 'bg-gray-500 text-white ring-2 ring-gray-400'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl mb-1">○</span>
                  <span className="text-xs">Pendiente</span>
                </button>
              </div>
            </div>

            {/* ⭐ NUEVO: Checkbox de múltiples intentos */}
            {status !== 'pending' && (
              <div className={`p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasMultipleAttempts}
                    onChange={(e) => {
                      setHasMultipleAttempts(e.target.checked);
                      if (e.target.checked && attempts.length === 0) {
                        setAttempts([{ grade: '', status: 'failed' }]);
                      }
                    }}
                    className="w-5 h-5 rounded cursor-pointer accent-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      Este ramo lo cursé múltiples veces
                    </div>
                    <div className="text-xs opacity-70 mt-0.5">
                      Marca si cursaste este ramo 2 o 3 veces
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Nota (solo si no es pending) */}
            {status !== 'pending' && (
              <>
                {hasMultipleAttempts ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Intentos del ramo:</h4>
                      {attempts.length < 3 && (
                        <button
                          type="button"
                          onClick={addAttempt}
                          className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          + Agregar intento
                        </button>
                      )}
                    </div>

                    {attempts.map((attempt, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            Intento #{index + 1}
                          </span>
                          {attempts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAttempt(index)}
                              className="text-xs text-red-600 dark:text-red-400 hover:underline"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Nota */}
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Nota
                            </label>
                            <input
                              type="number"
                              min="1.0"
                              max="7.0"
                              step="0.1"
                              value={attempt.grade}
                              onChange={(e) => updateAttempt(index, 'grade', e.target.value)}
                              placeholder="Ej: 3,5"
                              className={`w-full px-3 py-2 rounded-lg border text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                darkMode
                                  ? 'bg-gray-800 border-gray-600 text-white'
                                  : 'bg-gray-50 border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>

                          {/* Estado (solo primeros intentos pueden ser "failed") */}
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Resultado
                            </label>
                            <select
                              value={
                                index === attempts.length - 1 && attempt.grade
                                  ? parseFloat(attempt.grade) >= 4.0
                                    ? 'approved'
                                    : 'failed'
                                  : attempt.status
                              }
                              onChange={(e) =>
                                updateAttempt(index, 'status', e.target.value as 'approved' | 'failed')
                              }
                              disabled={index === attempts.length - 1}
                              className={`w-full px-3 py-2 rounded-lg border text-center text-sm font-semibold ${
                                darkMode
                                  ? 'bg-gray-800 border-gray-600 text-white'
                                  : 'bg-gray-50 border-gray-300 text-gray-900'
                              } ${index === attempts.length - 1 ? 'opacity-60' : ''}`}
                            >
                              <option value="failed">❌ Reprobado</option>
                              <option value="approved">✓ Aprobado</option>
                            </select>
                          </div>
                        </div>

                        {/* Indicador automático para último intento */}
                        {index === attempts.length - 1 && attempt.grade && !isNaN(parseFloat(attempt.grade)) && (
                          <div className={`mt-2 text-xs text-center font-semibold ${
                            parseFloat(attempt.grade) >= 4.0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {parseFloat(attempt.grade) >= 4.0
                              ? `✓ Aprobado (${parseFloat(attempt.grade).toFixed(1).replace('.', ',')})`
                              : `✗ Reprobado (${parseFloat(attempt.grade).toFixed(1).replace('.', ',')})`}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Info adicional */}
                    <div className={`p-3 rounded-lg text-xs ${
                      darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                      <strong>📌 Importante:</strong> Todas las notas de todos los intentos se incluirán en el cálculo de tu PPA.
                    </div>
                  </div>
                ) : (
                  /* Campo normal de nota única */
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
                      placeholder="Ej: 5,5"
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
                        parseFloat(grade) >= 4.0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {parseFloat(grade) >= 4.0 ? '✓ Nota de aprobación' : '✗ Nota insuficiente'}
                      </div>
                    )}

                    {/* Info adicional */}
                    <div className={`p-3 rounded-lg text-xs mt-3 ${
                      darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                      <strong>Nota:</strong> Esta calificación se usará para calcular tu PPA.
                      {status === 'failed' && ' Los ramos reprobados también cuentan para el PPA.'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex gap-2 flex-shrink-0 ${
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