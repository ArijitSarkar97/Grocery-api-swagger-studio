import React, { useState } from 'react';
import { PYTHON_CODE_MAIN, PYTHON_CODE_MODELS, SCHEMA_SQL } from '../constants';

export const CodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'main' | 'models' | 'sql'>('main');

  const getCode = () => {
    switch (activeTab) {
      case 'main': return PYTHON_CODE_MAIN;
      case 'models': return PYTHON_CODE_MODELS;
      case 'sql': return SCHEMA_SQL;
      default: return '';
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Backend Implementation</h2>
        <p className="text-gray-600 mt-2">
          Generated source code for the FastAPI application and SQLite schema.
        </p>
      </div>

      <div className="flex border-b border-gray-300 mb-0">
        <button
          onClick={() => setActiveTab('main')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'main' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          main.py
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'models' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          models.py
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'sql' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          schema.sql
        </button>
      </div>

      <div className="bg-gray-900 rounded-b-lg p-6 overflow-auto flex-1 shadow-lg">
        <pre className="font-mono text-sm text-gray-300">
          <code>{getCode()}</code>
        </pre>
      </div>
    </div>
  );
};
