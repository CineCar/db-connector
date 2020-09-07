import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "./../ConnectionSingleton";

export class MovieDatabaseObjectStrategy implements DatabaseObjectStrategy {
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
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("SELECT id, name, duration FROM movie WHERE id = ?", [id], (err, res, fields) => {
                if (err || res.length == 0) reject(err);
                else {
                    let obj = {
                        id: res[0].id,
                        name: res[0].name,
                        duration: res[0].duration,
                        movieScreenings: [],
                    };

                    ConnectionSingleton.getConnection().query("SELECT id, datetime FROM movieScreening WHERE movieId = ?", [id], (err, res, fields) => {
                        if (err) reject(err);
                        else {
                            res.forEach((row) => {
                                obj.movieScreenings.push({
                                    id: row.id,
                                    datetime: row.datetime,
                                });
                            });
                            resolve(obj);
                        }
                    });
                }
            });
        });
    }

    public getAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
}
