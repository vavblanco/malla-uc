'use client';

import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Subject, SubjectState } from '@/types/curriculum';
import { getUcCredits } from '@/hooks/credits';
import { formatDecimal, formatDecimal2 } from '@/hooks/formatDecimal';


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

  // ⭐ NUEVO: Calcular Notas de Licenciatura y Título según reglamento FCB
  const graduationCalculations = useMemo(() => {
    // Buscar el Examen de Grado con múltiples criterios
    const examenGrado = subjects.find(s => {
      const nameLower = s.name.toLowerCase();
      const codeLower = s.code.toLowerCase();
      
      return (
        // Por código común
        s.code === 'BIO500' ||
        codeLower.includes('examen') ||
        // Por nombre
        nameLower.includes('examen de grado') ||
        nameLower.includes('examen grado') ||
        (nameLower.includes('examen') && nameLower.includes('grado')) ||
        // Por tipo de asignatura
        s.type === 'Examen' ||
        s.type === 'EG'
      );
    });
    
    const examenGradoState = examenGrado ? subjectStates[examenGrado.code] : undefined;
    const notaExamenGrado = examenGradoState?.grade;

    // PPA de Licenciatura (todos los ramos hasta el examen inclusive)
    const ppaLicenciatura = ppaResult.ppa;

    // Nota de Licenciatura = (0.75 × PPA) + (0.25 × Nota Examen)
    let notaLicenciatura: number | null = null;
    if (notaExamenGrado && notaExamenGrado >= 4.0) {
      notaLicenciatura = (0.75 * ppaLicenciatura) + (0.25 * notaExamenGrado);
      notaLicenciatura = Math.round(notaLicenciatura * 100) / 100;
    }

    // ⭐ PPA de Título (ramos con categoría 'FT' - Fase Título)
    const ramosTitulo = gradedCourses.filter(c => {
      return c.subject.type === 'FT';
    });

    let ppaTitulo: number | null = null;
    if (ramosTitulo.length > 0) {
      const creditosTitulo = ramosTitulo.reduce((sum, c) => sum + c.credits, 0);
      const puntosTitulo = ramosTitulo.reduce((sum, c) => sum + (c.grade * c.credits), 0);
      ppaTitulo = creditosTitulo > 0 ? puntosTitulo / creditosTitulo : 0;
      ppaTitulo = Math.round(ppaTitulo * 100) / 100;
    }

    // Nota de Título = (0.8 × Nota Licenciatura) + (0.2 × PPA Título)
    let notaTitulo: number | null = null;
    if (notaLicenciatura && ppaTitulo !== null) {
      notaTitulo = (0.8 * notaLicenciatura) + (0.2 * ppaTitulo);
      notaTitulo = Math.round(notaTitulo * 100) / 100;
    }

    return {
      notaExamenGrado,
      ppaLicenciatura,
      notaLicenciatura,
      ppaTitulo,
      notaTitulo,
      ramosTituloCount: ramosTitulo.length
    };
  }, [ppaResult.ppa, gradedCourses, subjects, subjectStates]);

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
              {ppaResult.ppa > 0 ? formatDecimal2(ppaResult.ppa) : '—'}
            </div>
            {ppaResult.ppa > 0 && (
              <div className={`text-sm font-medium ${
                ppaResult.ppa >= 4.0 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {ppaResult.ppa >= 4.0 ? '✓ ¡Sigue así!' : '⚠️ ¡Ten cuidado! Riesgo de alerta académica'}
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
                    Recuerda que tienes la Consejería Académica y la Dirección de Pregrado en caso de consultas.
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

          {/* ⭐ NUEVO: Notas de Licenciatura y Título */}
          {gradedCourses.length > 0 && (graduationCalculations.notaLicenciatura || graduationCalculations.notaTitulo) && (
            <div className={`p-6 border-b ${
              darkMode ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-gray-600' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
            }`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                🎓 Notas de Graduación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nota Examen de Grado */}
                {graduationCalculations.notaExamenGrado && (
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-white shadow-md'
                  }`}>
                    <div className="text-xs font-semibold opacity-70 mb-2">Examen de Grado</div>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {formatDecimal(graduationCalculations.notaExamenGrado)}
                    </div>
                    <div className="text-xs opacity-60 mt-2">25% de Nota Licenciatura</div>
                  </div>
                )}

                {/* Nota de Licenciatura */}
                {graduationCalculations.notaLicenciatura && (
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-indigo-900/40' : 'bg-indigo-100 shadow-md'
                  }`}>
                    <div className="text-xs font-semibold opacity-70 mb-2">Nota de Licenciatura</div>
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatDecimal2(graduationCalculations.notaLicenciatura)}
                    </div>
                    <div className="text-xs opacity-60 mt-2">
                      75% PPA ({formatDecimal2(graduationCalculations.ppaLicenciatura)}) + 25% Examen
                    </div>
                  </div>
                )}

                {/* Nota de Título */}
                {graduationCalculations.notaTitulo && (
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-purple-900/40' : 'bg-purple-100 shadow-md'
                  }`}>
                    <div className="text-xs font-semibold opacity-70 mb-2">Nota de Título</div>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                      {formatDecimal2(graduationCalculations.notaTitulo)}
                    </div>
                    <div className="text-xs opacity-60 mt-2">
                      80% Licenciatura + 20% PPA Título ({graduationCalculations.ppaTitulo ? formatDecimal2(graduationCalculations.ppaTitulo) : '—'})
                    </div>
                  </div>
                )}
              </div>

              {/* Fórmulas explicativas */}
              <div className={`mt-4 p-3 rounded-lg text-xs ${
                darkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}>
                <div className="font-semibold mb-2">📐 Fórmulas:</div>
                <div className="space-y-1 opacity-80">
                  <div>• <strong>Nota Licenciatura</strong> = (0,75 × PPA) + (0,25 × Examen de Grado)</div>
                  <div>• <strong>Nota Título</strong> = (0,8 × Nota Licenciatura) + (0,2 × PPA Título)</div>
                </div>
                {graduationCalculations.ramosTituloCount > 0 && (
                  <div className="mt-2 text-xs opacity-60">
                    Se detectaron {graduationCalculations.ramosTituloCount} ramo(s) de fase título (categoría FT).
                  </div>
                )}
              </div>
            </div>
          )}

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
                      Tu PPA: ({formatDecimal2(ppaResult.totalPoints)} puntos) ÷ ({ppaResult.totalCredits} créditos UC) = {formatDecimal2(ppaResult.ppa)}
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
                                {formatDecimal(grade)}
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
