import {config, env, log, prompt, Confirm, MySQLConnector, Database} from "../vendor.ts";
env({ export: true });

import {Page, User} from "../models/main.ts";

log.branding();

log.warn("This action recreates the database. This action can not be undone!");

if(!Deno.args.includes("-y")) {
    const result = await prompt([{
        name: "confirm",
        message: "Do you want to proceed?",
        type: Confirm,
    }]);

    if (!result.confirm) {
        log.info("Action was not confirmed. Goodbye!");
        Deno.exit(5);
    }
}

log.info("Connecting to database...");

const connector = new MySQLConnector({
    host: Deno.env.get('DATABASE_HOST'),
    username: Deno.env.get('DATABASE_USER'),
    password: Deno.env.get('DATABASE_PASSWORD'),
    database: Deno.env.get('DATABASE_DATABASE'),
    logger: false,
});

const db = new Database(connector);

db.link([
    Page,
    User
]);

log.info("Synchronizing tables...");

await db.sync({ drop: true });

Deno.exit(5);