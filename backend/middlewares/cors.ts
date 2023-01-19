import { config, Middleware } from "../vendor.ts";

const corsMiddleware: Middleware = async (ctx, next) => {
    await next();
    ctx.response.headers.set("Access-Control-Allow-Origin", config.cors.origin);
};

export {
    corsMiddleware
}