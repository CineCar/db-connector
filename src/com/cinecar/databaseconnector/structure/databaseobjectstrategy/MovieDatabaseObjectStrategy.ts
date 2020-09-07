import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "./../ConnectionSingleton";
import { Movie, MovieScreening } from "com.cinecar.objects";

export class MovieDatabaseObjectStrategy implements DatabaseObjectStrategy {
    public create(object: object): Promise<object> {
        const movie: Movie = <Movie>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("INSERT INTO movie (name, duration) VALUES(?, ?)", [movie.getName(), movie.getDuration()], (err, res, fields) => {
                if (err) reject(err);
                else {
                    movie.setId(res.insertId);
                    resolve(movie);
                }
            });
        });
    }

    public update(object: object): Promise<object> {
        const movie: Movie = <Movie>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("UPDATE FROM movie SET name = ??, duration = ? WHERE id = ?", [movie.getName(), movie.getDuration(), movie.getId()], (err, res, fields) => {
                if (err) reject(err);
                else resolve(movie);
            });
        });
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("DELETE FROM movie WHERE id = ?", [id], (err, res, fields) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("SELECT id, name, duration FROM movie WHERE id = ?", [id], (err, res, fields) => {
                if (err || res.length == 0) reject(err);
                else {
                    const movie: Movie = new Movie();
                    movie.setId(id);
                    movie.setName(res[0].name);
                    movie.setDuration(res[0].duration);

                    ConnectionSingleton.getConnection().query("SELECT id, datetime FROM movieScreening WHERE movieId = ?", [id], (err, res, fields) => {
                        if (err) reject(err);
                        else {
                            const movieScreenings: Array<MovieScreening> = [];

                            res.forEach((row) => {
                                const movieScreening = new MovieScreening();
                                movieScreening.setId(row.id);
                                movieScreening.setDatetime(new Date(row.datetime));
                                movieScreening.setMovie(movie);

                                movieScreenings.push(movieScreening);
                            });

                            movie.setMovieScreenings(movieScreenings);

                            resolve(movie);
                        }
                    });
                }
            });
        });
    }

    public getAll(): Promise<object[]> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("SELECT id, name, duration FROM movie", (err, res, fields) => {
                if (err) reject(err);
                else {
                    const movies: Array<Movie> = [];

                    res.forEach((row) => {
                        const movie: Movie = new Movie();

                        movie.setId(row.id);
                        movie.setName(row.name);

                        movies.push(movie);

                        ConnectionSingleton.getConnection().query("SELECT id, datetime FROM movieScreening WHERE movieId = ?", [movie.getId()], (err, res, fields) => {
                            if (err) reject(err);
                            else {
                                const movieScreenings: Array<MovieScreening> = [];

                                res.forEach((row) => {
                                    const movieScreening = new MovieScreening();
                                    movieScreening.setId(row.id);
                                    movieScreening.setDatetime(new Date(row.datetime));
                                    movieScreening.setMovie(movie);

                                    movieScreenings.push(movieScreening);
                                });

                                movie.setMovieScreenings(movieScreenings);
                            }
                        });
                    });

                    resolve(movies);
                }
            });
        });
    }
}
