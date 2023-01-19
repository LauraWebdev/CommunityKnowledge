import {config, env, log, Application, Router, MySQLConnector, Database } from "./vendor.ts";
env({ export: true });

import { routesStatus } from "./routes/status.ts";
import { routesAuth } from "./routes/auth.ts";
import { routesPage } from "./routes/page.ts";
import { routesUser } from "./routes/user.ts";

import {jsonResponseMiddleware} from "./middlewares/jsonResponse.ts";
import {corsMiddleware} from "./middlewares/cors.ts";
import {Page, User} from "./models/main.ts";

log.branding("CommunityKnowledge Version 1.0.0", false);

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

log.info("Setting auth settings..");
const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
);
window.jwtKey = key;

log.info("Starting Server...");

// Setting up server
const app = new Application();
const router = new Router();

// Middlewares
app.use(jsonResponseMiddleware);
app.use(corsMiddleware);

// Routes
router.use("/", routesStatus.routes());
router.use("/auth", routesAuth.routes());
router.use("/page", routesPage.routes());
router.use("/user", routesUser.routes());
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
app.listen({
    hostname: Deno.env.get('SERVER_HOSTNAME'),
    port: Deno.env.get('SERVER_PORT')
});

log.success("Ready on http://" + Deno.env.get('SERVER_HOSTNAME') + ":" + Deno.env.get('SERVER_PORT'));