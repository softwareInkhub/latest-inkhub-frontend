import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { DataForm } from '../DataForm';
import { SchemaForm } from '../SchemaForm';

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
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [schema]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/getAllData', {
        schemaId: schema.uuid
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await axios.delete('http://localhost:3000/api/deleteData', {
        data: { schemaId: schema.uuid, uuid }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const columns = React.useMemo(() => {
    const parsedSchema = JSON.parse(schema.schema);
    return Object.entries(parsedSchema.properties)
      .filter(([key]) => key !== 'schema-id')
      .map(([key, value]: [string, any]) => ({
        key,
        label: value.title || key,
        type: value.type
      }));
  }, [schema]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Data Records
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Record
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(item => (
              <tr key={item.uuid} className="hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof item[column.key] === 'object'
                      ? JSON.stringify(item[column.key])
                      : String(item[column.key] || '')}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingData(item)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.uuid)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr key="empty-row">
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                  No records found. Create your first record using the form above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(showForm || editingData) && (
        <DataForm
          schema={schema}
          data={editingData}
          onClose={() => {
            setShowForm(false);
            setEditingData(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingData(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}; 