import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Movie, MovieScreening } from "com.cinecar.objects";

const databaseConnector = DatabaseConnectorImplementation.getSingleton();

async function test() {
    const movie: Movie = <Movie>await databaseConnector.get(1, DatabaseObjectType.Movie);
    console.log(movie);

    console.log(await databaseConnector.getAll(DatabaseObjectType.Movie));

    const newMovie: Movie = <Movie>await databaseConnector.create(movie, DatabaseObjectType.Movie);
    console.log(newMovie);

    await databaseConnector.delete(newMovie.getId(), DatabaseObjectType.Movie);
    databaseConnector.get(newMovie.getId(), DatabaseObjectType.Movie).catch((err) => {
        console.log("Could not find movie");
    });

    let movieScreening: MovieScreening = new MovieScreening();

    movie.setId(1);
    movieScreening.setMovie(movie);
    movieScreening.setDatetime(new Date());

    movieScreening = <MovieScreening>await databaseConnector.create(movieScreening, DatabaseObjectType.MovieScreening);
    await databaseConnector.delete(movieScreening.getId(), DatabaseObjectType.MovieScreening);

    console.log(await databaseConnector.getAll(DatabaseObjectType.MovieScreening));
}

test();
