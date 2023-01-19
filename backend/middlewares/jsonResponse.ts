import { Middleware } from "../vendor.ts";

const jsonResponseMiddleware: Middleware = async (ctx, next) => {
    await next();
    ctx.response.headers.set("Content-Type", "application/json");
};

export {
    jsonResponseMiddleware
}