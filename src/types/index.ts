export interface Schema {
    uuid: string;
    schemaName: string;
    schema: string;
    tableRef?: string;
    isTableInitialized?: boolean;
} 