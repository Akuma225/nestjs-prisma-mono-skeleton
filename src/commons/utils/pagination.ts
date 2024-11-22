export class Pagination<T> {
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  count: number;
  totalCount: number;
  totalPages: number;
  data: T[];

  constructor(
    data: T[],
    totalCount: number,
    currentPage: number,
    count: number,
  ) {
    this.data = data;
    this.totalCount = totalCount;
    this.currentPage = currentPage;
    this.count = count;
    this.totalPages = Math.ceil(this.totalCount / this.count);
    this.previousPage = this.currentPage > 1 ? this.currentPage - 1 : null;
    this.nextPage =
      this.currentPage < this.totalPages ? this.currentPage + 1 : null;
  }
}
