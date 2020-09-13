import { DatabaseObjectType } from "../structure/DatabaseObjectType";

export interface DatabaseConnector {
    create(object: object, type: DatabaseObjectType): Promise<object>;
    update(object: object, type: DatabaseObjectType): Promise<object>;
    delete(id: number, type: DatabaseObjectType): Promise<void>;
    get(id: number, type: DatabaseObjectType): Promise<object>;
    getAll(type: DatabaseObjectType): Promise<Array<object>>;
    search(attribute: string, query: string, type: DatabaseObjectType): Promise<Array<object>>;
    filter(attribute: string, start: any, end: any, type: DatabaseObjectType): Promise<Array<object>>;
}
