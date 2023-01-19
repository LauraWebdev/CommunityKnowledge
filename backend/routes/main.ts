import { config, env, log, Router } from "../vendor.ts";
env({ export: true });

export const routesStatus = new Router();

routesStatus.get("/", (ctx) => {
    ctx.response.body = JSON.stringify({
        "version": config.version,
        "apiVersion": config.apiVersion,
    });
});