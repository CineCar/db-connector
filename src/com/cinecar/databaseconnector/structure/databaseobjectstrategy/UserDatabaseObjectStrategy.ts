import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "../ConnectionSingleton";
import { User } from "com.cinecar.objects";

export class UserDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    create(object: object): Promise<object> {
        throw new Error("Method not implemented.");
    }

    update(object: object): Promise<object> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT id, password FROM user WHERE id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const user: User = new User();
                        user.setId(res[0].id);
                        user.setPassword(res[0].password);

                        resolve(user);
                    }
                }
            );
        });
    }

    getAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
}
