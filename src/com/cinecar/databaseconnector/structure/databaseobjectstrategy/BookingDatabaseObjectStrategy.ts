import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { Booking, Person, Ticket, MovieScreening, Movie } from "com.cinecar.objects";
import { ConnectionSingleton } from "../ConnectionSingleton";

export class BookingDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    public create(object: object): Promise<object> {
        const booking: Booking = <Booking>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO booking (personId, cancelled) VALUES(?, ?)",
                [booking.getPerson().getId(), booking.isCancelled()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        booking.setId(res.insertId);
                        if (booking.getTickets() != null) {
                            const ticketPromises: Array<Promise<void>> = [];
                            booking.getTickets().forEach((ticket) => {
                                ticketPromises.push(
                                    new Promise((resolve, reject) => {
                                        ConnectionSingleton.getConnection().query(
                                            "UPDATE ticket SET bookingId = ? WHERE id = ?",
                                            [booking.getId(), ticket.getId()],
                                            (err, res, fields) => {
                                                if (err) reject();
                                                else resolve();
                                            }
                                        );
                                    })
                                );
                            });

                            Promise.all(ticketPromises).then(() => {
                                resolve(booking);
                            });
                        } else resolve(booking);
                    }
                }
            );
        });
    }

    public update(object: object): Promise<object> {
        const booking: Booking = <Booking>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "UPDATE booking SET personId = ?, cancelled = ? WHERE id = ?",
                [booking.getPerson().getId(), booking.isCancelled(), booking.getId()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else resolve(booking);
                }
            );
        });
    }

    public delete(id: number): Promise<void> {
        throw new Error("Method not allow.");
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT b.id AS id, cancelled, personId, firstname, lastname FROM booking b INNER JOIN person p ON b.personId = p.id WHERE b.id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const booking: Booking = new Booking();

                        booking.setCancelled(res[0].cancelled);

                        const person = new Person();
                        person.setFirstname(res[0].firstname);
                        person.setLastname(res[0].lastname);
                        booking.setPerson(person);

                        ConnectionSingleton.getConnection().query(
                            "SELECT t.id AS id, movieScreeningId, movieId, datetime, name, duration, price, imageUrl FROM ticket t INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id WHERE t.bookingId = ?",
                            [id],
                            (err, res, fields) => {
                                if (err) reject();
                                else {
                                    const tickets: Array<Ticket> = [];
                                    res.forEach((row) => {
                                        const ticket: Ticket = new Ticket();

                                        ticket.setId(row.id);
                                        ticket.setBooking(booking);
                                        const movieScreening: MovieScreening = new MovieScreening();
                                        const movie: Movie = new Movie();

                                        movie.setId(row.movieId);
                                        movie.setDuration(row.duration);
                                        movie.setName(row.name);
                                        movie.setPrice(row.price);
                                        movie.setImageUrl(row.imageUrl);

                                        movieScreening.setMovie(movie);
                                        movieScreening.setDatetime(new Date(row.datetime));
                                        movieScreening.setId(row.movieScreeningId);

                                        ticket.setMovieScreening(movieScreening);

                                        tickets.push(ticket);
                                    });

                                    booking.setTickets(tickets);

                                    resolve(booking);
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
                "SELECT b.id AS id, cancelled, personId, firstname, lastname FROM booking b INNER JOIN person p ON b.personId = p.id",
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const promises: Array<Promise<Booking>> = [];

                        res.forEach((row) => {
                            promises.push(
                                new Promise((resolve, reject) => {
                                    const booking: Booking = new Booking();

                                    booking.setCancelled(row.cancelled);

                                    const person = new Person();
                                    person.setFirstname(row.firstname);
                                    person.setLastname(row.lastname);
                                    booking.setPerson(person);

                                    ConnectionSingleton.getConnection().query(
                                        "SELECT t.id AS id, movieScreeningId, movieId, datetime, name, duration, price, imageUrl FROM ticket t INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id WHERE t.bookingId = ?",
                                        [booking.getId()],
                                        (err, res, fields) => {
                                            if (err) reject();
                                            else {
                                                const tickets: Array<Ticket> = [];

                                                res.forEach((row) => {
                                                    const ticket: Ticket = new Ticket();

                                                    ticket.setId(row.id);
                                                    ticket.setBooking(booking);
                                                    const movieScreening: MovieScreening = new MovieScreening();
                                                    const movie: Movie = new Movie();

                                                    movie.setId(row.movieId);
                                                    movie.setDuration(row.duration);
                                                    movie.setName(row.name);
                                                    movie.setPrice(row.price);
                                                    movie.setImageUrl(row.imageUrl);

                                                    movieScreening.setMovie(movie);
                                                    movieScreening.setDatetime(new Date(row.datetime));
                                                    movieScreening.setId(row.movieScreeningId);

                                                    ticket.setMovieScreening(movieScreening);

                                                    tickets.push(ticket);
                                                });

                                                booking.setTickets(tickets);

                                                resolve(booking);
                                            }
                                        }
                                    );
                                })
                            );
                        });

                        Promise.all(promises)
                            .then((bookings: Array<Booking>) => {
                                resolve(bookings);
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
