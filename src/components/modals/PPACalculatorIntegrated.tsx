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

  // ⭐ NUEVO: Estado para pestañas
  const [activeTab, setActiveTab] = React.useState<'resumen' | 'graduacion' | 'detalle'>('resumen');

  // Obtener todos los ramos con nota (aprobados y reprobados)
  // ⭐ ACTUALIZADO: Soporte para múltiples intentos
  const gradedCourses = useMemo(() => {
    const courses: Array<{
      subject: Subject;
      grade: number;
      credits: number;
      status: 'approved' | 'failed';
      attemptNumber?: number;
      totalAttempts?: number;
    }> = [];

    subjects.forEach(subject => {
      const state = subjectStates[subject.code];
      
      if (!state) return;
      
      const credits = getUcCredits(subject);

      // ⭐ NUEVO: Si tiene múltiples intentos, agregar TODOS
      if (state.attempts && state.attempts.length > 0) {
        state.attempts.forEach((attempt, index) => {
          courses.push({
            subject,
            grade: attempt.grade,
            credits,
            status: attempt.status,
            attemptNumber: index + 1,
            totalAttempts: state.attempts!.length
          });
        });
      } 
      // Lógica normal (un solo intento)
      else if ((state.status === 'approved' || state.status === 'failed') && state.grade) {
        courses.push({
          subject,
          grade: state.grade,
          credits,
          status: state.status
        });
      }
    });

    return courses;
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
          className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b flex-shrink-0 ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalculator} className="text-2xl" />
                <div>
                  <h2 className="text-xl font-bold">Calculadora PPA</h2>
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

          {/* Tabs */}
          <div className={`flex border-b flex-shrink-0 ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={() => setActiveTab('resumen')}
              className={`flex-1 py-3 px-4 text-sm md:text-base font-semibold transition-colors relative ${
                activeTab === 'resumen'
                  ? darkMode
                    ? 'text-blue-400 bg-gray-700'
                    : 'text-blue-600 bg-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">📊 </span>Resumen
              {activeTab === 'resumen' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('graduacion')}
              className={`flex-1 py-3 px-4 text-sm md:text-base font-semibold transition-colors relative ${
                activeTab === 'graduacion'
                  ? darkMode
                    ? 'text-blue-400 bg-gray-700'
                    : 'text-blue-600 bg-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">🎓 </span>Graduación
              {activeTab === 'graduacion' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('detalle')}
              className={`flex-1 py-3 px-4 text-sm md:text-base font-semibold transition-colors relative ${
                activeTab === 'detalle'
                  ? darkMode
                    ? 'text-blue-400 bg-gray-700'
                    : 'text-blue-600 bg-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">📝 </span>Detalle
              {activeTab === 'detalle' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* TAB: RESUMEN */}
                {activeTab === 'resumen' && (
                  <div>
                    {gradedCourses.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-xl font-bold mb-2">No hay ramos con nota aún</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Haz long press en los ramos de tu malla para ingresar notas y calcular tu PPA.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* PPA Grande */}
                        <div className={`p-6 text-center ${
                          darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                        }`}>
                          <div className="text-xs font-semibold opacity-70 mb-2">TU PPA ACTUAL</div>
                          <div className={`text-6xl md:text-7xl font-bold mb-2 ${
                            ppaResult.ppa >= 4.0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {formatDecimal2(ppaResult.ppa)}
                          </div>
                          <div className={`text-sm font-medium ${
                            ppaResult.ppa >= 4.0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {ppaResult.ppa >= 4.0 ? '✓ ¡Sigue así!' : '⚠️ ¡Ten cuidado! Riesgo de alerta académica'}
                          </div>
                        </div>

                        {/* Alertas */}
                        {academicAlerts.length > 0 && (
                          <div className={`mx-4 mt-4 p-3 rounded-lg ${
                            darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
                          }`}>
                            <div className="flex items-start gap-2">
                              <div className="text-lg">⚠️</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-yellow-700 dark:text-yellow-400 text-sm mb-1">
                                  Alertas Académicas
                                </h3>
                                <ul className="space-y-0.5">
                                  {academicAlerts.map((alert, index) => (
                                    <li key={index} className="text-xs text-yellow-800 dark:text-yellow-300">
                                      • {alert}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Stats Grid 2x2 */}
                        <div className={`grid grid-cols-2 gap-3 p-4 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {ppaResult.approvedCount}
                            </div>
                            <div className="text-xs font-semibold opacity-70 mt-1">
                              Aprobados
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                              {ppaResult.failedCount}
                            </div>
                            <div className="text-xs font-semibold opacity-70 mt-1">
                              Reprobados
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {ppaResult.totalCredits}
                            </div>
                            <div className="text-xs font-semibold opacity-70 mt-1">
                              Créditos UC
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {formatDecimal(ppaResult.totalPoints)}
                            </div>
                            <div className="text-xs font-semibold opacity-70 mt-1">
                              Puntos
                            </div>
                          </div>
                        </div>

                        {/* Fórmula */}
                        <div className={`mx-4 mb-4 p-3 rounded-lg text-xs ${
                          darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <div className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 text-blue-600 dark:text-blue-400" />
                            <div className="flex-1">
                              <div className="font-semibold mb-1">📐 Fórmula PPA:</div>
                              <div className="opacity-80">
                                ({formatDecimal2(ppaResult.totalPoints)} puntos) ÷ ({ppaResult.totalCredits} UC) = <strong>{formatDecimal2(ppaResult.ppa)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB: GRADUACIÓN */}
                {activeTab === 'graduacion' && (
                  <div className="p-4">
                    {graduationCalculations.notaLicenciatura || graduationCalculations.notaTitulo ? (
                      <>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          🎓 Notas de Graduación
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* Examen */}
                          {graduationCalculations.notaExamenGrado && (
                            <div className={`p-4 rounded-lg ${
                              darkMode ? 'bg-gray-700' : 'bg-blue-50 shadow-sm'
                            }`}>
                              <div className="text-xs font-semibold opacity-70 mb-2">Examen de Grado</div>
                              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {formatDecimal(graduationCalculations.notaExamenGrado)}
                              </div>
                              <div className="text-xs opacity-60 mt-2">25% de Nota Licenciatura</div>
                            </div>
                          )}

                          {/* Licenciatura */}
                          {graduationCalculations.notaLicenciatura && (
                            <div className={`p-4 rounded-lg ${
                              darkMode ? 'bg-indigo-900/40' : 'bg-indigo-50 shadow-sm'
                            }`}>
                              <div className="text-xs font-semibold opacity-70 mb-2">Nota de Licenciatura</div>
                              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                                {formatDecimal2(graduationCalculations.notaLicenciatura)}
                              </div>
                              <div className="text-xs opacity-60 mt-2">
                                75% PPA + 25% Examen
                              </div>
                            </div>
                          )}

                          {/* Título */}
                          {graduationCalculations.notaTitulo && (
                            <div className={`p-4 rounded-lg ${
                              darkMode ? 'bg-purple-900/40' : 'bg-purple-50 shadow-sm'
                            }`}>
                              <div className="text-xs font-semibold opacity-70 mb-2">Nota de Título</div>
                              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                {formatDecimal2(graduationCalculations.notaTitulo)}
                              </div>
                              <div className="text-xs opacity-60 mt-2">
                                80% Lic. + 20% PPA Título
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Fórmulas - Recuadros individuales */}
                        <div className="space-y-3">
                          {/* Fórmula Licenciatura */}
                          {graduationCalculations.notaLicenciatura && (
                            <div className={`p-3 rounded-lg text-xs ${
                              darkMode ? 'bg-indigo-900/30 border border-indigo-700' : 'bg-indigo-50 border border-indigo-200'
                            }`}>
                              <div className="flex items-start gap-2">
                                <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 text-indigo-600 dark:text-indigo-400" />
                                <div className="flex-1">
                                  <div className="font-semibold mb-1">📐 Nota de Licenciatura:</div>
                                  <div className="opacity-80">
                                    (0,75 × {formatDecimal2(graduationCalculations.ppaLicenciatura)}) + (0,25 × {formatDecimal(graduationCalculations.notaExamenGrado!)}) = <strong>{formatDecimal2(graduationCalculations.notaLicenciatura)}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Fórmula Título */}
                          {graduationCalculations.notaTitulo && (
                            <div className={`p-3 rounded-lg text-xs ${
                              darkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'
                            }`}>
                              <div className="flex items-start gap-2">
                                <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 text-purple-600 dark:text-purple-400" />
                                <div className="flex-1">
                                  <div className="font-semibold mb-1">📐 Nota de Título:</div>
                                  <div className="opacity-80">
                                    (0,8 × {formatDecimal2(graduationCalculations.notaLicenciatura!)}) + (0,2 × {formatDecimal2(graduationCalculations.ppaTitulo!)}) = <strong>{formatDecimal2(graduationCalculations.notaTitulo)}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Info ramos FT */}
                          {graduationCalculations.ramosTituloCount > 0 && (
                            <div className={`p-3 rounded-lg text-xs ${
                              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex items-start gap-2">
                                <span className="text-sm">ℹ️</span>
                                <div className="flex-1 opacity-70">
                                  Se detectaron {graduationCalculations.ramosTituloCount} ramo(s) de fase título (categoría FT).
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-4">🎓</div>
                        <h3 className="text-xl font-bold mb-2">Sin datos de graduación</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ingresa tu nota del Examen de Grado para calcular tu Nota de Licenciatura y Título.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: DETALLE */}
                {activeTab === 'detalle' && (
                  <div className="p-4">
                    {gradedCourses.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2">Sin ramos calificados</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ingresa notas en tu malla para ver el detalle aquí.
                        </p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold mb-4">📝 Detalle por Semestre</h3>
                        <div className="space-y-4">
                          {coursesBySemester.map(([semester, courses]) => (
                            <div key={semester}>
                              <div className={`px-3 py-2 rounded-t-lg font-semibold text-sm ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                {semester.replace('s', 'Semestre ')} ({courses.reduce((sum, c) => sum + c.credits, 0)} UC cursados)
                              </div>
                              <div className={`rounded-b-lg overflow-hidden ${
                                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
                              }`}>
                                {courses.map((course, idx) => (
                                  <div
                                    key={`${course.subject.code}-${course.attemptNumber || idx}`}
                                    className={`p-3 ${
                                      idx !== courses.length - 1 ? 'border-b ' + (darkMode ? 'border-gray-700' : 'border-gray-100') : ''
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate flex items-center gap-2 flex-wrap">
                                          <span>{course.subject.code} - {course.subject.name}</span>
                                          {/* ⭐ NUEVO: Badge de intento */}
                                          {course.attemptNumber && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                              course.attemptNumber === course.totalAttempts
                                                ? course.status === 'approved'
                                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            }`}>
                                              {course.attemptNumber === 1 && course.totalAttempts! > 1 
                                                ? '1er intento' 
                                                : `${course.attemptNumber}° intento`
                                              }
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs opacity-70 mt-1">
                                          {course.credits} UC × {formatDecimal(course.grade)} = {formatDecimal(course.grade * course.credits)} pts
                                        </div>
                                      </div>
                                      <div className={`text-xl font-bold flex-shrink-0 ${
                                        course.status === 'approved' 
                                          ? 'text-green-600 dark:text-green-400' 
                                          : 'text-red-600 dark:text-red-400'
                                      }`}>
                                        {formatDecimal(course.grade)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex-shrink-0 ${
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