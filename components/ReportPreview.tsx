
import React from 'react';
import { ReportData, GeneratedContent } from '../types';
import { exportReportAsPdf } from '../services/pdfService';

interface ReportPreviewProps {
  data: ReportData;
  content: GeneratedContent;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ data, content }) => {
  const handleDownloadPdf = () => {
    exportReportAsPdf('report-content');
  };

  const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="border border-black p-2 flex-1">
      <div className="text-xs font-bold">{label}</div>
      <div className="text-sm mt-1">{children || <>&nbsp;</>}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6 flex justify-center items-center gap-4">
        <button
          onClick={handleDownloadPdf}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          Descargar PDF
        </button>
      </div>

      <div id="report-content" className="bg-white p-8 md:p-12 border shadow-lg text-black">
        <header className="flex justify-between items-start mb-8">
          <img src="https://www.uabc.mx/presencia/escudo/escudo-uabc-2021-color-s-fondo.png" alt="Logo UABC" className="h-24" />
          <div className="text-center">
            <h2 className="font-bold text-lg">Universidad Autónoma de Baja California</h2>
            <h3 className="text-md">Facultad de Contaduría y Administración</h3>
            <h4 className="text-md">Coordinación de la Licenciatura en Inteligencia de Negocios</h4>
            <p className="font-bold text-lg mt-4">Informe de Actividades y Cumplimiento de Competencias</p>
          </div>
          <img src="https://i.ibb.co/tZQ1rDq/logo-fca.png" alt="Logo FCA" className="h-24 object-contain" />
        </header>

        <section className="mb-4">
          <div className="flex flex-row border border-black">
            <Field label="Clave Materia:">{data.claveMateria}</Field>
            <Field label="Nombre Materia:">{data.nombreMateria}</Field>
            <Field label="Grupo:">{data.grupo}</Field>
            <Field label="Periodo:">{data.periodo}</Field>
          </div>
          <div className="flex flex-row border border-black border-t-0">
            <Field label="No. Empleado:">{data.noEmpleado}</Field>
            <Field label="Nombre Docente:">{data.nombreDocente}</Field>
          </div>
        </section>

        <section className="mb-4">
          <h5 className="bg-black text-white p-2 font-bold text-sm">Competencia del Curso:</h5>
          <div className="border border-black border-t-0 p-4 h-48 whitespace-pre-wrap text-sm">
            {content.competenciaDelCurso}
          </div>
        </section>
        
        <section className="mb-12">
          <h5 className="bg-black text-white p-2 font-bold text-sm">Informe de actividades realizadas para el cumplimiento de la competencia:</h5>
          <div className="border border-black border-t-0 p-4 h-72 whitespace-pre-wrap text-sm">
            {content.informeDeActividades}
          </div>
        </section>

        <footer className="text-center pt-16">
          <div className="inline-block border-t border-black w-72 pt-2">
            Firma y Fecha
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReportPreview;
