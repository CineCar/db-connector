import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "./../ConnectionSingleton";
import { Movie, MovieScreening } from "com.cinecar.objects";

export class MovieScreeningDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT ms.id AS id, datetime, movieId, name, duration, price, imageUrl FROM movieScreening ms INNER JOIN movie m ON ms.movieId = m.id WHERE ?? <= ? AND ?? >= ?",
                [attribute, end, attribute, start],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const movieScreenings: Array<MovieScreening> = [];

                        res.forEach((row) => {
                            const movieScreening: MovieScreening = new MovieScreening();
                            movieScreening.setId(row.id);
                            movieScreening.setDatetime(new Date(row.datetime));

                            const movie: Movie = new Movie();
                            movie.setId(row.movieId);
                            movie.setName(row.name);
                            movie.setDuration(row.duration);
                            movie.setPrice(row.price);
                            movie.setImageUrl(row.imageUrl);

                            movieScreening.setMovie(movie);

                            movieScreenings.push(movieScreening);
                        });

                        resolve(movieScreenings);
                    }
                }
            );
        });
    }

    public create(object: object): Promise<object> {
        const movieScreening: MovieScreening = <MovieScreening>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO movieScreening (movieId, datetime) VALUES(?, ?)",
                [movieScreening.getMovie().getId(), movieScreening.getDatetime()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        movieScreening.setId(res.insertId);
                        resolve(movieScreening);
                    }
                }
            );
        });
    }

    public update(object: object): Promise<object> {
        const movieScreening: MovieScreening = <MovieScreening>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "UPDATE movieScreening SET datetime = ? WHERE id = ?",
                [movieScreening.getDatetime(), movieScreening.getId()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else resolve(movieScreening);
                }
            );
        });
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "DELETE FROM movieScreening WHERE id = ?",
                [id],
                (err, res, fields) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT ms.id AS id, datetime, movieId, name, duration, price, imageUrl FROM movieScreening ms INNER JOIN movie m ON ms.movieId = m.id WHERE ms.id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const movieScreening: MovieScreening = new MovieScreening();
                        movieScreening.setId(res[0].id);
                        movieScreening.setDatetime(new Date(res[0].datetime));

                        const movie: Movie = new Movie();
                        movie.setId(res[0].movieId);
                        movie.setName(res[0].name);
                        movie.setDuration(res[0].duration);
                        movie.setPrice(res[0].price);
                        movie.setImageUrl(res[0].imageUrl);

                        movieScreening.setMovie(movie);

                        resolve(movieScreening);
                    }
                }
            );
        });
    }

    public getAll(): Promise<object[]> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT ms.id AS id, datetime, movieId, name, duration, price, imageUrl FROM movieScreening ms INNER JOIN movie m ON ms.movieId = m.id",
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const movieScreenings: Array<MovieScreening> = [];

                        res.forEach((row) => {
                            const movieScreening: MovieScreening = new MovieScreening();
                            movieScreening.setId(row.id);
                            movieScreening.setDatetime(new Date(row.datetime));

                            const movie: Movie = new Movie();
                            movie.setId(row.movieId);
                            movie.setName(row.name);
                            movie.setDuration(row.duration);
                            movie.setPrice(row.price);
                            movie.setImageUrl(row.imageUrl);

                            movieScreening.setMovie(movie);

                            movieScreenings.push(movieScreening);
                        });

                        resolve(movieScreenings);
                    }
                }
            );
        });
    }
}
