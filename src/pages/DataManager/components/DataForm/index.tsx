import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import axios from 'axios';
import { DataAPI } from '../../services/api';

interface Schema {
  uuid: string;
  schemaName: string;
  schema: string;
  tableRef?: string;
  isTableInitialized?: boolean;
}

interface Props {
  schema: Schema;
  data?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const DataForm: React.FC<Props> = ({ schema, data, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(data || {});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const dataWithSchemaId = {
        ...formData,
        'schema-id': schema.uuid
      };

      if (data) {
        await DataAPI.update(schema.uuid, data.uuid, dataWithSchemaId);
      } else {
        await DataAPI.create(schema.uuid, dataWithSchemaId);
      }

      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save data');
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parsedSchema = JSON.parse(schema.schema);
  // Remove schema-id from form
  const { 'schema-id': _, ...properties } = parsedSchema.properties;
  const formSchema = {
    ...parsedSchema,
    properties
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {data ? 'Edit Record' : 'Create New Record'}
          </h3>
        </div>

        <div className="p-6">
          <JsonForms
            schema={formSchema}
            data={formData}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setFormData(data)}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 