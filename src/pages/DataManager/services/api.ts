import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { Schema } from '../types';

export const SchemaAPI = {
  getAll: () => axios.get(ENDPOINTS.SCHEMA.GET_ALL),
  create: (data: Partial<Schema>) => axios.post(ENDPOINTS.SCHEMA.CREATE, data),
  update: (uuid: string, data: Partial<Schema>) => axios.put(ENDPOINTS.SCHEMA.UPDATE, { uuid, ...data }),
  createTable: (schemaId: string) => axios.post(ENDPOINTS.SCHEMA.CREATE_TABLE, { schemaId }),
  delete: (uuid: string) => axios.delete(ENDPOINTS.SCHEMA.DELETE, { data: { uuid } }),
};

export const DataAPI = {
  getAll: (schemaId: string) => axios.post(ENDPOINTS.DATA.GET_ALL, { schemaId }),
  create: (schemaId: string, data: any) => axios.post(ENDPOINTS.DATA.CREATE, { schemaId, data }),
  update: (schemaId: string, uuid: string, data: any) => 
    axios.put(ENDPOINTS.DATA.UPDATE, { schemaId, uuid, data }),
  delete: (schemaId: string, uuid: string) => 
    axios.delete(ENDPOINTS.DATA.DELETE, { data: { schemaId, uuid } }),
}; 