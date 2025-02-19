// API route mapping
export const API_ROUTES = {
    schema: {
        create: '/api/createSchema',
        get: '/api/getSchema',
        getAll: '/api/getAllSchemas',
        update: '/api/updateSchema',
        delete: '/api/deleteSchema'
    },
    data: {
        create: '/api/createData',
        get: '/api/getData',
        getAll: '/api/getAllData',
        update: '/api/updateData',
        delete: '/api/deleteData',
        createTable: '/api/createTable',
        getChildData: '/api/getChildSchemaData',
        searchChild: '/api/searchChildData'
    }
};

// Make sure this matches your backend server configuration
export const BASE_URL =  'https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws'; 