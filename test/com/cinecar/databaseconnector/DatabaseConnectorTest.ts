import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Movie } from "com.cinecar.objects";

const databaseConnector = new DatabaseConnectorImplementation();

async function test() {
    const movie = await databaseConnector.get(1, DatabaseObjectType.Movie);
    console.log(movie);

    console.log(await databaseConnector.getAll(DatabaseObjectType.Movie));

    const newMovie: Movie = <Movie>await databaseConnector.create(movie, DatabaseObjectType.Movie);
    console.log(newMovie);

    await databaseConnector.delete(newMovie.getId(), DatabaseObjectType.Movie);
    databaseConnector.get(newMovie.getId(), DatabaseObjectType.Movie).catch((err) => {
        console.log("Could not find movie");
    });
}

test();
