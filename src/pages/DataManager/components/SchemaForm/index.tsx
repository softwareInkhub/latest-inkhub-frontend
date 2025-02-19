import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Schema } from '../../types';
import { ENDPOINTS } from '../../constants';
import axios from 'axios';

interface Props {
  schema?: Schema;
  onClose: () => void;
  onSave: (schema: Schema) => Promise<void>;
  availableSchemas: Schema[];
  existingSchemas: Schema[];
}

export const SchemaForm: React.FC<Props> = ({ schema, onClose, onSave, availableSchemas }) => {
  const [schemaName, setSchemaName] = useState(schema?.schemaName || '');
  const [fields, setFields] = useState<Record<string, any>>(() => {
    if (schema) {
      const parsedSchema = JSON.parse(schema.schema);
      return parsedSchema.properties || {};
    }
    return {};
  });
  
  const [editingFields, setEditingFields] = useState<Record<string, string>>(() => {
    if (schema) {
      const parsedSchema = JSON.parse(schema.schema);
      return Object.keys(parsedSchema.properties || {}).reduce((acc, key) => {
        acc[key] = key;
        return acc;
      }, {} as Record<string, string>);
    }
    return {};
  });

  const dataTypes = [
    { value: 'string', label: 'Text (string)' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'True/False' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'object', label: 'Object' }
  ];

  const addField = () => {
    const tempId = `temp_${Object.keys(fields).length + 1}`;
    setFields(prev => ({
      ...prev,
      [tempId]: {
        type: 'string',
        title: '',
        description: '',
        required: false,
        schemaRef: ''
      }
    }));
    setEditingFields(prev => ({
      ...prev,
      [tempId]: ''
    }));
  };

  const removeField = (fieldName: string) => {
    const newFields = { ...fields };
    delete newFields[fieldName];
    setFields(newFields);
    
    const newEditingFields = { ...editingFields };
    delete newEditingFields[fieldName];
    setEditingFields(newEditingFields);
  };

  const updateField = (fieldName: string, updates: any) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], ...updates }
    }));
  };

  const handleFieldNameChange = (oldFieldName: string, newValue: string) => {
    setEditingFields(prev => ({
      ...prev,
      [oldFieldName]: newValue
    }));
  };

  const handleFieldNameBlur = (oldFieldName: string) => {
    const newFieldName = editingFields[oldFieldName];
    if (newFieldName && newFieldName !== oldFieldName && !fields[newFieldName]) {
      const newFields = { ...fields };
      const fieldValue = newFields[oldFieldName];
      delete newFields[oldFieldName];
      newFields[newFieldName] = fieldValue;
      setFields(newFields);

      const newEditingFields = { ...editingFields };
      delete newEditingFields[oldFieldName];
      newEditingFields[newFieldName] = newFieldName;
      setEditingFields(newEditingFields);
    }
  };

  const handleSave = async () => {
    const schemaData = {
      uuid: schema?.uuid,
      schemaName,
      schema: JSON.stringify({
        type: 'object',
        properties: fields,
        required: Object.entries(fields)
          .filter(([_, field]) => field.required)
          .map(([key]) => key)
      })
    };
    
    try {
      const endpoint = schema?.uuid ? ENDPOINTS.SCHEMA.UPDATE : ENDPOINTS.SCHEMA.CREATE;
      const response = await axios.post(endpoint, schemaData);
      await onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving schema:', error);
      // Add error handling as needed
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create Schema</h3>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Schema Name</label>
            <input
              type="text"
              value={schemaName}
              onChange={e => setSchemaName(e.target.value)}
              className="mt-1 h-10 pl-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Fields</h4>
              <button
                onClick={addField}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(fields).map(([fieldName, field]) => (
                <div key={fieldName} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Field Name</label>
                      <input
                        type="text"
                        value={editingFields[fieldName] || ''}
                        onChange={e => handleFieldNameChange(fieldName, e.target.value)}
                        onBlur={() => handleFieldNameBlur(fieldName)}
                        className="mt-1 h-10 pl-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter field name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={field.type}
                        onChange={e => updateField(fieldName, { type: e.target.value })}
                        className="mt-1 h-10 pl-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {dataTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {field.type === 'object' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Referenced Schema</label>
                        <select
                          value={field.schemaRef || ''}
                          onChange={e => updateField(fieldName, { schemaRef: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select a schema</option>
                          {availableSchemas
                            .filter(s => s.uuid !== schema?.uuid)
                            .map(s => (
                              <option key={s.uuid} value={s.uuid}>
                                {s.schemaName}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={field.title || ''}
                        onChange={e => updateField(fieldName, { title: e.target.value })}
                        className="mt-1 block h-10 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Display name"
                      />
                    </div>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => removeField(fieldName)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 