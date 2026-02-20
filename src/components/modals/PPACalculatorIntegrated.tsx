'use client';

import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Subject, SubjectState } from '@/types/curriculum';
import { getUcCredits } from '@/hooks/credits';

interface PPACalculatorIntegratedProps {
  show: boolean;
  onClose: () => void;
  subjects: Subject[];
  subjectStates: Record<string, SubjectState>;
  darkMode?: boolean;
}

export default function PPACalculatorIntegrated({
  show,
  onClose,
  subjects,
  subjectStates,
  darkMode = false
}: PPACalculatorIntegratedProps) {

  // Obtener todos los ramos con nota (aprobados y reprobados)
  const gradedCourses = useMemo(() => {
    return subjects
      .filter(subject => {
        const state = subjectStates[subject.code];
        return state && 
               (state.status === 'approved' || state.status === 'failed') && 
               state.grade !== undefined;
      })
      .map(subject => {
        const state = subjectStates[subject.code]!;
        return {
          subject,
          grade: state.grade!,
          credits: getUcCredits(subject),
          status: state.status
        };
      });
  }, [subjects, subjectStates]);

  // ⭐ NUEVO: Detectar alertas académicas según reglamento UC
  const academicAlerts = useMemo(() => {
    const alerts: string[] = [];
    
    if (gradedCourses.length === 0) return alerts;

    // Agrupar por semestre para análisis
    const coursesBySemester = new Map<string, typeof gradedCourses>();
    gradedCourses.forEach(course => {
      const sem = course.subject.semester || 'sin-semestre';
      if (!coursesBySemester.has(sem)) {
        coursesBySemester.set(sem, []);
      }
      coursesBySemester.get(sem)!.push(course);
    });

    // Determinar el semestre actual del estudiante (el más alto con ramos cursados)
    const semestersWithGrades = Array.from(coursesBySemester.keys())
      .filter(s => s.startsWith('s'))
      .map(s => parseInt(s.replace('s', '')))
      .sort((a, b) => b - a);
    
    const currentSemesterNum = semestersWithGrades[0] || 0;
    
    // Calcular PPA
    const totalCredits = gradedCourses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = gradedCourses.reduce((sum, c) => sum + (c.grade * c.credits), 0);
    const ppa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // a) Primer semestre con PPA < 4.0
    if (currentSemesterNum === 1 && ppa < 4.0) {
      alerts.push('Alerta académica: PPA menor a 4.0 en primer semestre');
    }

    // b) Primer semestre aprobó menos de 50% de créditos inscritos
    if (currentSemesterNum === 1) {
      const s1Courses = coursesBySemester.get('s1') || [];
      const s1Credits = s1Courses.reduce((sum, c) => sum + c.credits, 0);
      const s1ApprovedCredits = s1Courses
        .filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + c.credits, 0);
      
      if (s1Credits > 0 && (s1ApprovedCredits / s1Credits) < 0.5) {
        alerts.push('Alerta académica: Aprobaste menos del 50% de créditos en primer semestre');
      }
    }

    // c) Segundo semestre con PPA < 4.0
    if (currentSemesterNum === 2 && ppa < 4.0) {
      alerts.push('Alerta académica: PPA menor a 4.0 en segundo semestre');
    }

    // d) A partir del segundo semestre: PPA < 4.5 Y < 40% créditos aprobados en últimos 2 semestres
    if (currentSemesterNum >= 2 && ppa < 4.5) {
      // Calcular créditos de últimos 2 semestres
      const lastTwoSemesters = semestersWithGrades.slice(0, 2);
      const lastTwoCourses = gradedCourses.filter(c => {
        const semNum = parseInt((c.subject.semester || '').replace('s', ''));
        return lastTwoSemesters.includes(semNum);
      });
      
      const lastTwoCredits = lastTwoCourses.reduce((sum, c) => sum + c.credits, 0);
      const lastTwoApproved = lastTwoCourses
        .filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + c.credits, 0);
      
      if (lastTwoCredits > 0 && (lastTwoApproved / lastTwoCredits) < 0.4) {
        alerts.push('Alerta académica: PPA menor a 4.5 y aprobaste menos del 40% en últimos 2 semestres');
      }
    }

    // e) A partir del tercer semestre con PPA < 4.0
    if (currentSemesterNum >= 3 && ppa < 4.0) {
      alerts.push('Alerta académica: PPA menor a 4.0 desde tercer semestre');
    }

    // f) Reprobó 3+ veces el mismo ramo
    // (Esto requeriría historial, por ahora solo podemos detectar 1 reprobación)
    // Lo implementaremos cuando tengamos historial de intentos

    return alerts;
  }, [gradedCourses]);

  // Calcular PPA
  const ppaResult = useMemo(() => {
    if (gradedCourses.length === 0) {
      return { 
        ppa: 0, 
        totalCredits: 0, 
        totalPoints: 0, 
        courseCount: 0,
        approvedCount: 0,
        failedCount: 0
      };
    }

    const totalCredits = gradedCourses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = gradedCourses.reduce((sum, c) => sum + (c.grade * c.credits), 0);
    const ppa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    
    const approvedCount = gradedCourses.filter(c => c.status === 'approved').length;
    const failedCount = gradedCourses.filter(c => c.status === 'failed').length;

    return {
      ppa: Math.round(ppa * 100) / 100,
      totalCredits,
      totalPoints: Math.round(totalPoints * 100) / 100,
      courseCount: gradedCourses.length,
      approvedCount,
      failedCount
    };
  }, [gradedCourses]);

  // Agrupar por semestre para mostrar
  const coursesBySemester = useMemo(() => {
    const grouped = new Map<string, typeof gradedCourses>();
    
    gradedCourses.forEach(course => {
      const semester = course.subject.semester || 'Sin semestre';
      if (!grouped.has(semester)) {
        grouped.set(semester, []);
      }
      grouped.get(semester)!.push(course);
    });

    // Ordenar por semestre
    return Array.from(grouped.entries()).sort((a, b) => {
      const numA = parseInt(a[0].replace('s', '')) || 999;
      const numB = parseInt(b[0].replace('s', '')) || 999;
      return numA - numB;
    });
  }, [gradedCourses]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalculator} className="text-2xl" />
                <div>
                  <h2 className="text-xl font-bold">Tu PPA Actual</h2>
                  <p className="text-sm opacity-90">Promedio Ponderado Acumulado</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-white/20'
                }`}
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>

          {/* PPA Result - Grande y destacado */}
          <div className={`p-8 text-center border-b ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <div className="text-sm font-semibold opacity-70 mb-2">TU PPA ACTUAL</div>
            <div className={`text-7xl font-bold mb-2 ${
              ppaResult.ppa >= 4.0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {ppaResult.ppa > 0 ? ppaResult.ppa.toFixed(2) : '—'}
            </div>
            {ppaResult.ppa > 0 && (
              <div className={`text-sm font-medium ${
                ppaResult.ppa >= 4.0 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {ppaResult.ppa >= 4.0 ? '✓ Buen rendimiento' : '⚠️ ¡Ten cuidado! Riesgo de alerta académica'}
              </div>
            )}
          </div>

          {/* ⭐ NUEVO: Alertas Académicas */}
          {academicAlerts.length > 0 && (
            <div className={`p-4 border-b ${
              darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                    Alertas Académicas Detectadas
                  </h3>
                  <ul className="space-y-1">
                    {academicAlerts.map((alert, index) => (
                      <li key={index} className="text-sm text-yellow-800 dark:text-yellow-300">
                        • {alert}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs mt-2 text-yellow-700 dark:text-yellow-400 italic">
                    Recuerda consultar con tu tutor académico para planificar estrategias de mejora.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {ppaResult.approvedCount}
              </div>
              <div className="text-xs font-semibold opacity-70 mt-1">
                Ramos Aprobados
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {ppaResult.failedCount}
              </div>
              <div className="text-xs font-semibold opacity-70 mt-1">
                Ramos Reprobados
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {ppaResult.totalCredits}
              </div>
              <div className="text-xs font-semibold opacity-70 mt-1">
                Créditos UC Cursados
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {ppaResult.totalPoints.toFixed(1)}
              </div>
              <div className="text-xs font-semibold opacity-70 mt-1">
                Puntos Totales
              </div>
            </div>
          </div>

          {/* Info Box */}
          {gradedCourses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">No hay ramos con nota aún</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Haz click en los ramos de tu malla e ingresa las notas para calcular tu PPA.
              </p>
            </div>
          ) : (
            <>
              {/* Fórmula y explicación */}
              <div className={`mx-6 mt-4 p-3 rounded-lg ${
                darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-0.5" />
                  <div className="text-sm flex-1">
                    <strong>Fórmula:</strong> PPA = Σ(Nota × Créditos UC) / Σ(Créditos UC)
                    <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tu PPA: ({ppaResult.totalPoints.toFixed(2)} puntos) ÷ ({ppaResult.totalCredits} créditos UC) = {ppaResult.ppa.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalle por semestre */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-520px)]">
                <h3 className="text-lg font-bold mb-4">Detalle de Ramos Cursados</h3>
                <div className="space-y-4">
                  {coursesBySemester.map(([semester, courses]) => (
                    <div key={semester}>
                      <h4 className="text-sm font-bold opacity-70 mb-2">
                        {semester.startsWith('s') ? `Semestre ${semester.replace('s', '')}` : semester}
                      </h4>
                      <div className="space-y-1">
                        {courses.map(({ subject, grade, credits, status }) => (
                          <div
                            key={subject.code}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-sm">
                                {subject.name}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                  status === 'approved'
                                    ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                                    : 'bg-red-500/20 text-red-700 dark:text-red-400'
                                }`}>
                                  {status === 'approved' ? 'Aprobado' : 'Reprobado'}
                                </span>
                              </div>
                              <div className="text-xs opacity-70">
                                {subject.code} • {credits} créditos UC
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${
                                grade >= 5.0 ? 'text-green-600' :
                                grade >= 4.0 ? 'text-blue-600' :
                                'text-red-600'
                              }`}>
                                {grade.toFixed(1)}
                              </div>
                              <div className="text-xs opacity-70">
                                {(grade * credits).toFixed(1)} pts
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className={`px-6 py-4 border-t ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
