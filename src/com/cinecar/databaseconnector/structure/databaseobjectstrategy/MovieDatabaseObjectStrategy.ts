import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "./../ConnectionSingleton";
import { Movie, MovieScreening } from "com.cinecar.objects";

export class MovieDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT id, name, duration, price, imageUrl FROM movie WHERE ?? LIKE ?",
                [attribute, "%" + query + "%"],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const promises: Array<Promise<Movie>> = [];

                        res.forEach((row) => {
                            promises.push(
                                new Promise((resolve, reject) => {
                                    const movie: Movie = new Movie();

                                    movie.setId(row.id);
                                    movie.setName(row.name);
                                    movie.setDuration(row.duration);
                                    movie.setImageUrl(row.imageUrl);
                                    movie.setPrice(row.price);

                                    ConnectionSingleton.getConnection().query(
                                        "SELECT id, datetime FROM movieScreening WHERE movieId = ?",
                                        [movie.getId()],
                                        (err, res, fields) => {
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
                                        }
                                    );
                                })
                            );
                        });

                        Promise.all(promises)
                            .then((movies: Array<Movie>) => {
                                resolve(movies);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                }
            );
        });
    }

    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    public create(object: object): Promise<object> {
        const movie: Movie = <Movie>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO movie (name, duration, price, imageUrl) VALUES(?, ?, ?, ?)",
                [movie.getName(), movie.getDuration(), movie.getPrice(), movie.getImageUrl()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        movie.setId(res.insertId);
                        resolve(movie);
                    }
                }
            );
        });
    }

    public update(object: object): Promise<object> {
        const movie: Movie = <Movie>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "UPDATE movie SET name = ?, duration = ?, price = ?, imageUrl = ? WHERE id = ?",
                [movie.getName(), movie.getDuration(), movie.getId(), movie.getPrice(), movie.getImageUrl()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else resolve(movie);
                }
            );
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
            ConnectionSingleton.getConnection().query(
                "SELECT id, name, duration, price, imageUrl FROM movie WHERE id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const movie: Movie = new Movie();
                        movie.setId(id);
                        movie.setName(res[0].name);
                        movie.setDuration(res[0].duration);
                        movie.setPrice(res[0].price);
                        movie.setImageUrl(res[0].imageUrl);

                        ConnectionSingleton.getConnection().query(
                            "SELECT id, datetime FROM movieScreening WHERE movieId = ?",
                            [id],
                            (err, res, fields) => {
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
                            }
                        );
                    }
                }
            );
        });
    }

    public getAll(): Promise<object[]> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT id, name, duration, price, imageUrl FROM movie",
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const promises: Array<Promise<Movie>> = [];

                        res.forEach((row) => {
                            promises.push(
                                new Promise((resolve, reject) => {
                                    const movie: Movie = new Movie();

                                    movie.setId(row.id);
                                    movie.setName(row.name);
                                    movie.setDuration(row.duration);
                                    movie.setImageUrl(row.imageUrl);
                                    movie.setPrice(row.price);

                                    ConnectionSingleton.getConnection().query(
                                        "SELECT id, datetime FROM movieScreening WHERE movieId = ?",
                                        [movie.getId()],
                                        (err, res, fields) => {
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
                                        }
                                    );
                                })
                            );
                        });

                        Promise.all(promises)
                            .then((movies: Array<Movie>) => {
                                resolve(movies);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                }
            );
        });
    }
}
