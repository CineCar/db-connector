import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";

export class CartDatabaseObjectStrategy implements DatabaseObjectStrategy {
    public create(object: object): Promise<object> {
        throw new Error("Method not implemented.");
    }

    public update(object: object): Promise<object> {
        throw new Error("Method not implemented.");
    }

    public delete(object: object): void {
        throw new Error("Method not implemented.");
    }

    public get(id: number): Promise<object> {
        throw new Error("Method not implemented.");
    }

    public getAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
}
