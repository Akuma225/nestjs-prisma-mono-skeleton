import { IPaginationParams } from "../../pagination-params";

export interface GenericFindAllOptions {
    params?: IPaginationParams;
    whereClause?: any;
    include?: any;
    select?: any;
    orderBy?: any[];
    searchables?: string[];
}