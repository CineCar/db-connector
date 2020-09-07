import { DatabaseObjectStrategy } from "./DatabaseObjectStrategy";
import { DatabaseObjectType } from "./DatabaseObjectType";
import { MovieDatabaseObjectStrategy } from "./databaseobjectstrategy/MovieDatabaseObjectStrategy";
import { PersonDatabaseObjectStrategy } from "./databaseobjectstrategy/PersonDatabaseObjectStrategy";
import { CartDatabaseObjectStrategy } from "./databaseobjectstrategy/CartDatabaseObjectStrategy";
import { BookingDatabaseObjectStrategy } from "./databaseobjectstrategy/BookingDatabaseObjectStrategy";
import { TicketDatabaseObjectStrategy } from "./databaseobjectstrategy/TicketDatabaseObjectStrategy";
import { MovieScreeningDatabaseObjectStrategy } from "./databaseobjectstrategy/MovieScreeningDatabaseObjectStrategy";

export abstract class DatabaseObjectStrategyFactory {
    static create(type: DatabaseObjectType): DatabaseObjectStrategy {
        let databaseObjectStrategy: DatabaseObjectStrategy = null;

        switch (type) {
            case DatabaseObjectType.Movie:
                databaseObjectStrategy = new MovieDatabaseObjectStrategy();
                break;
            case DatabaseObjectType.Person:
                databaseObjectStrategy = new PersonDatabaseObjectStrategy();
                break;
            case DatabaseObjectType.Cart:
                databaseObjectStrategy = new CartDatabaseObjectStrategy();
                break;
            case DatabaseObjectType.Booking:
                databaseObjectStrategy = new BookingDatabaseObjectStrategy();
                break;
            case DatabaseObjectType.MovieScreening:
                databaseObjectStrategy = new MovieScreeningDatabaseObjectStrategy();
                break;
            case DatabaseObjectType.Ticket:
                databaseObjectStrategy = new TicketDatabaseObjectStrategy();
                break;
        }

        return databaseObjectStrategy;
    }
}
