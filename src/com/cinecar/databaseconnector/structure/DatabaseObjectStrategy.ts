export interface DatabaseObjectStrategy {
    create(object: object): Promise<object>;
    update(object: object): Promise<object>;
    delete(object: object): void;
    get(id: number): Promise<object>;
    getAll(): Promise<Array<object>>;
}
