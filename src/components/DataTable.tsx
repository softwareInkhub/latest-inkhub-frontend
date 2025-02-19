import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ChevronDownIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Schema {
  uuid: string;
  schemaName: string;
  schema: string;
  tableRef?: string;
  isTableInitialized?: boolean;
}

interface Props {
  schema: Schema;
  onDataUpdate: () => void;
  availableSchemas: Schema[];
}

export const DataTable: React.FC<Props> = ({ schema, onDataUpdate, availableSchemas }) => {
  const [data, setData] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingData, setEditingData] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newData, setNewData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [schema]);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/getAllData', {
        schemaId: schema.uuid
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleRow = (uuid: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(uuid)) {
      newExpanded.delete(uuid);
    } else {
      newExpanded.add(uuid);
    }
    setExpandedRows(newExpanded);
  };

  const handleCreate = async () => {
    try {
      setError(null);
      await axios.post('http://localhost:3000/api/createData', {
        schemaId: schema.uuid,
        data: newData
      });
      setShowCreateForm(false);
      setNewData({});
      onDataUpdate();
    } catch (error) {
      setError('Failed to create data');
      console.error('Error creating data:', error);
    }
  };

  const handleUpdate = async (uuid: string, data: any) => {
    try {
      setError(null);
      await axios.put('http://localhost:3000/api/updateData', {
        schemaId: schema.uuid,
        uuid,
        data
      });
      setEditingData(null);
      onDataUpdate();
    } catch (error) {
      setError('Failed to update data');
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      setError(null);
      await axios.delete('http://localhost:3000/api/deleteData', {
        data: { schemaId: schema.uuid, uuid }
      });
      onDataUpdate();
    } catch (error) {
      setError('Failed to delete data');
      console.error('Error deleting data:', error);
    }
  };

  const parsedSchema = JSON.parse(schema.schema);

  // Example usage of existingSchemas
  console.log(availableSchemas); // Just to demonstrate usage

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Data for {schema.schemaName}</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setShowCreateForm(true)}
        >
          Add New Record
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-600">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Create New Record</h3>
          <JsonForms
            schema={parsedSchema}
            data={newData}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setNewData(data)}
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 text-gray-600 border rounded"
              onClick={() => {
                setNewData({});
                setShowCreateForm(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="divide-y">
        {data.map(item => (
          <div key={item.uuid} className="divide-y">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleRow(item.uuid)}
                    className="mr-2 p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedRows.has(item.uuid) ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm text-gray-500">ID: {item.uuid}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => setEditingData(item)}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    onClick={() => handleDelete(item.uuid)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            {expandedRows.has(item.uuid) && (
              <div className="p-4 bg-gray-50">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
            <h2 className="text-xl font-bold mb-4">Edit Record</h2>
            <JsonForms
              schema={parsedSchema}
              data={editingData}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ data }) => setEditingData(data)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600 border rounded"
                onClick={() => setEditingData(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => handleUpdate(editingData.uuid, editingData)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 