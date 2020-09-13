import { DatabaseConnector } from "./DatabaseConnector";
import { DatabaseObjectType } from "../structure/DatabaseObjectType";
import { DatabaseObjectStrategyFactory } from "../structure/DatabaseObjectStrategyFactory";

export class DatabaseConnectorImplementation implements DatabaseConnector {
    private static databaseConnector: DatabaseConnector;

    public static getSingleton(): DatabaseConnector {
        if (DatabaseConnectorImplementation.databaseConnector == null) {
            DatabaseConnectorImplementation.databaseConnector = new DatabaseConnectorImplementation();
        }

        return DatabaseConnectorImplementation.databaseConnector;
    }

    public create(object: object, type: DatabaseObjectType): Promise<object> {
        return DatabaseObjectStrategyFactory.create(type).create(object);
    }

    public update(object: object, type: DatabaseObjectType): Promise<object> {
        return DatabaseObjectStrategyFactory.create(type).update(object);
    }

    public delete(id: number, type: DatabaseObjectType): Promise<void> {
        return DatabaseObjectStrategyFactory.create(type).delete(id);
    }

    public get(id: number, type: DatabaseObjectType): Promise<object> {
        return DatabaseObjectStrategyFactory.create(type).get(id);
    }

    public getAll(type: DatabaseObjectType): Promise<object[]> {
        return DatabaseObjectStrategyFactory.create(type).getAll();
    }

    public search(attribute: string, query: string, type: DatabaseObjectType): Promise<Array<object>> {
        return DatabaseObjectStrategyFactory.create(type).search(attribute, query);
    }

    public filter(attribute: string, start: any, end: any, type: DatabaseObjectType): Promise<Array<object>> {
        return DatabaseObjectStrategyFactory.create(type).filter(attribute, start, end);
    }
}
