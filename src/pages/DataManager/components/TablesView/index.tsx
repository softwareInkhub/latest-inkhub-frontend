import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  TableCellsIcon, 
  CodeBracketSquareIcon, 
  ListBulletIcon 
} from '@heroicons/react/24/outline';
import { Schema } from '../../types';
import { DataTable } from '../DataTable';
import { SchemaForm } from '../SchemaForm';
import { SchemaAPI } from '../../services/api';

interface Props {
  schemas: Schema[];
  onSchemaUpdate: () => void;
}

export const TablesView: React.FC<Props> = ({ schemas, onSchemaUpdate }) => {
  const initializedSchemas = schemas.filter(s => s.isTableInitialized);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [showSchemaForm, setShowSchemaForm] = useState(false);
  const [editingSchema, setEditingSchema] = useState<Schema | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Database Tables</h2>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {initializedSchemas.map(schema => (
                <Tab
                  key={schema.uuid}
                  className={({ selected }) =>
                    `px-4 py-2 text-sm font-medium border-b-2 focus:outline-none ${
                      selected
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                  onClick={() => setSelectedSchema(schema)}
                >
                  <div className="flex items-center space-x-2">
                    <ListBulletIcon className="h-4 w-4" />
                    <span>{schema.schemaName}</span>
                  </div>
                </Tab>
              ))}
            </div>
          </Tab.List>

          <Tab.Panels>
            {initializedSchemas.map(schema => (
              <Tab.Panel key={schema.uuid} className="p-4">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      <TableCellsIcon className="h-4 w-4 inline mr-1" />
                      Table Reference
                    </h3>
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {schema.tableRef}
                    </code>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        <CodeBracketSquareIcon className="h-4 w-4 inline mr-1" />
                        Schema Structure
                      </h3>
                      <button
                        onClick={() => {
                          setEditingSchema(schema);
                          setShowSchemaForm(true);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit Schema
                      </button>
                    </div>
                    <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                      {JSON.stringify(JSON.parse(schema.schema), null, 2)}
                    </pre>
                  </div>
                </div>

                <DataTable 
                  schema={schema} 
                  onDataUpdate={onSchemaUpdate} 
                  availableSchemas={schemas}
                />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {showSchemaForm && editingSchema && (
        <SchemaForm
          schema={editingSchema}
          availableSchemas={schemas}
          onClose={() => {
            setShowSchemaForm(false);
            setEditingSchema(null);
          }}
          onSave={async (updatedSchema) => {
            await SchemaAPI.update(updatedSchema.uuid, updatedSchema);
            onSchemaUpdate();
            setShowSchemaForm(false);
            setEditingSchema(null);
          }}
        />
      )}
    </div>
  );
}; 