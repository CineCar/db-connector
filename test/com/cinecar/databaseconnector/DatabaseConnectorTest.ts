import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Movie, MovieScreening } from "com.cinecar.objects";

const databaseConnector = DatabaseConnectorImplementation.getSingleton();

async function test() {
    databaseConnector
        .get(1, DatabaseObjectType.Cart)
        .then((movies: Array<Movie>) => {
            console.log(movies);
        })
        .catch((err) => {
            console.log(err);
        });
}

test();
