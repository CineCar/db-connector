import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { Booking, Person, Ticket, MovieScreening, Movie } from "com.cinecar.objects";
import { ConnectionSingleton } from "../ConnectionSingleton";

export class BookingDatabaseObjectStrategy implements DatabaseObjectStrategy {
    public create(object: object): Promise<object> {
        const booking: Booking = <Booking>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("INSERT INTO booking (personId, cancelled) VALUES(?, ?)", [booking.getPerson().getId(), booking.isCancelled()], (err, res, fields) => {
                if (err) reject(err);
                else {
                    if (booking.getTickets() != null) {
                        booking.getTickets().forEach((ticket) => {
                            ConnectionSingleton.getConnection().query("INSERT INTO ticket_to_cart (ticketId, bookingId) VALUES(?, ?)", [ticket.getId(), booking.getId()], (err, res, fields) => {
                                if (err) reject();
                                else resolve(booking);
                            });
                        });
                    } else resolve(booking);
                }
            });
        });
    }

    public update(object: object): Promise<object> {
        const booking: Booking = <Booking>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("UPDATE booking SET personId = ?, cancelled = ? WHERE id = ?", [booking.getPerson().getId(), booking.isCancelled(), booking.getId()], (err, res, fields) => {
                if (err) reject(err);
                else resolve(booking);
            });
        });
    }

    public delete(id: number): Promise<void> {
        throw new Error("Method not allow.");
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("SELECT id, cancelled, personId, firstname, lastname FROM booking b INNER JOIN person p ON b.personId = p.id WHERE b.id = ?", [id], (err, res, fields) => {
                if (err || res.length == 0) reject(err);
                else {
                    const booking: Booking = new Booking();

                    booking.setCancelled(res[0].cancelled);

                    const person = new Person();
                    person.setFirstname(res[0].firstname);
                    person.setLastname(res[0].lastname);
                    booking.setPerson(person);

                    ConnectionSingleton.getConnection().query("SELECT id, row, movieScreeningId, movieId, datetime, name, duration FROM ticket t INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id WHERE t.bookingId = ?", [id], (err, res, fields) => {
                        if (err) reject();
                        else {
                            const tickets: Array<Ticket> = [];
                            res.forEach((row) => {
                                const ticket: Ticket = new Ticket();

                                ticket.setId(row.id);
                                ticket.setBooking(booking);
                                ticket.setRow(row.row);
                                const movieScreening: MovieScreening = new MovieScreening();
                                const movie: Movie = new Movie();

                                movie.setId(row.movieId);
                                movie.setDuration(row.duration);
                                movie.setName(row.name);

                                movieScreening.setMovie(movie);
                                movieScreening.setDatetime(row.datetime);
                                movieScreening.setId(row.movieScreeningId);

                                ticket.setMovieScreening(movieScreening);

                                tickets.push(ticket);
                            });

                            booking.setTickets(tickets);

                            resolve(booking);
                        }
                    });
                }
            });
        });
    }

    public getAll(): Promise<object[]> {
        return new Promise(async (resolve, reject) => {
            await ConnectionSingleton.getConnection().query("SELECT id, cancelled, personId, firstname, lastname FROM booking b INNER JOIN person p ON b.personId = p.id", async (err, res, fields) => {
                if (err) reject(err);
                else {
                    const bookings: Array<Booking> = [];

                    await res.forEach(async (row) => {
                        const booking: Booking = new Booking();

                        booking.setCancelled(row.cancelled);

                        const person = new Person();
                        person.setFirstname(row.firstname);
                        person.setLastname(row.lastname);
                        booking.setPerson(person);

                        await ConnectionSingleton.getConnection().query("SELECT id, row, movieScreeningId, movieId, datetime, name, duration FROM ticket t INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id WHERE t.bookingId = ?", [booking.getId()], (err, res, fields) => {
                            if (err) reject();
                            else {
                                const tickets: Array<Ticket> = [];
                                res.forEach((row) => {
                                    const ticket: Ticket = new Ticket();

                                    ticket.setId(row.id);
                                    ticket.setBooking(booking);
                                    ticket.setRow(row.row);
                                    const movieScreening: MovieScreening = new MovieScreening();
                                    const movie: Movie = new Movie();

                                    movie.setId(row.movieId);
                                    movie.setDuration(row.duration);
                                    movie.setName(row.name);

                                    movieScreening.setMovie(movie);
                                    movieScreening.setDatetime(row.datetime);
                                    movieScreening.setId(row.movieScreeningId);

                                    ticket.setMovieScreening(movieScreening);

                                    tickets.push(ticket);
                                });

                                booking.setTickets(tickets);
                            }
                        });

                        bookings.push(booking);
                    });

                    resolve(bookings);
                }
            });
        });
    }
}
