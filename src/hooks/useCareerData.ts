import { useState, useEffect } from 'react';
import { Subject, SubjectColors } from '@/types/curriculum';
import { careersByCampus, getCareer } from '@/data/carreras';
import { logger } from '@/utils/logger';

interface Career {
  Nombre: string;
  Link: string;
  Color?: string;
}

type Campus = 'all' | 'cc' | 'vm' | 'sj' | 'vc' | 'cp';

export const useCareerData = (campus: Campus | undefined, careerCode: string | undefined) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [colors, setColors] = useState<SubjectColors>({});
  const [careerName, setCareerName] = useState<string>('');
  const [careerColor, setCareerColor] = useState<string | undefined>(undefined);

  const [todasCareers, settodasCareers] = useState<Career[]>([]);

  const [showCareerSelector, setShowCareerSelector] = useState(false);

  // Cargar carreras disponibles
  useEffect(() => {
    settodasCareers(careersByCampus.all);
  }, []);

  // Cargar datos de la carrera específica
  useEffect(() => {
    if (!campus || !careerCode) {
      // NO forzar el selector aquí, dejamos que el componente lo maneje
      setSubjects([]);
      setColors({});
      setCareerName('');
      setCareerColor(undefined);
      return;
    }

    try {
      const carrera = getCareer(careerCode);

      if (!carrera) {
        logger.error(`Carrera no encontrada: ${careerCode}`);
        setShowCareerSelector(true);
        return;
      }

      // Remover "(Malla Antigua)" del nombre si existe
      const cleanName = carrera.nombre.replaceAll(/\s*\(Malla Antigua\)\s*/gi, '').trim();
      setCareerName(cleanName);
      setCareerColor(carrera.color);

      // Usar asignaturas directamente
      setSubjects(carrera.asignaturas);

      // Transformar categorías al formato esperado
      const processedColors: SubjectColors = {};
      for (const categoria of carrera.categorias) {
        processedColors[categoria.id] = [categoria.color, categoria.nombre];
      }
      setColors(processedColors);
      setShowCareerSelector(false);
    } catch (error) {
      logger.error('Error loading career data:', error);
      setShowCareerSelector(true);
      setSubjects([]);
      setColors({});
      setCareerName('');
      setCareerColor(undefined);
    }
  }, [campus, careerCode]);

  const handleBackToCareerSelector = () => {
    setShowCareerSelector(true);
  };

  const findSubjectByCode = (code: string): Subject | undefined => {
    return subjects.find(subject => subject.code === code);
  };

  return {
    subjects,
    colors,
    careerName,
    careerColor,
    todasCareers,
    showCareerSelector,
    handleBackToCareerSelector,
    findSubjectByCode
  };
};
