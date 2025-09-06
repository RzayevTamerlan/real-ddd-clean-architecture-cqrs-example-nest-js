interface PaginatedProps<T> {
  totalItems: number;
  data: T[];
  currentPage: number;
  currentLimit: number;
}

export class Paginated<T> {
  readonly totalItems: number;
  readonly data: T[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly currentLimit: number;

  constructor(props: PaginatedProps<T>) {
    this.totalItems = props.totalItems;
    this.data = props.data;
    this.currentPage = props.currentPage;
    this.currentLimit = props.currentLimit;
    this.totalPages = Math.ceil(props.totalItems / props.currentLimit);
  }
}
