import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { API_DEFINITIONS } from '../constants';
import { mockApi } from '../services/mockApi';
import { getBaseUrl } from '../config/api';

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const colors: Record<string, string> = {
    GET: 'bg-swagger-get text-white border-swagger-get',
    POST: 'bg-swagger-post text-white border-swagger-post',
    PUT: 'bg-swagger-put text-white border-swagger-put',
    PATCH: 'bg-swagger-patch text-white border-swagger-patch',
    DELETE: 'bg-swagger-delete text-white border-swagger-delete',
  };

  const borderColors: Record<string, string> = {
    GET: 'border-swagger-get/20',
    POST: 'border-swagger-post/20',
    PUT: 'border-swagger-put/20',
    PATCH: 'border-swagger-patch/20',
    DELETE: 'border-swagger-delete/20',
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-bold border-2 uppercase ${colors[method] || 'bg-gray-100'}`}>
      {method}
    </span>
  );
};

export const ApiDocs: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tryItOutMap, setTryItOutMap] = useState<Record<string, boolean>>({});
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleExpand = (path: string, method: string) => {
    const id = `${method}-${path}`;
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleTryItOut = (id: string) => {
    setTryItOutMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateParam = (endpointId: string, paramName: string, value: any) => {
    setParamValues(prev => ({
      ...prev,
      [endpointId]: { ...prev[endpointId], [paramName]: value }
    }));
  };

  const executeRequest = async (endpoint: ApiEndpoint) => {
    const id = `${endpoint.method}-${endpoint.path}`;
    setLoading(prev => ({ ...prev, [id]: true }));

    try {
      let result;
      const params = paramValues[id] || {};

      // Route to appropriate mock API method
      if (endpoint.path === '/products' && endpoint.method === 'GET') {
        result = await mockApi.getProducts();
      } else if (endpoint.path.includes('/products/{product_id}') && endpoint.method === 'GET') {
        result = await mockApi.getProduct(params.product_id || 1);
      } else if (endpoint.path.includes('/products/{product_id}') && endpoint.method === 'DELETE') {
        result = await mockApi.deleteProduct(params.product_id || 1);
      } else if (endpoint.path.includes('/products/{product_id}') && endpoint.method === 'PATCH') {
        result = await mockApi.patchProduct(params.product_id || 1, params.body || {});
      } else if (endpoint.path === '/orders' && endpoint.method === 'POST') {
        result = await mockApi.createOrder(params.body || []);
      } else if (endpoint.path.includes('/orders/{order_id}') && endpoint.method === 'DELETE') {
        result = await mockApi.deleteOrder(params.order_id || 1001);
      } else if (endpoint.path.includes('/orders/{order_id}/status') && endpoint.method === 'PATCH') {
        result = await mockApi.patchOrderStatus(params.order_id || 1001, params.status || 'completed');
      } else if (endpoint.path === '/customers' && endpoint.method === 'GET') {
        result = await mockApi.getCustomers();
      } else {
        result = endpoint.responseExample;
      }

      setResponses(prev => ({ ...prev, [id]: { status: 200, data: result } }));
    } catch (error: any) {
      setResponses(prev => ({ ...prev, [id]: { status: 400, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Group endpoints by tags
  const groupedEndpoints = API_DEFINITIONS.reduce((acc, endpoint) => {
    endpoint.tags.forEach(tag => {
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(endpoint);
    });
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  const getBorderColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'border-l-swagger-get',
      POST: 'border-l-swagger-post',
      PUT: 'border-l-swagger-put',
      PATCH: 'border-l-swagger-patch',
      DELETE: 'border-l-swagger-delete',
    };
    return colors[method] || 'border-l-gray-300';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Info */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Grocery Store API</h1>
        <p className="text-gray-600 mb-4">
          A comprehensive REST API for managing a grocery store with support for products, inventory, orders, and customers.
        </p>
        <div className="flex gap-6 text-sm items-center">
          <div>
            <span className="font-semibold text-gray-700">Version:</span>{' '}
            <span className="text-gray-600">1.0.0</span>
          </div>
          <div className="flex-1">
            <span className="font-semibold text-gray-700 mr-2">Base URL:</span>
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <i className="fas fa-server text-blue-500"></i>
              <code className="text-blue-700 font-mono font-semibold">{getBaseUrl()}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getBaseUrl());
                  alert('✓ Base URL copied!');
                }}
                className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                title="Copy base URL"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Endpoints */}
      {Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
        <div key={tag} className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{tag}</h2>
            <p className="text-gray-500 text-sm mt-1">Operations related to {tag.toLowerCase()}</p>
          </div>

          <div className="space-y-3">
            {endpoints.map((endpoint, idx) => {
              const id = `${endpoint.method}-${endpoint.path}`;
              const isExpanded = expandedId === id;
              const isTryingOut = tryItOutMap[id];
              const response = responses[id];
              const isLoading = loading[id];

              return (
                <div
                  key={idx}
                  className={`group bg-white border-l-4 ${getBorderColor(endpoint.method)} rounded overflow-hidden transition-all duration-200 ${isExpanded ? 'shadow-lg' : 'shadow hover:shadow-md'
                    }`}
                >
                  {/* Endpoint Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-gray-50"
                    onClick={() => toggleExpand(endpoint.path, endpoint.method)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <MethodBadge method={endpoint.method} />
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-700 font-semibold">{endpoint.path}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const fullUrl = `${getBaseUrl()}${endpoint.path}`;
                            navigator.clipboard.writeText(fullUrl);
                            alert(`✓ Copied: ${fullUrl}`);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                          title="Copy full URL"
                        >
                          <i className="fas fa-copy text-xs"></i>
                        </button>
                      </div>
                      <span className="text-gray-500 text-sm hidden md:block">{endpoint.summary}</span>
                    </div>
                    <div className="text-gray-400">
                      <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50">
                      {/* Try It Out Header */}
                      <div className="p-4 bg-white border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{endpoint.summary}</h3>
                        <button
                          onClick={() => toggleTryItOut(id)}
                          className="text-sm px-4 py-1.5 border rounded hover:bg-gray-100 transition"
                        >
                          {isTryingOut ? 'Cancel' : 'Try it out'}
                        </button>
                      </div>

                      <div className="p-6">
                        {/* Parameters Section */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3">Parameters</h4>
                          {endpoint.parameters && endpoint.parameters.length > 0 ? (
                            <div className="bg-white border rounded">
                              <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                  <tr className="text-xs text-gray-600">
                                    <th className="text-left p-3 font-semibold">Name</th>
                                    <th className="text-left p-3 font-semibold">Description</th>
                                    {isTryingOut && <th className="text-left p-3 font-semibold">Value</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param, pIdx) => (
                                    <tr key={pIdx} className="border-b last:border-0">
                                      <td className="p-3">
                                        <div className="font-mono text-sm font-semibold text-gray-800">
                                          {param.name}
                                          {param.required && <span className="text-red-500 ml-1">*</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{param.type}</span>
                                          <span className="mx-1">•</span>
                                          <span className="italic">{param.in}</span>
                                        </div>
                                      </td>
                                      <td className="p-3 text-sm text-gray-600">
                                        {param.name === 'body' ? 'Request body' : `${param.name} parameter`}
                                      </td>
                                      {isTryingOut && (
                                        <td className="p-3">
                                          {param.in === 'body' ? (
                                            <textarea
                                              className="w-full border rounded p-2 font-mono text-xs"
                                              rows={4}
                                              placeholder={JSON.stringify(endpoint.responseExample, null, 2)}
                                              onChange={(e) => {
                                                try {
                                                  updateParam(id, param.name, JSON.parse(e.target.value));
                                                } catch { }
                                              }}
                                            />
                                          ) : (
                                            <input
                                              type="text"
                                              className="border rounded px-3 py-1.5 text-sm w-full"
                                              placeholder={`Enter ${param.name}`}
                                              onChange={(e) => updateParam(id, param.name, e.target.value)}
                                            />
                                          )}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm italic">No parameters</p>
                          )}
                        </div>

                        {/* Execute Button */}
                        {isTryingOut && (
                          <button
                            onClick={() => executeRequest(endpoint)}
                            disabled={isLoading}
                            className="mb-6 bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                          >
                            {isLoading ? 'Executing...' : 'Execute'}
                          </button>
                        )}

                        {/* Response Section */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Responses</h4>

                          {response ? (
                            <div className="bg-white border rounded">
                              <div className="bg-gray-50 border-b p-3 flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${response.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                  {response.status}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {response.status === 200 ? 'Successful response' : 'Error'}
                                </span>
                              </div>
                              <div className="p-3">
                                <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                                  {JSON.stringify(response.data || response.error, null, 2)}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white border rounded">
                              <div className="bg-gray-50 border-b p-3">
                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800">
                                  200
                                </span>
                                <span className="ml-3 text-sm text-gray-600">Successful response</span>
                              </div>
                              <div className="p-3">
                                <div className="mb-2 text-sm font-semibold text-gray-700">Example Value</div>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.responseExample, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
