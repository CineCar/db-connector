export interface DatabaseObjectStrategy {
    create(object: object): Promise<object>;
    update(object: object): Promise<object>;
    delete(id: number): Promise<void>;
    get(id: number): Promise<object>;
    search(attribute: string, query: string): Promise<Array<object>>;
    filter(attribute: string, start: any, end: string): Promise<Array<object>>;
    getAll(): Promise<Array<object>>;
}
