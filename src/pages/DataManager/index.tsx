import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  ArrowLeftIcon,
  TableCellsIcon,
  Bars4Icon
} from '@heroicons/react/24/outline';

import { SchemaTable, SchemaForm, DataTable } from './components';
import { SchemaAPI } from './services/api';
import { Schema } from './types';
import { TablesView } from './components/TablesView';

export const DataManager: React.FC = () => {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [showSchemaForm, setShowSchemaForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSchema, setEditingSchema] = useState<Schema | null>(null);
  const [view, setView] = useState<'schemas' | 'tables'>('schemas');

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      setLoading(true);
      const { data } = await SchemaAPI.getAll();
      setSchemas(data);
    } catch (error) {
      setError('Failed to load schemas');
      console.error('Error fetching schemas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Manager</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your data schemas and records
            </p>
          </div>
          <div className="flex gap-4">
            {!selectedSchema && (
              <>
                <button
                  onClick={() => setView(view === 'schemas' ? 'tables' : 'schemas')}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {view === 'schemas' ? (
                    <>
                      <TableCellsIcon className="h-5 w-5 mr-2" />
                      View Tables
                    </>
                  ) : (
                    <>
                      <Bars4Icon className="h-5 w-5 mr-2" />
                      View Schemas
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSchemaForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Schema
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {selectedSchema ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSchema.schemaName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage data records for this schema
                </p>
              </div>
              <button
                onClick={() => setSelectedSchema(null)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Schemas
              </button>
            </div>
            <DataTable 
              schema={selectedSchema} 
              onDataUpdate={fetchSchemas}
            />
          </div>
        ) : view === 'schemas' ? (
          <SchemaTable
            schemas={schemas}
            onSchemaSelect={setSelectedSchema}
            onSchemaUpdate={fetchSchemas}
            onEditSchema={(schema) => {
              setEditingSchema(schema);
              setShowSchemaForm(true);
            }}
          />
        ) : (
          <TablesView schemas={schemas} onSchemaUpdate={fetchSchemas} />
        )}
      </div>

      {/* Schema Form Modal */}
      {showSchemaForm && (
        <SchemaForm
          schema={editingSchema || undefined}
          availableSchemas={schemas}
          onClose={() => {
            setShowSchemaForm(false);
            setEditingSchema(null);
          }}
          onSave={async (updatedSchema) => {
            await SchemaAPI.update(updatedSchema.uuid, updatedSchema);
            setShowSchemaForm(false);
            setEditingSchema(null);
            fetchSchemas();
          }}
        />
      )}
    </div>
  );
}; 