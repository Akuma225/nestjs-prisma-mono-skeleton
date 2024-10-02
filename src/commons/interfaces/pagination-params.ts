/**
 * Represents the parameters for pagination.
 */
export interface IPaginationParams {
  /**
   * The page number.
   */
  page?: number;

  /**
   * The maximum number of items per page.
   */
  limit?: number;

  /**
   * Indicates whether to fetch all items without pagination.
   */
  all?: boolean;

  /**
   * The search query string.
   */
  search?: string;

  /**
   * Indicates whether to include items that are marked as deleted.
   */
  is_deleted_too?: boolean;

  /**
   * Indicates whether to include only items that are marked as deleted.
   */
  is_deleted_only?: boolean;

  /**
   * The order in which to sort the items.
   */
  order?: string;

  /**
   * Load the previous pages.
   */
  load_previous_pages?: boolean;

  /**
   * Specific pages to load
   */
  specific_pages?: number[];
}