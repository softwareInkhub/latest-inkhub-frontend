import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  TableCellsIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  ListBulletIcon 
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { SchemaAPI } from '../../services/api';

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
  onEditSchema: (schema: Schema) => void;
}

export const SchemaTable: React.FC<Props> = ({ schemas, onSchemaSelect, onSchemaUpdate }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (uuid: string) => {
    const newExpanded = new Set(expandedRows);
    expandedRows.has(uuid) ? newExpanded.delete(uuid) : newExpanded.add(uuid);
    setExpandedRows(newExpanded);
  };

  const handleInitializeTable = async (schema: Schema) => {
    try {
      await SchemaAPI.createTable(schema.uuid);
      onSchemaUpdate();
    } catch (error) {
      console.error('Error initializing table:', error);
    }
  };

  const handleDuplicate = async (schema: Schema) => {
    try {
      await SchemaAPI.create({
        schemaName: `${schema.schemaName} (Copy)`,
        schema: schema.schema
      });
      onSchemaUpdate();
    } catch (error) {
      console.error('Error duplicating schema:', error);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this schema?')) return;
    
    try {
      await SchemaAPI.delete(uuid);
      onSchemaUpdate();
    } catch (error) {
      console.error('Error deleting schema:', error);
    }
  };

  const renderSchemaProperties = (schema: string) => {
    const parsedSchema = JSON.parse(schema);
    return Object.entries(parsedSchema.properties).map(([key, value]: [string, any]) => (
      <div key={key} className="mb-2">
        <span className="font-medium">{key}</span>: {value.type}
        {value.required && <span className="text-red-500 ml-1">*</span>}
        {value.description && (
          <span className="text-gray-500 text-sm ml-2">({value.description})</span>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schema Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schemas.map(schema => (
            <React.Fragment key={schema.uuid}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
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
                      <div className="font-medium">{schema.schemaName}</div>
                      <div className="text-sm text-gray-500">ID: {schema.uuid}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {schema.isTableInitialized ? (
                    <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                      Initialized
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-full">
                      Not Initialized
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    {!schema.isTableInitialized && (
                      <button
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleInitializeTable(schema)}
                      >
                        <TableCellsIcon className="h-4 w-4 mr-1" />
                        Initialize Table
                      </button>
                    )}
                    <button
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => onSchemaSelect(schema)}
                      disabled={!schema.isTableInitialized}
                    >
                      <ListBulletIcon className="h-4 w-4 mr-1" />
                      Manage Data
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      onClick={() => handleDuplicate(schema)}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                      Duplicate
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleDelete(schema.uuid)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRows.has(schema.uuid) && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 bg-gray-50">
                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Schema Properties:</h4>
                      {renderSchemaProperties(schema.schema)}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 