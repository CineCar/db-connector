import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Movie, MovieScreening } from "com.cinecar.objects";

const databaseConnector = DatabaseConnectorImplementation.getSingleton();

async function test() {
    databaseConnector
        .getAll(DatabaseObjectType.Movie)
        .then((movies: Array<Movie>) => {
            console.log(movies);
        })
        .catch((err) => {
            console.log(err);
        });
}

test();
