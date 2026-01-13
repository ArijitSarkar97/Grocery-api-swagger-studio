import React, { useState } from 'react';
import { ApiDocs } from './components/ApiDocs';
import { CodeViewer } from './components/CodeViewer';
import { LiveStore } from './components/LiveStore';
import { Schemas } from './components/Schemas';
import { ViewMode } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DOCS);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Swagger-style Dark Header */}
      <header className="bg-header text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-leaf text-2xl text-swagger-post"></i>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Grocery Store API</h1>
                  <p className="text-xs text-gray-400">v1.0.0 • OpenAPI 3.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-swagger-post text-white px-4 py-2 rounded font-semibold hover:bg-green-600 transition flex items-center gap-2">
                <i className="fas fa-lock"></i>
                <span className="text-sm">Authorize</span>
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1">
            {[
              { mode: ViewMode.DOCS, label: 'API Documentation', icon: 'book' },
              { mode: ViewMode.SCHEMA, label: 'Schemas', icon: 'database' },
              { mode: ViewMode.CODE, label: 'Backend Code', icon: 'code' },
              { mode: ViewMode.DEMO, label: 'Live Demo', icon: 'shopping-basket' },
            ].map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => setCurrentView(mode)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${currentView === mode
                    ? 'border-swagger-post text-swagger-post'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
              >
                <i className={`fas fa-${icon}`}></i>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen">
        {currentView === ViewMode.DOCS && <ApiDocs />}
        {currentView === ViewMode.CODE && <CodeViewer />}
        {currentView === ViewMode.DEMO && <LiveStore />}
        {currentView === ViewMode.SCHEMA && <Schemas />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p>Grocery Store API v1.0.0</p>
              <p className="text-xs text-gray-500 mt-1">Built with FastAPI and SQLAlchemy</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-swagger-post transition">Terms of Service</a>
              <a href="#" className="hover:text-swagger-post transition">Privacy Policy</a>
              <a href="#" className="hover:text-swagger-post transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
