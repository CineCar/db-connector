import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Movie, MovieScreening, Ticket } from "com.cinecar.objects";

function test() {
    const movieScreening = new MovieScreening();

    const ticket: Ticket = new Ticket();
    movieScreening.setId(1);
    ticket.setRow(1);
    ticket.setMovieScreening(movieScreening);

    DatabaseConnectorImplementation.getSingleton()
        .create(ticket, DatabaseObjectType.Ticket)
        .then((obj) => {
            console.log(obj);
        })
        .catch((err) => {
            console.log(err);
        });
}

test();
