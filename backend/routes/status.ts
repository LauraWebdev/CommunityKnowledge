import { config, env, log, Router, type Context } from "../vendor.ts";
env({ export: true });

export const routesStatus = new Router();

routesStatus.get("/", getStatus);

/**
 * @apiTitle "Status"
 * @apiPath "/"
 * @apiMethod GET
 * @apiReturn string version "The version of the application"
 * @apiReturn string apiVersion "The version of the API"
 */
function getStatus (ctx: Context) : void {
    ctx.response.body = JSON.stringify({
        "version": config.version,
        "apiVersion": config.apiVersion,
    });
}