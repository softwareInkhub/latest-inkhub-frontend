import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import axios from 'axios';
import { sampleSchemas } from '../utils/sampleSchemas';

const schemaEditorSchema = {
  type: 'object',
  properties: {
    schemaName: {
      type: 'string',
      title: 'Schema Name'
    },
    schema: {
      type: 'string',
      title: 'Schema Definition'
    }
  },
  required: ['schemaName', 'schema']
};

interface SchemaEditorProps {
  onSchemaCreated: () => void;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({ onSchemaCreated }) => {
  const [data, setData] = useState({ schemaName: '', schema: '' });
  const [error, setError] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      // Validate schema JSON
      
      await axios.post('http://localhost:3000/api/createSchema', {
        schemaName: data.schemaName,
        schema: data.schema
      });
      
      setData({ schemaName: '', schema: '' });
      onSchemaCreated();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid schema format');
    }
  };

  const loadSampleSchema = (type: 'basic' | 'nested') => {
    setData({
      schemaName: `Sample ${type} Schema`,
      schema: JSON.stringify(sampleSchemas[type], null, 2)
    });
    setShowSamples(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Schema</h2>
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setShowSamples(!showSamples)}
        >
          Load Sample Schema
        </button>
      </div>

      {showSamples && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Sample Templates</h3>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => loadSampleSchema('basic')}
            >
              Basic Schema
            </button>
            <button
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => loadSampleSchema('nested')}
            >
              Nested Schema
            </button>
          </div>
        </div>
      )}

      <JsonForms
        schema={schemaEditorSchema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
          transition-colors disabled:bg-gray-400"
        onClick={handleSubmit}
        disabled={!data.schemaName || !data.schema}
      >
        Create Schema
      </button>
    </div>
  );
}; 