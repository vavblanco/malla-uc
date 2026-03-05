'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBookOpen, faCheckCircle, faLightbulb, faCoins, faExclamationTriangle, faGraduationCap, faClock, faCalendarAlt, faRoute, faStar, faFileAlt, faBan, faLock, faSave, faSync, faBullseye, faTrash, faExclamationCircle, faUserTie, faChartLine, faHourglassHalf, faGripVertical, faCalculator, faMapSigns, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface GuideModalProps {
  show: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function GuideModal({ show, onClose, darkMode }: GuideModalProps) {
  const [selectedTab, setSelectedTab] = useState<'usage' | 'planning' | 'credits'>('usage');

  const tabs = [
    { id: 'usage', label: 'Usar Malla', icon: faBookOpen },
    { id: 'planning', label: 'Tomar Ramos', icon: faGraduationCap },
    { id: 'credits', label: 'Créditos', icon: faCoins },
  ] as const;

    const selectedIndex = tabs.findIndex(tab => tab.id === selectedTab);

return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 flex items-center justify-center p-2 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-600 max-w-4xl w-full max-h-[95vh] md:max-h-[85vh] overflow-hidden flex flex-col ${darkMode ? 'dark' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600/80 to-blue-600/80 text-white p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faBookOpen} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Guía Malla FCB PUC</h3>
                    <p className="text-sm text-white/80">Todo lo que necesitas saber</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="group/close text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 aspect-square min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Cerrar"
                >
                  <FontAwesomeIcon icon={faTimes} className="transition-transform duration-150 group-hover/close:scale-125" />
                </button>
              </div>
            </div>

           {/* Content con scroll */}
            <div className={`overflow-y-auto flex-1 pb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              
             {/* Toggle de pestañas - Sticky con gradiente */}
              <div 
                className={`sticky top-0 z-10 px-6 pt-6 pb-8 pointer-events-none ${
                  darkMode 
                    ? 'bg-gradient-to-b from-gray-800 via-gray-800/70 to-gray-800/0' 
                    : 'bg-gradient-to-b from-white via-white/80 to-white/0'
                }`}
              >
                <div className="flex items-center justify-center pointer-events-auto">
                  <div 
                    className={`relative grid grid-cols-3 gap-0 rounded-full p-1 backdrop-blur-md ${
                      darkMode ? 'bg-gray-700/70' : 'bg-gray-100/70'
                    }`}
                  >
                    {/* Indicador deslizante - Sin animación, solo transición CSS */}
                    <div
                      className={`absolute rounded-full shadow-md transition-all duration-300 ease-in-out ${
                        selectedTab === 'usage'
                          ? 'bg-green-600'
                          : selectedTab === 'planning'
                          ? 'bg-blue-600'
                          : 'bg-purple-600'
                      }`}
                      style={{
                        width: 'calc(33.333% - 2.67px)',
                        height: 'calc(100% - 8px)',
                        top: '4px',
                        left: selectedTab === 'usage' 
                          ? '4px' 
                          : selectedTab === 'planning' 
                          ? 'calc(33.333% + 2.67px)' 
                          : 'calc(66.666% + 1.33px)',
                      }}
                    />
                    
                    {/* Pestañas */}
                    {tabs.map((tab) => (
                      <div
                        key={tab.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedTab(tab.id)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedTab(tab.id)}
                        className={`relative z-10 px-3 md:px-5 py-2 text-sm font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
                          selectedTab === tab.id
                            ? 'text-white' 
                            : darkMode
                              ? 'text-gray-400'
                              : 'text-gray-600'
                        }`}
                      >
                        <FontAwesomeIcon icon={tab.icon} className="text-sm" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {/* Contenido: Usar la Malla */}
              {selectedTab === 'usage' && (
                <div className={`px-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {/* Sección: Estados de asignaturas */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      Estados de Asignaturas
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} border-2 ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faClock} className="text-white text-lg" />
                          </div>
                          <div>
                            <h5 className="font-bold text-base mb-1">Pendiente</h5>
                            <p className="text-xs opacity-70">Estado inicial de asignaturas no cursadas</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-green-50'} border-2 ${darkMode ? 'border-green-800' : 'border-green-200'}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-lg" />
                          </div>
                          <div>
                            <h5 className="font-bold text-base mb-1">Aprobado</h5>
                            <p className="text-xs opacity-70">Asignatura completada exitosamente</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-red-50'} border-2 ${darkMode ? 'border-red-800' : 'border-red-200'}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faBan} className="text-white text-lg" />
                          </div>
                          <div>
                            <h5 className="font-bold text-base mb-1">Reprobado</h5>
                            <p className="text-xs opacity-70">Asignatura no aprobada, debe cursarse nuevamente</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Indicadores Visuales */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapSigns} className="text-blue-500" />
                      Indicadores Visuales
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-purple-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg">🔀</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">Grupos Electivos</h5>
                            <p className="text-xs opacity-80 mb-2">
                              Ramos con borde morado y símbolo 🔀 indican que debes <strong>elegir uno</strong> del grupo.
                            </p>
                            <p className="text-xs opacity-70">
                              Al aprobar uno, los demás se marcan como no necesarios.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-indigo-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-base font-bold">A</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">Tracks Electivos</h5>
                            <p className="text-xs opacity-80 mb-2">
                              Letra (A, B, C) indica opciones <strong>mutuamente excluyentes</strong> completas.
                            </p>
                            <p className="text-xs opacity-70">
                              Ej: Certificado vs Práctica vs Optativos en Semestre 9.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-orange-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg">🔗</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">Correquisitos</h5>
                            <p className="text-xs opacity-80 mb-2">
                              Borde punteado naranja indica que debe cursarse <strong>junto con</strong> otro ramo.
                            </p>
                            <p className="text-xs opacity-70">
                              Ej: Química General I y Laboratorio de Química General.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-yellow-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg">🏆</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">Requisitos de Créditos</h5>
                            <p className="text-xs opacity-80 mb-2">
                              Trofeo indica que necesitas <strong>cierta cantidad de créditos</strong> aprobados antes.
                            </p>
                            <p className="text-xs opacity-70">
                              Ej: 120 UC para tomar Práctica Profesional.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sección: Funciones */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faGripVertical} className="text-teal-500" />
                      Funciones Principales
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-teal-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faChartLine} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Plan de Graduación</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Visualiza cuántos semestres te quedan y organiza tu avance. Puedes arrastrar ramos entre semestres para reorganizar.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faCalculator} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Calculadora de Créditos</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Muestra tu avance en créditos UC y asignaturas. Se actualiza automáticamente al marcar ramos.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-green-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faSave} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Guardado Automático</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Tu progreso se guarda automáticamente en el navegador. No perderás tu avance al cerrar la página.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-purple-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faTrash} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Reiniciar Progreso</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Usa el botón de reinicio en la calculadora para borrar todo tu progreso y empezar de nuevo.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* Contenido: Tomar Ramos */}
              {selectedTab === 'planning' && (
                <div className={`px-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  
                  {/* Sección: Límites de Créditos */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500" />
                      Límites de Créditos por Semestre
                    </h4>

                      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-red-50'} border-2 ${darkMode ? 'border-red-800' : 'border-red-300'} mb-4`}>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-xl font-bold">60</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-3">Límite Máximo</h5>
                            <p className="text-sm opacity-90 mb-3">
                              El máximo absoluto es <strong>60 créditos UC</strong> por semestre.
                            </p>
                            <p className="text-xs opacity-70">
                              Usualmente, las mallas de la FCB suelen tener entre 50-55 créditos por semestre.
                            </p>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Sección: OFG */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faRoute} className="text-blue-500" />
                      Optativos de Formación General (OFG)
                    </h4>
                    
                    <div className={`p-5 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border-2 ${darkMode ? 'border-blue-700' : 'border-blue-300'} mb-4`}>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <FontAwesomeIcon icon={faMapSigns} className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg mb-3">El Orden es Flexible</h5>
                          <p className="text-sm opacity-90 mb-3">
                            <strong>Importante:</strong> El orden mostrado en la malla para los OFG es solo <strong>referencial</strong>.
                          </p>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'} mb-3`}>
                            <p className="text-sm font-semibold mb-2">Puedes tomar los OFG cuando quieras, siempre que:</p>
                            <ul className="text-sm space-y-1 opacity-90">
                              <li>✓ Cumplas los <strong>requisitos de cada área</strong> especificados en la malla</li>
                              <li>✓ Completes las <strong>8 áreas obligatorias</strong>: Filosofía, Teología, Salud y Bienestar, Artes, Humanidades, Ciencias Sociales, Ecología y Créditos Libres</li>
                              <li>✓ No excedas el límite de créditos del semestre</li>
                            </ul>
                          </div>
                          <p className="text-xs opacity-70">
                            Por ejemplo: Puedes tomar un OFG de Salud y Bienestar en semestre 3 aunque la malla lo muestre en semestre 5, o viceversa.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-white text-lg">4</span>
                          </div>
                          <h5 className="font-bold text-base">Áreas Obligatorias</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Debes completar <strong>un OFG de cada área</strong>: Teología, Salud y Bienestar, Artes, Humanidades, Ciencias Sociales, Ecología y Créditos Libres.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-green-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Disponibilidad Variable</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          No todos los OFG se ofrecen cada semestre. Revisa la oferta académica disponible.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Estrategias */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
                      Estrategias de Planificación
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-green-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg font-bold">1</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">
                              Prioriza Prerrequisitos
                            </h5>
                            <p className="text-sm opacity-90 mb-2">
                              Enfócate primero en ramos que son prerequisitos de muchos otros.
                            </p>
                            <p className="text-xs opacity-70">
                              Esto evita bloqueos en tu avance futuro.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg font-bold">2</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">
                              Balancea Dificultad
                            </h5>
                            <p className="text-sm opacity-90 mb-2">
                              Mezcla ramos difíciles con otros más llevaderos.
                            </p>
                            <ul className="text-xs space-y-1 opacity-80">
                              <li>• Evita muchos proyectos grandes juntos</li>
                              <li>• Considera laboratorios y trabajos grupales</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-purple-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg font-bold">3</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">
                              Aprovecha los OFG
                            </h5>
                            <p className="text-sm opacity-90 mb-2">
                              Usa los OFG para balancear semestres pesados.
                            </p>
                            <p className="text-xs opacity-70">
                              Son generalmente más livianos que los ramos de especialidad.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-orange-500`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-lg font-bold">4</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-base mb-2">
                              Consulta con Dirección de Pregrado
                            </h5>
                            <p className="text-sm opacity-90 mb-2">
                              Si tienes dudas o te atrasas, pide orientación.
                            </p>
                            <p className="text-xs opacity-70">
                              Ellos pueden ayudarte a reorganizar tu plan de estudios.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sección: Consejos Importantes */}
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                      Consejos Importantes
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-red-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Disponibilidad de Ramos</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          La disponibilidad de asignaturas puede variar cada semestre. Planifica con anticipación.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faLock} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Cadenas de Prerrequisitos</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Identifica asignaturas que bloquean muchas otras y priorízalas para mantener tu avance.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-green-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faSync} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Ajusta tu Plan</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          Si repruebas una asignatura, reorganiza tu plan considerando que deberás retomarla.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-purple-500`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <FontAwesomeIcon icon={faUserTie} className="text-white" />
                          </div>
                          <h5 className="font-bold text-base">Contacta Consejería</h5>
                        </div>
                        <p className="text-xs opacity-80">
                          La Consejería Académica de FCB puede ayudarte con tu planificación y dudas académicas.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* Contenido: Créditos */}
              {selectedTab === 'credits' && (
                <div className={`px-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  
                  {/* Sección: Equivalencia */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalculator} className="text-purple-500" />
                      Equivalencia de Créditos
                    </h4>
                    
                    <div className={`p-5 rounded-xl ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} border-2 ${darkMode ? 'border-purple-700' : 'border-purple-300'} mb-4`}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FontAwesomeIcon icon={faCoins} className="text-white text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-xl mb-3">Sistema de Conversión UC ↔ SCT</h5>
                          <div className={`grid md:grid-cols-2 gap-4 mb-4`}>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'}`}>
                              <div className="text-center mb-2">
                                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</span>
                                <span className="text-sm ml-2 opacity-70">SCT</span>
                              </div>
                              <div className="text-center text-2xl mb-2">=</div>
                              <div className="text-center">
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">3</span>
                                <span className="text-sm ml-2 opacity-70">UC</span>
                              </div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'}`}>
                              <h6 className="font-bold mb-2 text-sm">Fórmula:</h6>
                              <code className="text-xs font-mono bg-gray-800 text-green-400 px-2 py-1 rounded block mb-1">
                                UC = SCT × (5 / 3)
                              </code>
                              <code className="text-xs font-mono bg-gray-800 text-green-400 px-2 py-1 rounded block">
                                SCT = UC × (3 / 5)
                              </code>
                            </div>
                          </div>
                          <p className="text-sm opacity-80">
                            El sistema oficial de la UC es <strong>créditos UC</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} border-2 ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                            <span className="text-white text-xl font-bold">UC</span>
                          </div>
                          <div>
                            <h5 className="font-bold text-base mb-1">Créditos UC</h5>
                            <p className="text-xs opacity-70">Sistema oficial de la Pontificia Universidad Católica</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-purple-50'} border-2 ${darkMode ? 'border-purple-800' : 'border-purple-200'}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                            <span className="text-white text-xl font-bold">SCT</span>
                          </div>
                          <div>
                            <h5 className="font-bold text-base mb-1">SCT Chile</h5>
                            <p className="text-xs opacity-70">Sistema de Créditos Transferibles de Chile</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-green-50'} border-2 ${darkMode ? 'border-green-800' : 'border-green-200'}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                            <FontAwesomeIcon icon={faSync} className="text-white text-xl" />
                          </div>
                          <div>
                            <h5 className="font-bold text-base mb-1">Conversión Automática</h5>
                            <p className="text-xs opacity-70">La malla convierte automáticamente entre ambos sistemas</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Ejemplos */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
                      Ejemplos de Conversión
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                        <h5 className="font-bold text-base mb-3">Ramo Típico</h5>
                        <div className="space-y-2">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold">6 SCT</span>
                              <span className="text-xs opacity-70">→</span>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">10 UC</span>
                            </div>
                          </div>
                          <p className="text-xs opacity-70">
                            Cálculo: 6 × (5/3) = 10 UC
                          </p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-purple-500`}>
                        <h5 className="font-bold text-base mb-3">Ramo Pesado</h5>
                        <div className="space-y-2">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold">18 SCT</span>
                              <span className="text-xs opacity-70">→</span>
                              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">30 UC</span>
                            </div>
                          </div>
                          <p className="text-xs opacity-70">
                            Cálculo: 18 × (5/3) = 9 UC
                          </p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-green-500`}>
                        <h5 className="font-bold text-base mb-3">Ramo Ligero</h5>
                        <div className="space-y-2">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold">3 SCT</span>
                              <span className="text-xs opacity-70">→</span>
                              <span className="text-sm font-bold text-green-600 dark:text-green-400">5 UC</span>
                            </div>
                          </div>
                          <p className="text-xs opacity-70">
                            Cálculo: 3 × (5/3) = 5 UC
                          </p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-l-4 border-orange-500`}>
                        <h5 className="font-bold text-base mb-3">Semestre Completo</h5>
                        <div className="space-y-2">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold">30 SCT</span>
                              <span className="text-xs opacity-70">→</span>
                              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">50 UC</span>
                            </div>
                          </div>
                          <p className="text-xs opacity-70">
                            Cálculo: 30 × (5/3) = 50 UC
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sección: Totales de Carrera */}
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                      Totales para Graduación
                    </h4>
                    
                    <div className={`p-5 rounded-xl ${darkMode ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20' : 'bg-gradient-to-br from-yellow-50 to-orange-50'} border-2 ${darkMode ? 'border-yellow-700' : 'border-yellow-300'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-xl mb-3">Créditos Totales de la Carrera</h5>
                          <p className="text-sm opacity-90 mb-4">
                            Los totales varían según tu carrera en la Facultad de Ciencias Biológicas:
                          </p>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'} text-center`}>
                              <p className="text-xs opacity-70 mb-1">Biología</p>
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">~510 UC</p>
                            </div>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'} text-center`}>
                              <p className="text-xs opacity-70 mb-1">Biología Marina</p>
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">~505  UC</p>
                            </div>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'} text-center`}>
                              <p className="text-xs opacity-70 mb-1">Bioquímica</p>
                              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">~520 UC</p>
                            </div>
                          </div>
                          <p className="text-xs opacity-70 mt-3">
                            Los valores exactos pueden variar según la malla curricular de cada carrera y año de ingreso.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* ⭐ NUEVO: Disclaimer importante */}
            <div className={`mt-4 mx-4 mb-4 p-4 rounded-xl border-2 ${
              darkMode 
                ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200' 
                : 'bg-yellow-50 border-yellow-300 text-yellow-900'
            }`}>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon 
                  icon={faExclamationCircle} 
                  className="text-yellow-600 dark:text-yellow-400 text-xl mt-0.5 flex-shrink-0" 
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-2">
                    📌 Herramienta de Apoyo
                  </h4>
                  <p className="text-xs leading-relaxed mb-2">
                    Esta es una <strong>herramienta de apoyo estudiantil</strong>, no reemplaza la malla curricular oficial. 
                    Las mallas oficiales están publicadas en la página de Registros Académicos para cada periodo de admisión.
                  </p>
                  <a
                    href="https://registrosacademicos.uc.cl/informacion-para-estudiantes/mallas-curriculares/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-xs font-semibold mt-2 px-3 py-2 rounded-lg transition-colors ${
                      darkMode
                        ? 'bg-yellow-700/30 hover:bg-yellow-700/50 text-yellow-200'
                        : 'bg-yellow-200 hover:bg-yellow-300 text-yellow-900'
                    }`}
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
                    Ver Mallas Oficiales UC
                    <span className="text-xs opacity-50">↗</span>
                  </a>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}