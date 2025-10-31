import React, { useState, useCallback, useEffect } from 'react';
import { ReportData, GeneratedContent } from './types';
import ReportForm from './components/ReportForm';
import ReportPreview from './components/ReportPreview';
import ThemeToggler from './components/ThemeToggler';
import { generateReportContent } from './services/geminiService';

const App: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleGenerateReport = useCallback(async (formData: ReportData, keyIdeas: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setReportData(formData);

    try {
      const content = await generateReportContent(formData, keyIdeas);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado. Por favor, intente de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setReportData(null);
    setGeneratedContent(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 shadow-md dark:border-b dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sky-800 dark:text-sky-400">Generador de Informes UABC</h1>
          <div className="flex items-center gap-4">
            {generatedContent && (
               <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Crear Nuevo Informe
                </button>
            )}
            <ThemeToggler theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {!generatedContent ? (
          <ReportForm onGenerate={handleGenerateReport} isLoading={isLoading} />
        ) : (
          <ReportPreview data={reportData!} content={generatedContent} />
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900/50 dark:border-red-500/50 dark:text-red-300" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;