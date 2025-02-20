import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { Ticket, Booking, Person, MovieScreening, Movie } from "com.cinecar.objects";
import { ConnectionSingleton } from "../ConnectionSingleton";
export class TicketDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    public create(object: object): Promise<object> {
        const ticket: Ticket = <Ticket>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO ticket (movieScreeningId) VALUES(?)",
                [ticket.getMovieScreening().getId()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        this.get(res.insertId).then((ticket: Ticket) => {
                            resolve(ticket);
                        });
                    }
                }
            );
        });
    }

    public update(object: object): Promise<object> {
        throw new Error("Not applicable");
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("DELETE FROM ticket WHERE id = ?", [id], (err, res, fields) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT t.id AS id, movieScreeningId, datetime, movieId, name, duration, price, imageUrl, bookingId, cancelled, personId, firstname, lastname FROM ticket t INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id LEFT JOIN booking b ON t.bookingId = b.id LEFT JOIN person p ON b.personId = p.id WHERE t.id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const row = res[0];
                        const ticket: Ticket = new Ticket();
                        const booking: Booking = new Booking();
                        booking.setId(row.bookingId);
                        booking.setCancelled(row.cancelled);

                        const person: Person = new Person();
                        person.setId(row.personId);
                        person.setFirstname(row.firstname);
                        person.setLastname(row.lastname);

                        booking.setPerson(person);
                        ticket.setBooking(booking);

                        const movieScreening: MovieScreening = new MovieScreening();
                        movieScreening.setDatetime(new Date(row.datetime));
                        movieScreening.setId(row.movieScreeningId);

                        const movie: Movie = new Movie();
                        movie.setId(row.movieId);
                        movie.setDuration(row.duration);
                        movie.setName(row.name);
                        movie.setPrice(row.price);
                        movie.setImageUrl(row.imageUrl);

                        movieScreening.setMovie(movie);

                        ticket.setId(row.id);
                        ticket.setMovieScreening(movieScreening);

                        resolve(ticket);
                    }
                }
            );
        });
    }

    public getAll(): Promise<object[]> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT t.id AS id, movieScreeningId, datetime, movieId, name, duration, price, imageUrl, bookingId, cancelled, personId, firstname, lastname FROM ticket t INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id LEFT JOIN booking b ON t.bookingId = b.id LEFT JOIN person p ON b.personId = p.id",
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        const tickets: Array<Ticket> = [];
                        res.forEach((row) => {
                            const ticket: Ticket = new Ticket();
                            const booking: Booking = new Booking();
                            booking.setId(row.bookingId);
                            booking.setCancelled(row.cancelled);

                            const person: Person = new Person();
                            person.setId(row.personId);
                            person.setFirstname(row.firstname);
                            person.setLastname(row.lastname);

                            booking.setPerson(person);
                            ticket.setBooking(booking);

                            const movieScreening: MovieScreening = new MovieScreening();
                            movieScreening.setDatetime(new Date(row.datetime));
                            movieScreening.setId(row.movieScreeningId);

                            const movie: Movie = new Movie();
                            movie.setId(row.movieId);
                            movie.setDuration(row.duration);
                            movie.setName(row.name);
                            movie.setPrice(row.price);
                            movie.setImageUrl(row.imageUrl);

                            movieScreening.setMovie(movie);

                            ticket.setId(row.id);

                            tickets.push(ticket);
                        });

                        resolve(tickets);
                    }
                }
            );
        });
    }
}
