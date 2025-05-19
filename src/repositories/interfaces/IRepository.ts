export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: Record<string, 1 | -1>; // 1 for ascending, -1 for descending
  filter?: Record<string, any>;
}

export interface RepositoryBase<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<{ data: T[]; total: number }>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
