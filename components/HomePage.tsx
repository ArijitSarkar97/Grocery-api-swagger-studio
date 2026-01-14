import React from 'react';
import { ViewMode } from '../types';
import { getBaseUrl } from '../config/api';

export const HomePage: React.FC<{ setView?: (view: ViewMode) => void }> = ({ setView }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                        <i className="fas fa-shopping-cart text-white text-3xl"></i>
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Grocery Store API
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A modern, full-stack grocery store management system with beautiful Swagger-style documentation and a production-ready FastAPI backend.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <i className="fas fa-check-circle mr-2"></i>
                            17 REST Endpoints
                        </span>
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            <i className="fas fa-shield-alt mr-2"></i>
                            JWT Authentication
                        </span>
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            <i className="fas fa-database mr-2"></i>
                            PostgreSQL Ready
                        </span>
                    </div>
                </div>

                {/* Main Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                    {/* Frontend Documentation Card */}
                    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4">
                                <i className="fas fa-book text-3xl"></i>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">API Documentation</h2>
                            <p className="text-green-100">Interactive Swagger-style UI</p>
                        </div>

                        <div className="p-8">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Try It Out Feature</p>
                                        <p className="text-sm text-gray-600">Test API endpoints directly in browser</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Live Store Demo</p>
                                        <p className="text-sm text-gray-600">Fully functional e-commerce simulation</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Schema Viewer</p>
                                        <p className="text-sm text-gray-600">Explore data models and structures</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#docs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.hash = 'docs';
                                }}
                                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <i className="fas fa-arrow-right mr-2"></i>
                                Explore Frontend Docs
                            </a>
                        </div>
                    </div>

                    {/* Backend API Card */}
                    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4">
                                <i className="fas fa-server text-3xl"></i>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Backend API</h2>
                            <p className="text-blue-100">FastAPI Swagger Docs</p>
                        </div>

                        <div className="p-8">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-blue-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Auto-generated Docs</p>
                                        <p className="text-sm text-gray-600">OpenAPI/Swagger specification</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-blue-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Interactive Testing</p>
                                        <p className="text-sm text-gray-600">Execute requests with real responses</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-blue-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Authentication Ready</p>
                                        <p className="text-sm text-gray-600">JWT token management built-in</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-blue-500 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Production Ready</p>
                                        <p className="text-sm text-gray-600">PostgreSQL, logging, error handling</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`${getBaseUrl()}/docs`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <i className="fas fa-external-link-alt mr-2"></i>
                                Open Backend API Docs
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <i className="fas fa-link text-blue-500"></i>
                            Quick Links
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <a
                                href={`${getBaseUrl()}/health`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <i className="fas fa-heartbeat text-green-500 text-xl"></i>
                                <div>
                                    <p className="font-semibold text-gray-800 group-hover:text-green-600">Health Check</p>
                                    <p className="text-sm text-gray-500">API Status</p>
                                </div>
                            </a>

                            <a
                                href={`${getBaseUrl()}/redoc`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <i className="fas fa-file-alt text-purple-500 text-xl"></i>
                                <div>
                                    <p className="font-semibold text-gray-800 group-hover:text-purple-600">ReDoc</p>
                                    <p className="text-sm text-gray-500">Alternative Docs</p>
                                </div>
                            </a>

                            <a
                                href="https://github.com/ArijitSarkar97/Grocery-api-swagger-studio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-50 transition-all group"
                            >
                                <i className="fab fa-github text-gray-800 text-xl"></i>
                                <div>
                                    <p className="font-semibold text-gray-800">GitHub Repo</p>
                                    <p className="text-sm text-gray-500">Source Code</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-gray-600">
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <span className="flex items-center gap-2">
                            <i className="fas fa-code text-blue-500"></i>
                            Built with FastAPI & React
                        </span>
                        <span className="flex items-center gap-2">
                            <i className="fas fa-heart text-red-500"></i>
                            Made by Arijit Sarkar
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Full-stack grocery store management system with production-ready backend
                    </p>
                </div>
            </div>
        </div>
    );
};
