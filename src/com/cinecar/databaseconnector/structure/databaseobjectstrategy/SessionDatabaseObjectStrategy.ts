import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "../ConnectionSingleton";
import { Session, User } from "com.cinecar.objects";

export class SessionDatabaseObjectStrategy implements DatabaseObjectStrategy {
    create(object: object): Promise<object> {
        const session: Session = <Session>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO session (token, userId) VALUES(?, ?)",
                [session.getToken(), session.getUser().getId()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        session.setId(res.insertId);
                        resolve(session);
                    }
                }
            );
        });
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
                "SELECT s.id AS id, token, userId, password FROM session s INNER JOIN user u ON s.userId = u.id WHERE s.id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const session: Session = new Session();
                        session.setId(res[0].id);
                        session.setToken(res[0].token);

                        const user: User = new User();
                        user.setId(res[0].userId);
                        user.setPassword(res[0].password);

                        session.setUser(user);

                        resolve(session);
                    }
                }
            );
        });
    }

    getAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
}
