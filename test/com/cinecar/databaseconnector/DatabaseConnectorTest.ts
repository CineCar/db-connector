import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Movie } from "com.cinecar.objects";

function test() {
    let future = new Date();
    future.setDate(30);
    DatabaseConnectorImplementation.getSingleton()
        .filter("datetime", new Date(), future, DatabaseObjectType.MovieScreening)
        .then((obj) => {
            console.log(obj);
        })
        .catch((err) => {
            console.log(err);
        });
}

test();
