import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "../ConnectionSingleton";
import { Person } from "com.cinecar.objects";

export class PersonDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    public create(object: object): Promise<object> {
        const person: Person = <Person>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO person (firstname, lastname) VALUES(?, ?)",
                [person.getFirstname(), person.getLastname()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        person.setId(res.insertId);
                        resolve(person);
                    }
                }
            );
        });
    }

    public update(object: object): Promise<object> {
        const person: Person = <Person>object;
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "UPDATE person SET firstname = ?, lastname = ?",
                [person.getFirstname(), person.getLastname()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else resolve(person);
                }
            );
        });
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("DELETE FROM person WHERE id = ?", [id], (err, res, fields) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT id, firstname, lastname FROM person WHERE id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const person: Person = new Person();
                        person.setId(id);
                        person.setFirstname(res[0].firstname);
                        person.setLastname(res[0].lastname);

                        resolve(person);
                    }
                }
            );
        });
    }

    public getAll(): Promise<object[]> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT id, firstname, lastname FROM person",
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const persons: Array<Person> = [];

                        res.forEach((row) => {
                            const person: Person = new Person();
                            person.setId(row.id);
                            person.setFirstname(row.firstname);
                            person.setLastname(row.lastname);

                            persons.push(person);
                        });

                        resolve(persons);
                    }
                }
            );
        });
    }
}
