import { config as env } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';
import config from "./config.json" assert { type: "json" };

// Hardcoded api version
config.apiVersion = 1;

export {
    config,
    env,
}