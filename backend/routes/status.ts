import { config, env, log, Router } from "../vendor.ts";
env({ export: true });

export const routesStatus = new Router();

/**
 * @apiTitle "Status"
 * @apiPath "/"
 * @apiMethod GET
 * @apiReturn string version "The version of the application"
 * @apiReturn string apiVersion "The version of the API"
 */
routesStatus.get("/", (ctx) => {
    ctx.response.body = JSON.stringify({
        "version": config.version,
        "apiVersion": config.apiVersion,
    });
});