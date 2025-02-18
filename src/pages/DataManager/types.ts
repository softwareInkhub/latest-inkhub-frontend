export interface Schema {
  uuid: string;
  schemaName: string;
  schema: string;
  tableRef?: string;
  isTableInitialized?: boolean;
}

export interface SchemaProperty {
  type: string;
  title?: string;
  description?: string;
  required?: boolean;
  format?: string;
} 