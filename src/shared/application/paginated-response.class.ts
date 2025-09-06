export class PaginatedResponse<T> {
  public data: T[];
  public totalItems: number;
  public currentPage: number;
  public totalPages: number;
  public currentLimit: number;
}
