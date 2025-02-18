import React, { useState } from 'react';
import axios from 'axios';
import { API_ROUTES, BASE_URL } from '../routes/apiRoutes';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Schema } from '../types';

interface ActivityLog {
    id: string;
    route: string;
    method: string;
    request: any;
    response: any;
    status: 'success' | 'error';
    timestamp: Date;
    category: 'schema' | 'data';
}

interface RouteTest {
    name: string;
    route: string;
    method: string;
    category: 'schema' | 'data';
    samplePayload?: any;
}

const AVAILABLE_ROUTES: RouteTest[] = [
    // Schema Routes
    {
        name: 'Create Schema',
        route: API_ROUTES.schema.create,
        method: 'POST',
        category: 'schema',
        samplePayload: {
            schemaName: "TestSchema",
            schema: JSON.stringify({
                type: "object",
                properties: {
                    name: { type: "string" },
                    age: { type: "number" }
                }
            })
        }
    },
    {
        name: 'Get Schema',
        route: API_ROUTES.schema.get,
        method: 'POST',
        category: 'schema',
        samplePayload: {
            uuid: "<schema_uuid>"
        }
    },
    {
        name: 'Get All Schemas',
        route: API_ROUTES.schema.getAll,
        method: 'GET',
        category: 'schema'
    },
    {
        name: 'Update Schema',
        route: API_ROUTES.schema.update,
        method: 'PUT',
        category: 'schema',
        samplePayload: {
            uuid: "<schema_uuid>",
            schemaName: "UpdatedSchema"
        }
    },
    {
        name: 'Delete Schema',
        route: API_ROUTES.schema.delete,
        method: 'DELETE',
        category: 'schema',
        samplePayload: {
            uuid: "<schema_uuid>"
        }
    },

    // Data Routes
    {
        name: 'Create Table',
        route: API_ROUTES.data.createTable,
        method: 'POST',
        category: 'data',
        samplePayload: {
            schemaId: "<schema_uuid>"
        }
    },
    {
        name: 'Create Data',
        route: API_ROUTES.data.create,
        method: 'POST',
        category: 'data',
        samplePayload: {
            schemaId: "<schema_uuid>",
            data: {
                name: "Test Data",
                age: 25
            }
        }
    },
    {
        name: 'Get Data',
        route: API_ROUTES.data.get,
        method: 'POST',
        category: 'data',
        samplePayload: {
            schemaId: "<schema_uuid>",
            uuid: "<data_uuid>"
        }
    },
    {
        name: 'Get All Data',
        route: API_ROUTES.data.getAll,
        method: 'POST',
        category: 'data',
        samplePayload: {
            schemaId: "<schema_uuid>"
        }
    },
    {
        name: 'Update Data',
        route: API_ROUTES.data.update,
        method: 'PUT',
        category: 'data',
        samplePayload: {
            schemaId: "<schema_uuid>",
            uuid: "<data_uuid>",
            data: {
                name: "Updated Data",
                age: 26
            }
        }
    },
    {
        name: 'Delete Data',
        route: API_ROUTES.data.delete,
        method: 'DELETE',
        category: 'data',
        samplePayload: {
            schemaId: "<schema_uuid>",
            uuid: "<data_uuid>"
        }
    },
    {
        name: 'Get Child Schema Data',
        route: API_ROUTES.data.getChildData,
        method: 'POST',
        category: 'data',
        samplePayload: {
            parentSchemaId: "<parent_schema_uuid>",
            childSchemaId: "<child_schema_uuid>"
        }
    }
];

const ActivityTester: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'schema' | 'data'>('all');
    const [payloads, setPayloads] = useState<Record<string, string>>({});

    const toggleRow = (routeId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(routeId)) {
            newExpanded.delete(routeId);
        } else {
            newExpanded.add(routeId);
        }
        setExpandedRows(newExpanded);
    };

    const updatePayload = (routeId: string, payload: string) => {
        setPayloads(prev => ({
            ...prev,
            [routeId]: payload
        }));
    };

    const testRoute = async (route: RouteTest) => {
        const routeId = `${route.method}-${route.route}`;
        try {
            let response;
            const parsedPayload = payloads[routeId] ? JSON.parse(payloads[routeId]) : {};

            switch (route.method) {
                case 'GET':
                    response = await axios.get(`${BASE_URL}${route.route}`);
                    break;
                case 'POST':
                    response = await axios.post(`${BASE_URL}${route.route}`, parsedPayload);
                    break;
                case 'PUT':
                    response = await axios.put(`${BASE_URL}${route.route}`, parsedPayload);
                    break;
                case 'DELETE':
                    response = await axios.delete(`${BASE_URL}${route.route}`, { data: parsedPayload });
                    break;
                default:
                    throw new Error(`Unsupported method: ${route.method}`);
            }

            addLog(route.category, route.method, route.route, parsedPayload, response.data);
        } catch (error: any) {
            console.error('Error testing route:', error);
            addLog(
                route.category,
                route.method,
                route.route,
                payloads[routeId],
                {
                    error: error.message,
                    details: error.response?.data
                },
                'error'
            );
        }
    };

    const addLog = (
        category: 'schema' | 'data',
        method: string,
        route: string,
        request: any,
        response: any,
        status: 'success' | 'error' = 'success'
    ) => {
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            route,
            method,
            request,
            response,
            status,
            timestamp: new Date(),
            category
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const filteredRoutes = AVAILABLE_ROUTES.filter(route => 
        selectedCategory === 'all' || route.category === selectedCategory
    );

    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">API Routes</h2>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                        className="w-full p-2 border rounded mb-4"
                    >
                        <option value="all">All Routes</option>
                        <option value="schema">Schema Routes</option>
                        <option value="data">Data Routes</option>
                    </select>

                    <div className="space-y-2">
                        {filteredRoutes.map((route) => {
                            const routeId = `${route.method}-${route.route}`;
                            const isExpanded = expandedRows.has(routeId);

                            // Initialize payload if not exists
                            if (!payloads[routeId] && route.samplePayload) {
                                updatePayload(routeId, JSON.stringify(route.samplePayload, null, 2));
                            }

                            return (
                                <div key={routeId} className="border rounded-lg overflow-hidden">
                                    <div 
                                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                                        onClick={() => toggleRow(routeId)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                route.category === 'schema' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {route.method}
                                            </span>
                                            <span className="font-medium">{route.name}</span>
                                            <span className="text-sm text-gray-500">{route.route}</span>
                                        </div>
                                        <ChevronDownIcon 
                                            className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="p-4 border-t">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Request Payload
                                                    </label>
                                                    <textarea
                                                        value={payloads[routeId] || ''}
                                                        onChange={(e) => updatePayload(routeId, e.target.value)}
                                                        className="w-full h-32 p-2 font-mono text-sm border rounded"
                                                        placeholder="Enter JSON payload..."
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => testRoute(route)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Test Route
                                                </button>
                                                
                                                {/* Route-specific logs */}
                                                <div className="space-y-2">
                                                    {logs
                                                        .filter(log => log.route === route.route && log.method === route.method)
                                                        .map(log => (
                                                            <div 
                                                                key={log.id}
                                                                className={`p-4 rounded ${
                                                                    log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-sm text-gray-500">
                                                                        {log.timestamp.toLocaleTimeString()}
                                                                    </span>
                                                                    <span className={`px-2 py-1 text-xs rounded ${
                                                                        log.status === 'success' 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {log.status}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-900 mb-1">Request</h4>
                                                                        <pre className="bg-white p-2 rounded text-xs overflow-auto">
                                                                            {JSON.stringify(log.request, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-900 mb-1">Response</h4>
                                                                        <pre className="bg-white p-2 rounded text-xs overflow-auto">
                                                                            {JSON.stringify(log.response, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityTester; 