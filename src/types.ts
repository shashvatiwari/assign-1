export type ColumnType = 'string' | 'number';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

export interface Row {
  id: string;
  [key: string]: any;
}
