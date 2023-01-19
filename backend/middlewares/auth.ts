import { config, log, Middleware, djwt } from "../vendor.ts";
import {User} from "../models/user.ts";

const authMiddleware: Middleware = async (ctx, next) => {
    const auth = ctx.request.headers.get('Authorization') ?? '';
    const matches = /Bearer\s*(.*)/.exec(auth);
    let jwt;

    if(matches === null) {
        ctx.response.status = 403;
        ctx.response.body = JSON.stringify({
            message: "Unauthenticated.",
        });
        return;
    }

    let payload;
    try {
        payload = await djwt.verify(
            matches[1],
            window.jwtKey
        );
    } catch(error: Error) {
        ctx.response.status = 403;
        ctx.response.body = JSON.stringify({
            message: "Token is incorrect.",
        });
        return;
    }

    let user = await User.where('id', payload.id).get();

    if(user.length == 0) {
        ctx.response.status = 403;
        ctx.response.body = JSON.stringify({
            message: "User does not exist.",
        });
        return;
    }

    ctx.request.user = user[0];

    await next();
};

export {
    authMiddleware
}