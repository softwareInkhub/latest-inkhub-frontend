import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Schema {
  uuid: string;
  schemaName: string;
  schema: string;
  tableRef?: string;
  isTableInitialized?: boolean;
}

interface Props {
  schemas: Schema[];
  onSchemaSelect: (schema: Schema) => void;
  onSchemaUpdate: () => void;
}

export const SchemaList: React.FC<Props> = ({ schemas, onSchemaSelect, onSchemaUpdate }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (uuid: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(uuid)) {
      newExpanded.delete(uuid);
    } else {
      newExpanded.add(uuid);
    }
    setExpandedRows(newExpanded);
  };

  const handleInitializeTable = async (schema: Schema) => {
    try {
      await axios.post('https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws/api/createTable', {
        schemaId: schema.uuid
      });
      onSchemaUpdate();
    } catch (error) {
      console.error('Error initializing table:', error);
    }
  };

  const handleDuplicate = async (schema: Schema) => {
    try {
      await axios.post('https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws/api/createSchema', {
        schemaName: `${schema.schemaName} (Copy)`,
        schema: schema.schema
      });
      onSchemaUpdate();
    } catch (error) {
      console.error('Error duplicating schema:', error);
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      await axios.delete('https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws/api/deleteSchema', {
        data: { uuid }
      });
      onSchemaUpdate();
    } catch (error) {
      console.error('Error deleting schema:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y">
        {schemas.map(schema => (
          <div key={schema.uuid} className="divide-y">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleRow(schema.uuid)}
                    className="mr-2 p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedRows.has(schema.uuid) ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-medium">{schema.schemaName}</h3>
                    <p className="text-sm text-gray-500">ID: {schema.uuid}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!schema.isTableInitialized && (
                    <button
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                      onClick={() => handleInitializeTable(schema)}
                    >
                      Initialize Table
                    </button>
                  )}
                  <button
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                    onClick={() => onSchemaSelect(schema)}
                  >
                    Manage Data
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded"
                    onClick={() => handleDuplicate(schema)}
                  >
                    Duplicate
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                    onClick={() => handleDelete(schema.uuid)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {expandedRows.has(schema.uuid) && (
              <div className="p-4 bg-gray-50">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(JSON.parse(schema.schema), null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
        {schemas.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No schemas found. Create your first schema using the form above.
          </div>
        )}
      </div>
    </div>
  );
}; 