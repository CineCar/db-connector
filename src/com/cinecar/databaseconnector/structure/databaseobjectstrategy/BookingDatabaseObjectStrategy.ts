import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";

export class BookingDatabaseObjectStrategy implements DatabaseObjectStrategy {
    public create(object: object): Promise<object> {
        throw new Error("Method not implemented.");
    }

    public update(object: object): Promise<object> {
        throw new Error("Method not implemented.");
    }

    public delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public get(id: number): Promise<object> {
        throw new Error("Method not implemented.");
    }

    public getAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
}
