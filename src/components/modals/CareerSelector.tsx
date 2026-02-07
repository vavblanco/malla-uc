import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

interface Career {
  Nombre: string;
  Link: string;
  Color?: string;
}

interface CareerSelectorProps {
  show: boolean;
  todasCareers: Career[];
  darkMode: boolean;
  onCareerSelect: (campus: string, careerCode: string) => void;
  onClose: () => void;
  canClose?: boolean;
  campus?: string;
  careerCode?: string;
}

export default function CareerSelector({
  show,
  todasCareers,
  darkMode,
  onCareerSelect,
  onClose,
  canClose = false,
  campus,
  careerCode
}: CareerSelectorProps) {
  const [selectedVersions, setSelectedVersions] = useState<Record<string, 'new' | 'old'>>({});
  
  if (!show) return null;

  const getCareerCode = (careerLink: string) => {
    const parts = careerLink.split('/');
    return parts.length > 1 ? parts[1] : parts[0];
  };

  // Verificar si una carrera tiene versión antigua disponible
  const hasOldVersion = (careerLink: string) => {
    return careerLink.endsWith('-0');
  };

  // Obtener el código base de la carrera (sin el -0)
  const getBaseCareerCode = (careerLink: string) => {
    return careerLink.replace('-0', '');
  };

  // Agrupar carreras que tienen versión antigua y nueva
  const groupCareers = (careers: Career[]) => {
    const grouped: Array<{ base: Career; old?: Career }> = [];
    const processed = new Set<string>();

    careers.forEach(career => {
      const baseCode = getBaseCareerCode(career.Link);
      
      if (processed.has(baseCode)) return;
      processed.add(baseCode);

      const oldVersion = careers.find(c => c.Link === `${baseCode}-0`);
      const newVersion = careers.find(c => c.Link === baseCode && !hasOldVersion(c.Link));

      if (newVersion && oldVersion) {
        grouped.push({ base: newVersion, old: oldVersion });
      } else {
        grouped.push({ base: career });
      }
    });

    return grouped;
  };

  const groupedtodasCareers = groupCareers(todasCareers);

  const totalResults = groupedtodasCareers.length;

  // Determinar fondo: blanco sólido si no hay carrera, translúcido si hay una activa
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 flex items-center justify-center p-2 md:p-4 pt-12 md:pt-24"
          onClick={() => canClose && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-600 max-w-5xl w-full max-h-[95vh] md:max-h-[85vh] overflow-hidden flex flex-col ${darkMode ? 'dark' : ''}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
        {/* Header con gradiente y botón cerrar */}
        <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white p-6 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-2xl">Selecciona tu Carrera</h2>
              <p className="text-sm text-white/80 mt-1">Elige la carrera para ver su malla curricular interactiva</p>
            </div>
            <button
              onClick={() => canClose && onClose()}
              className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 aspect-square min-w-[40px] min-h-[40px] flex items-center justify-center group/close ${
                canClose ? '' : 'opacity-40 cursor-not-allowed'
              }`}
              aria-label="Cerrar"
              tabIndex={canClose ? 0 : -1}
              disabled={!canClose}
            >
              <FontAwesomeIcon icon={faTimes} className="transition-transform duration-150 group-hover/close:scale-125" />
            </button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="overflow-y-auto max-h-[70vh] md:max-h-[60vh]">

          {/* Sección Carreras*/}
          {groupedtodasCareers.length > 0 && (
            <div className="mb-8 px-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600" />
                Facultad de Ciencias Biológicas
                <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({groupedtodasCareers.length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {groupedtodasCareers.map((group) => {
                  const baseCode = getBaseCareerCode(group.base.Link);
                  const currentVersion = selectedVersions[baseCode] || 'new';
                  const currentCareer = currentVersion === 'old' && group.old ? group.old : group.base;
                  
                  return (
                    <motion.button
                      key={baseCode}
                      onClick={() => onCareerSelect('vm', getCareerCode(currentCareer.Link))}
                      className={`backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 border-2 hover:shadow-lg hover:scale-105 text-left ${
                        darkMode ? 'border-gray-600' : 'border-white/50'
                      }`}
                      style={{ borderColor: currentCareer.Color || '#6B7280' }}
                      layout
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: currentCareer.Color || '#6B7280' }}
                        />
                        <div className="flex-1 min-w-0">
                          <motion.span 
                            key={currentVersion}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`text-sm font-medium block ${
                              darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}
                          >
                            {currentCareer.Nombre.replaceAll(/\s*\(Malla Antigua\)\s*/gi, '')}
                          </motion.span>
                        </div>
                        {group.old && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className={`relative flex items-center rounded-full p-1 gap-0 ${
                              darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                            }`}
                          >
                            <motion.div
                              layout
                              className={`absolute rounded-full shadow-sm transition-colors duration-300 ${
                                currentVersion === 'new'
                                  ? darkMode 
                                    ? 'bg-blue-600' 
                                    : 'bg-blue-500'
                                  : darkMode
                                    ? 'bg-amber-600' 
                                    : 'bg-amber-500'
                              }`}
                              style={{
                                left: currentVersion === 'new' ? '4px' : '50%',
                                right: currentVersion === 'new' ? '50%' : '4px',
                                top: '4px',
                                bottom: '4px',
                              }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedVersions(prev => ({ ...prev, [baseCode]: 'new' }))}
                              onKeyDown={(e) => e.key === 'Enter' && setSelectedVersions(prev => ({ ...prev, [baseCode]: 'new' }))}
                              className={`relative z-10 px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                                currentVersion === 'new'
                                  ? 'text-white' 
                                  : darkMode
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                              }`}
                            >
                              Nueva
                            </div>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedVersions(prev => ({ ...prev, [baseCode]: 'old' }))}
                              onKeyDown={(e) => e.key === 'Enter' && setSelectedVersions(prev => ({ ...prev, [baseCode]: 'old' }))}
                              className={`relative z-10 px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                                currentVersion === 'old'
                                  ? 'text-white'
                                  : darkMode
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                              }`}
                            >
                              Antigua
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
            </div>
          </div>
          )}

        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
