import { DatabaseObjectStrategy } from "../DatabaseObjectStrategy";
import { ConnectionSingleton } from "../ConnectionSingleton";
import { Cart, Person, Ticket, Booking, MovieScreening, Movie } from "com.cinecar.objects";

export class CartDatabaseObjectStrategy implements DatabaseObjectStrategy {
    search(attribute: string, query: string): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }
    filter(attribute: string, start: any, end: any): Promise<Array<object>> {
        throw new Error("Method not implemented.");
    }

    public create(object: object): Promise<object> {
        const cart: Cart = <Cart>object;

        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "INSERT INTO cart (creationDate) VALUES(?)",
                [cart.getCreationDate()],
                (err, res, fields) => {
                    if (err) reject(err);
                    else {
                        cart.setId(res.insertId);
                        resolve(cart);
                    }
                }
            );
        });
    }

    public update(object: object): Promise<object> {
        const cart: Cart = <Cart>object;

        return new Promise((resolve, reject) => {
            if (cart.getTickets() != null) {
                const promises: Array<Promise<void>> = [];

                ConnectionSingleton.getConnection().query(
                    "DELETE FROM ticket_to_cart WHERE cartId = ?",
                    [cart.getId()],
                    (err, res, fields) => {
                        cart.getTickets().forEach((ticket) => {
                            promises.push(
                                new Promise((resolve, reject) => {
                                    ConnectionSingleton.getConnection().query(
                                        "INSERT INTO ticket_to_cart (ticketId, cartId) VALUES(?, ?)",
                                        [ticket.getId(), cart.getId()],
                                        (err, res, fields) => {
                                            if (err) reject(err);
                                            else resolve();
                                        }
                                    );
                                })
                            );
                        });

                        Promise.all(promises).then(() => {
                            resolve(cart);
                        });
                    }
                );
            } else reject();
        });
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query("DELETE FROM cart WHERE id = ?", [id], (err, res, fields) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public get(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            ConnectionSingleton.getConnection().query(
                "SELECT id, creationDate FROM cart WHERE id = ?",
                [id],
                (err, res, fields) => {
                    if (err || res.length == 0) reject(err);
                    else {
                        const cart: Cart = new Cart();
                        cart.setId(res[0].id);
                        cart.setCreationDate(new Date(res[0].creationDate));

                        ConnectionSingleton.getConnection().query(
                            "SELECT t.id AS id, movieScreeningId, datetime, movieId, name, duration, price, imageUrl, bookingId, cancelled, personId, firstname, lastname FROM ticket_to_cart ttc INNER JOIN ticket t ON ttc.ticketId = t.id INNER JOIN movieScreening ms ON t.movieScreeningId = ms.id INNER JOIN movie m ON ms.movieId = m.id LEFT JOIN booking b ON t.bookingId = b.id LEFT JOIN person p ON b.personId = p.id WHERE cartId = ?",
                            [id],
                            (err, res, fields) => {
                                if (err) reject(err);
                                else {
                                    const tickets: Array<Ticket> = [];

                                    res.forEach((row) => {
                                        const ticket: Ticket = new Ticket();

                                        if (row.bookingId != null) {
                                            const booking: Booking = new Booking();
                                            booking.setId(row.bookingId);
                                            booking.setCancelled(row.cancelled);

                                            const person: Person = new Person();
                                            person.setId(row.personId);
                                            person.setFirstname(row.firstname);
                                            person.setLastname(row.lastname);

                                            booking.setPerson(person);
                                            ticket.setBooking(booking);
                                        }

                                        const movieScreening: MovieScreening = new MovieScreening();
                                        movieScreening.setDatetime(new Date(row.datetime));
                                        movieScreening.setId(row.movieScreeningId);

                                        const movie: Movie = new Movie();
                                        movie.setId(row.movieId);
                                        movie.setDuration(row.duration);
                                        movie.setName(row.name);
                                        movie.setImageUrl(row.imageUrl);
                                        movie.setPrice(row.price);

                                        movieScreening.setMovie(movie);

                                        ticket.setId(row.id);
                                        ticket.setMovieScreening(movieScreening);

                                        tickets.push(ticket);
                                    });

                                    cart.setTickets(tickets);
                                    resolve(cart);
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    public getAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
}
