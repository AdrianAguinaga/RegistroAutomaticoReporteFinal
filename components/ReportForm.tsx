
import React, { useState } from 'react';
import { ReportData } from '../types';
import Spinner from './Spinner';

interface ReportFormProps {
  onGenerate: (formData: ReportData, keyIdeas: string) => void;
  isLoading: boolean;
}

const coursesBySemester = {
    'PRIMER SEMESTRE': [
        { clave: '38970', nombre: 'Inglés I' },
        { clave: '38971', nombre: 'Desarrollo de Habilidades Socioemocionales' },
        { clave: '38972', nombre: 'Habilidades de Redacción y Comunicación' },
        { clave: '38973', nombre: 'Herramientas Digitales' },
        { clave: '38974', nombre: 'Introducción a la Administración' },
        { clave: '38975', nombre: 'Fundamentos de Economía' },
        { clave: '38976', nombre: 'Matemáticas' }
    ],
    'SEGUNDO SEMESTRE': [
        { clave: '38977', nombre: 'Inglés II' },
        { clave: '38978', nombre: 'Introducción a la Contabilidad' },
        { clave: '38979', nombre: 'Introducción a la Mercadotecnia' },
        { clave: '38980', nombre: 'Fundamentos del Turismo en los Negocios' },
        { clave: '38981', nombre: 'Estadística' },
        { clave: '38982', nombre: 'Introducción a la Inteligencia de Negocios' },
        { clave: '38983', nombre: 'Ética, Derechos Humanos y Responsabilidad Social' }
    ],
    'TERCER SEMESTRE': [
        { clave: '38984', nombre: 'Fundamentos de Metodología de la Investigación' },
        { clave: '39037', nombre: 'Lógica para los Negocios' },
        { clave: '39038', nombre: 'Análisis de Procesos y Datos de Negocios' },
        { clave: '39039', nombre: 'Programación' },
        { clave: '39040', nombre: 'Estadística Inferencial' },
        { clave: '39041', nombre: 'Sistemas de Información para Inteligencia de Negocios' },
        { clave: '39042', nombre: 'Fundamentos de Redes' }
    ],
    'CUARTO SEMESTRE': [
        { clave: '39043', nombre: 'Base de Datos' },
        { clave: '39044', nombre: 'Análisis de Infraestructura Tecnológica' },
        { clave: '39054', nombre: 'Mercadotecnia Digital para los Negocios' },
        { clave: '39047', nombre: 'Programación Estadística' },
        { clave: '38987', nombre: 'Matemáticas Financieras' },
        { clave: 'opt-4-1', nombre: 'Optativa' },
        { clave: 'opt-4-2', nombre: 'Optativa' }
    ],
    'QUINTO SEMESTRE': [
        { clave: '39048', nombre: 'Base de Datos Avanzada' },
        { clave: '39049', nombre: 'Programación para la Extracción de Datos' },
        { clave: '39050', nombre: 'Seguridad Informática' },
        { clave: '39051', nombre: 'Tecnologías Digitales para la Innovación' },
        { clave: '39053', nombre: 'Análisis Financiero' },
        { clave: '39058', nombre: 'Administración de Proyectos' }
    ],
    'SEXTO SEMESTRE': [
        { clave: '39055', nombre: 'Economía de la Innovación' },
        { clave: '39056', nombre: 'Big Data' },
        { clave: '39057', nombre: 'Gestión Tecnológica y Control Interno' },
        { clave: '39072', nombre: 'Estrategias de Innovación' },
        { clave: '39059', nombre: 'Modelo de Negocio e Innovación' },
        { clave: '39046', nombre: 'Costos y Presupuestos' },
        { clave: '39052', nombre: 'Metodologías y Herramientas para la Innovación' },
        { clave: 'opt-6-1', nombre: 'Optativa' }
    ],
    'SÉPTIMO SEMESTRE': [
        { clave: '39060', nombre: 'Ciencia de Datos' },
        { clave: '39061', nombre: 'Metodologías de Inteligencias de Negocios' },
        { clave: '39062', nombre: 'Patrones de Comportamientos de Datos' },
        { clave: '39063', nombre: 'Gestión de la Innovación' },
        { clave: '39064', nombre: 'Marco Legal de las TI e Innovación' },
        { clave: '39065', nombre: 'Gobierno de TI' },
        { clave: 'opt-7-1', nombre: 'Optativa' },
        { clave: 'opt-7-2', nombre: 'Optativa' }
    ],
    'OCTAVO SEMESTRE': [
        { clave: '39066', nombre: 'Inteligencia de Mercados' },
        { clave: '39067', nombre: 'Auditoria de TI e Innovación' },
        { clave: '39068', nombre: 'Formulación y Evaluación de Proyectos de Innovación' },
        { clave: 'opt-8-1', nombre: 'Optativa' },
        { clave: 'opt-8-2', nombre: 'Optativa' },
        { clave: 'opt-8-3', nombre: 'Optativa' },
        { clave: 'opt-8-4', nombre: 'Optativa' },
        { clave: 'opt-8-5', nombre: 'Optativa' }
    ],
    'MATERIAS OPTATIVAS - ETAPA DISCIPLINARIA': [
        { clave: '39069', nombre: 'Teoría de Juegos' },
        { clave: '39070', nombre: 'Matemáticas para los Negocios' },
        { clave: '39071', nombre: 'Matemáticas para el Análisis de Datos' },
        { clave: '39072', nombre: 'Estrategias de la Innovación' },
        { clave: '39073', nombre: 'Programación Funcional' },
        { clave: '39074', nombre: 'Ciberseguridad para Negocios' },
        { clave: '39075', nombre: 'Finanzas Empresariales' },
        { clave: '39076', nombre: 'Computación en la Nube' },
        { clave: '39077', nombre: 'Análisis de Negocios para la Innovación' },
        { clave: '39078', nombre: 'Sistemas Complejos' },
        { clave: '39079', nombre: 'Ciudades Inteligentes' }
    ],
    'MATERIAS OPTATIVAS - ETAPA TERMINAL': [
        { clave: '39080', nombre: 'Calidad e Implantación del Software' },
        { clave: '39081', nombre: 'Instrumentos de Inversión' },
        { clave: '39082', nombre: 'Comercialización de Tecnologías' },
        { clave: '39083', nombre: 'Machine Learning' },
        { clave: '39084', nombre: 'Entornos Virtuales para la Innovación en los Negocios' },
        { clave: '39085', nombre: 'Tecnologías para la Administración de Proyectos Ágiles' },
        { clave: '39086', nombre: 'Modelo Computacional' },
        { clave: '39087', nombre: 'Tópicos Emergentes de Infraestructura Tecnológica' },
        { clave: '39088', nombre: 'Tópicos Emergentes de Inteligencia de Negocios' },
        { clave: '39089', nombre: 'Tópicos Emergentes de Innovación' },
        { clave: '39090', nombre: 'Inteligencia Artificial' },
        { clave: '39091', nombre: 'Dirección y Alta Gerencia' },
        { clave: '39092', nombre: 'Transformación Digital' },
        { clave: '38192', nombre: 'Entorno de negocios en China' },
        { clave: '38193', nombre: 'Entorno multidimensional de China' }
    ]
};


const ReportForm: React.FC<ReportFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<ReportData>({
    claveMateria: '',
    nombreMateria: '',
    grupo: '',
    periodo: '',
    noEmpleado: '',
    nombreDocente: '',
  });
  const [keyIdeas, setKeyIdeas] = useState('');
  
  const commonInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-gray-400";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [clave, nombre] = e.target.value.split('|');
    setFormData(prev => ({ ...prev, claveMateria: clave, nombreMateria: nombre }));
  };

  const handleKeyIdeasChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeyIdeas(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData, keyIdeas);
  };
  
  const isFormIncomplete = !formData.claveMateria || !formData.grupo || !formData.periodo || !formData.noEmpleado || !formData.nombreDocente || !keyIdeas;


  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-slate-600 pb-3">Información del Curso y Docente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
              <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Materia y Clave</label>
              <select
                id="course-select"
                name="course-select"
                value={formData.claveMateria ? `${formData.claveMateria}|${formData.nombreMateria}` : ''}
                onChange={handleCourseChange}
                required
                className={commonInputClasses}
              >
                <option value="" disabled>Seleccione una materia</option>
                {Object.entries(coursesBySemester).map(([semester, courses]) => (
                  <optgroup label={semester} key={semester}>
                    {courses.map(course => (
                      <option key={course.clave} value={`${course.clave}|${course.nombre}`}>
                        {course.clave} - {course.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grupo</label>
              <input type="text" name="grupo" id="grupo" value={formData.grupo} onChange={handleInputChange} required className={commonInputClasses} />
            </div>
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periodo</label>
              <input type="text" name="periodo" id="periodo" value={formData.periodo} onChange={handleInputChange} required className={commonInputClasses} placeholder="Ej. 2024-2"/>
            </div>
            <div>
              <label htmlFor="noEmpleado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Empleado</label>
              <input type="text" name="noEmpleado" id="noEmpleado" value={formData.noEmpleado} onChange={handleInputChange} required className={commonInputClasses} />
            </div>
            <div>
              <label htmlFor="nombreDocente" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Docente</label>
              <input type="text" name="nombreDocente" id="nombreDocente" value={formData.nombreDocente} onChange={handleInputChange} required className={commonInputClasses} />
            </div>
          </div>

          <div>
            <label htmlFor="keyIdeas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ideas Clave para el Informe
            </label>
            <textarea
              id="keyIdeas"
              name="keyIdeas"
              rows={8}
              value={keyIdeas}
              onChange={handleKeyIdeasChange}
              required
              className={commonInputClasses}
              placeholder="Escriba aquí los puntos principales, temas, actividades o proyectos clave que se abordaron en el curso. Gemini usará esta información para redactar el informe."
            ></textarea>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Proporcione suficientes detalles para que la IA pueda generar un informe coherente y completo.</p>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 dark:border-slate-600">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || isFormIncomplete}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Generando Informe...' : 'Generar Informe con IA'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
