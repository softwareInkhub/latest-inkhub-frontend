import React from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';

interface Props {
  value: any;
  onChange: (value: any) => void;
  existingSchemas: Array<{ uuid: string; schemaName: string }>;
}

const schemaBuilderSchema = {
  type: 'object',
  properties: {
    type: { 
      type: 'string',
      enum: ['object'],
      default: 'object'
    },
    properties: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['string', 'number', 'boolean', 'object', 'array'],
            default: 'string'
          },
          title: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          required: {
            type: 'boolean',
            default: false
          },
          format: {
            type: 'string',
            enum: ['', 'date', 'date-time', 'email', 'uri', 'uuid'],
            default: ''
          },
          minimum: {
            type: 'number'
          },
          maximum: {
            type: 'number'
          },
          minLength: {
            type: 'number'
          },
          maxLength: {
            type: 'number'
          },
          pattern: {
            type: 'string'
          },
          properties: {
            type: 'object',
            additionalProperties: {
              $ref: '#/properties/properties/additionalProperties'
            }
          },
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['string', 'number', 'boolean', 'object']
              },
              schemaRef: {
                type: 'string',
                enum: ['', ...existingSchemas.map(s => s.uuid)],
                enumNames: ['None', ...existingSchemas.map(s => s.schemaName)]
              }
            }
          }
        }
      }
    }
  }
};

const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties',
      options: {
        detail: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/type'
            },
            {
              type: 'Control',
              scope: '#/properties/title'
            },
            {
              type: 'Control',
              scope: '#/properties/description'
            },
            {
              type: 'Control',
              scope: '#/properties/required'
            },
            {
              type: 'Control',
              scope: '#/properties/format',
              rule: {
                effect: 'SHOW',
                condition: {
                  scope: '#/properties/type',
                  schema: { enum: ['string'] }
                }
              }
            },
            {
              type: 'Control',
              scope: '#/properties/properties',
              rule: {
                effect: 'SHOW',
                condition: {
                  scope: '#/properties/type',
                  schema: { enum: ['object'] }
                }
              }
            },
            {
              type: 'Control',
              scope: '#/properties/items',
              rule: {
                effect: 'SHOW',
                condition: {
                  scope: '#/properties/type',
                  schema: { enum: ['array'] }
                }
              }
            }
          ]
        }
      }
    }
  ]
};

export const SchemaBuilder: React.FC<Props> = ({ value, onChange, existingSchemas }) => {
  const initialData = value || {
    type: 'object',
    properties: {}
  };

  return (
    <div className="border rounded-lg p-4">
      <JsonForms
        schema={schemaBuilderSchema}
        uischema={uiSchema}
        data={initialData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => onChange(data)}
      />
    </div>
  );
}; 