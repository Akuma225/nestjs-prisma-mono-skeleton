export interface GenericUpdateOptions {
    id: string;
    data: Partial<any>;
    connectedUserId?: string;
    include?: any;
    select?: any;
}