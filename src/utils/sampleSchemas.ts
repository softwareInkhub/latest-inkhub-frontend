export const sampleSchemas = {
  basic: {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Name' },
      age: { type: 'number', title: 'Age' },
      email: { type: 'string', format: 'email', title: 'Email' }
    },
    required: ['name', 'email']
  },
  nested: {
    type: 'object',
    properties: {
      personalInfo: {
        type: 'object',
        properties: {
          firstName: { type: 'string', title: 'First Name' },
          lastName: { type: 'string', title: 'Last Name' },
          contact: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email', title: 'Email' },
              phone: { type: 'string', title: 'Phone' }
            }
          }
        }
      },
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            street: { type: 'string', title: 'Street' },
            city: { type: 'string', title: 'City' },
            country: { type: 'string', title: 'Country' }
          }
        }
      }
    }
  }
}; 