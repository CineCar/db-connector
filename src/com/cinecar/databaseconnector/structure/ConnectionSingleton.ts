import * as mysql from "mysql";

export abstract class ConnectionSingleton {
    static connection: any;

    static getConnection(): any {
        if (ConnectionSingleton.connection == null) {
            ConnectionSingleton.connection = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                ssl: {
                    rejectUnauthorized: false,
                },
            });

            ConnectionSingleton.connection.connect();
        }

        return ConnectionSingleton.connection;
    }
}
