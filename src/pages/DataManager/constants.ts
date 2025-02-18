export const API_BASE_URL = 'http://localhost:3000/api';

export const ENDPOINTS = {
  SCHEMA: {
    CREATE: `${API_BASE_URL}/createSchema`,
    GET_ALL: `${API_BASE_URL}/getAllSchemas`,
    UPDATE: `${API_BASE_URL}/updateSchema`,
    DELETE: `${API_BASE_URL}/deleteSchema`,
    CREATE_TABLE: `${API_BASE_URL}/createTable`,
  },
  DATA: {
    CREATE: `${API_BASE_URL}/createData`,
    GET_ALL: `${API_BASE_URL}/getAllData`,
    UPDATE: `${API_BASE_URL}/updateData`,
    DELETE: `${API_BASE_URL}/deleteData`,
  },
}; 