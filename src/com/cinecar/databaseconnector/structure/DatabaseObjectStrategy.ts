export interface DatabaseObjectStrategy {
    create(object: object): Promise<object>;
    update(object: object): Promise<object>;
    delete(id: number): Promise<void>;
    get(id: number): Promise<object>;
    getAll(): Promise<Array<object>>;
}
