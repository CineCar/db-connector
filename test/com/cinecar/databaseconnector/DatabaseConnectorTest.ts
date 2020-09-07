import { DatabaseConnectorImplementation, DatabaseObjectType } from "../../../../src/index";

const databaseConnector = new DatabaseConnectorImplementation();

async function test() {
    try {
        console.log(await databaseConnector.get(1, DatabaseObjectType.Movie));
        console.log(await databaseConnector.get(-1, DatabaseObjectType.Movie));
    } catch (err) {
        console.log("Not found");
    }
}

test();
