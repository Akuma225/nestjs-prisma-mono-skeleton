import { IPaginationParams } from "../../pagination-params";

export interface PaginateOptions {
    model: string;
    where?: any;
    include?: any;
    orderBy?: any[];
    select?: any;
    params: IPaginationParams;
    searchables?: string[];
}