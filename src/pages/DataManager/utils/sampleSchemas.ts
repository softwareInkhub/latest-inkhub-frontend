export const sampleSchemas = {
  basic: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Full name of the person',
        required: true
      },
      age: {
        type: 'number',
        title: 'Age',
        minimum: 0,
        maximum: 150
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email',
        required: true
      }
    }
  },
  nested: {
    type: 'object',
    properties: {
      personalInfo: {
        type: 'object',
        title: 'Personal Information',
        properties: {
          firstName: {
            type: 'string',
            title: 'First Name',
            required: true
          },
          lastName: {
            type: 'string',
            title: 'Last Name',
            required: true
          },
          contact: {
            type: 'object',
            title: 'Contact Details',
            properties: {
              email: {
                type: 'string',
                title: 'Email',
                format: 'email',
                required: true
              },
              phone: {
                type: 'string',
                title: 'Phone',
                pattern: '^[0-9]{10}$'
              }
            }
          }
        }
      },
      addresses: {
        type: 'array',
        title: 'Addresses',
        items: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
              title: 'Street'
            },
            city: {
              type: 'string',
              title: 'City'
            },
            country: {
              type: 'string',
              title: 'Country'
            }
          }
        }
      }
    }
  }
}; 