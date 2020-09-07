import { DatabaseObjectType } from "../structure/DatabaseObjectType";

export interface DatabaseConnector {
    create(object: object, type: DatabaseObjectType): Promise<object>;
    update(object: object, type: DatabaseObjectType): Promise<object>;
    delete(id: number, type: DatabaseObjectType): Promise<void>;
    get(id: number, type: DatabaseObjectType): Promise<object>;
    getAll(type: DatabaseObjectType): Promise<Array<object>>;
}
