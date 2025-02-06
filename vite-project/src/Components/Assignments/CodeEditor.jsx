import React from 'react';

export function CodeEditor({ 
  selectedLanguage, 
  setSelectedLanguage, 
  code, 
  onCodeChange, 
  onRunCode, 
  codeOutput, 
  isExecuting,
  supportedLanguages 
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-1.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.icon} {lang.name}
            </option>
          ))}
        </select>
        <button
          className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          onClick={() => onRunCode(code, selectedLanguage)}
          disabled={isExecuting || !code}
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </button>
      </div>
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm text-gray-400">
            {supportedLanguages.find(l => l.id === selectedLanguage)?.name} Editor
          </span>
          <div className="flex space-x-2">
            <button
              className="p-1 hover:bg-gray-700 rounded"
              title="Copy Code"
              onClick={() => navigator.clipboard.writeText(code || '')}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full h-48 bg-transparent text-gray-300 font-mono text-sm focus:outline-none resize-none"
            placeholder={`Write your ${supportedLanguages.find(l => l.id === selectedLanguage)?.name} code here...`}
            spellCheck="false"
          />
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm font-medium text-gray-400 mb-1">Output:</div>
        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm min-h-[60px]">
          {isExecuting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              <span>Executing code...</span>
            </div>
          ) : codeOutput ? (
            <pre className="whitespace-pre-wrap">{codeOutput}</pre>
          ) : (
            <span className="text-gray-500">Code output will appear here...</span>
          )}
        </div>
      </div>
    </div>
  );
} 