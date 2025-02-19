import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
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
}

export const DataViewer: React.FC<Props> = ({ schema }) => {
  const [data, setData] = useState<any[]>([]);
  const [newData, setNewData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [schema]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws/api/getAllData', {
        schemaId: schema.uuid
      });
      setData(response.data);
    } catch (error) {
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws/api/createData', {
        schemaId: schema.uuid,
        data: newData
      });
      setNewData({});
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  const parsedSchema = JSON.parse(schema.schema);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{schema.schemaName}</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setShowForm(true)}
        >
          Add New Record
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Create New Record</h3>
          <JsonForms
            schema={parsedSchema}
            data={newData}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setNewData(data)}
          />
          <div className="mt-4 flex gap-2 justify-end">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg"
              onClick={() => {
                setNewData({});
                setShowForm(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Records</h3>
        </div>
        <div className="divide-y">
          {data.map((item) => (
            <div key={item.uuid} className="p-4">
              <pre className="text-sm bg-gray-50 p-2 rounded">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 