export interface TodoItem {
  _id: string;
  createdAt: string;
  description: string;
  done: boolean;
  updatedAt: string;
}

export interface TodoMeta {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemCount: number;
  limit: number;
  nextPage: number | null;
  offset: number;
  page: number;
  pageCount: number;
  prevPage: number | null;
}

export interface TodoList {
  items: TodoItem[] | [];
  meta: TodoMeta;
}

export enum TimeUnits {
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute'
}
export interface PaginationSteps {
  nextPage: string;
  prevPage: string;
}

export enum Pages {
  Next = 'nextPage',
  Prev = 'prevPage'
}

export type ErrorList = {
  errors: []
}

export interface SuccessList {
  message: string;
}
