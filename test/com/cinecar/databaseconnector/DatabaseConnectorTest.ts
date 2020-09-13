import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";
import { Cart } from "com.cinecar.objects";

function test() {
    const cart: Cart = new Cart();
    cart.setCreationDate(new Date());

    DatabaseConnectorImplementation.getSingleton()
        .create(cart, DatabaseObjectType.Cart)
        .then((obj: Cart) => {
            console.log(obj);
        })
        .catch((err) => {
            console.log(err);
        });
}

test();
