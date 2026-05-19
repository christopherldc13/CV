import React, { useRef, useState } from 'react';
import type { Language } from '../i18n/translations';

interface Props {
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  language: Language;
}

export const ExportButton: React.FC<Props> = ({ onExportJSON, onImportJSON, language }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [printing, setPrinting] = useState(false);
  const isEs = language === 'es';

  const handleExportPDF = () => {
    setPrinting(true);
    // Small delay so the spinner renders before the print dialog blocks the thread
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Exportar' : 'Export'}
      </p>

      <button
        onClick={handleExportPDF}
        disabled={printing}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow"
      >
        {printing ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {isEs ? 'Preparando...' : 'Preparing...'}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isEs ? 'Descargar PDF' : 'Download PDF'}
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onExportJSON}
          className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-xs font-medium transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isEs ? 'Guardar' : 'Save JSON'}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-xs font-medium transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {isEs ? 'Cargar' : 'Load JSON'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
