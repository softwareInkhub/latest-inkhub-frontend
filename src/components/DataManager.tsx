import React, { useState, useEffect } from 'react';
import { SchemaEditor } from './SchemaEditor';
import { DataViewer } from './DataViewer';
import axios from 'axios';

interface Schema {
  uuid: string;
  schemaName: string;
  schema: string;
  tableRef?: string;
  isTableInitialized?: boolean;
}

export const DataManager: React.FC = () => {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [mode, setMode] = useState<'schema' | 'data'>('schema');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/getAllSchemas');
      setSchemas(response.data);
    } catch (error) {
      setError('Failed to load schemas');
      console.error('Error fetching schemas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-lg ${
            mode === 'schema' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setMode('schema')}
        >
          Manage Schemas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            mode === 'data' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setMode('data')}
        >
          Manage Data
        </button>
      </div>

      {mode === 'schema' ? (
        <div>
          <SchemaEditor onSchemaCreated={fetchSchemas} />
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Existing Schemas ({schemas.length})</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schemas.map(schema => (
                <div key={schema.uuid} className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-bold text-lg">{schema.schemaName}</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>ID: {schema.uuid}</p>
                    <p>Status: {schema.isTableInitialized ? 'Initialized' : 'Not Initialized'}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                      onClick={() => {
                        setSelectedSchema(schema);
                        setMode('data');
                      }}
                    >
                      Manage Data
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        selectedSchema && <DataViewer schema={selectedSchema} />
      )}
    </div>
  );
}; 