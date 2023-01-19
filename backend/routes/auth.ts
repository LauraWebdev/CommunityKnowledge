import { config, env, log, Router, bcrypt, djwt } from "../vendor.ts";
env({ export: true });
import { authMiddleware } from "../middlewares/auth.ts";

import { User } from "../models/main.ts";

export const routesAuth = new Router();

routesAuth.post("/token/create", tokenCreate);
routesAuth.post("/token/verify", tokenVerify);

/**
 * @apiTitle "Token Create"
 * @apiPath "/auth/token/create"
 * @apiMethod POST
 * @apiParam string username
 * @apiParam string password
 */
export async function tokenCreate (ctx) {
    let data = await ctx.request.body().value;

    if(
        data.username === undefined ||
        data.password === undefined
    ) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify({
            message: "Not all required parameters were provided.",
        });
        return;
    }

    let user = await User.where('username', ctx.params.username).get();

    if(user.length == 0) {
        ctx.response.status = 403;
        ctx.response.body = JSON.stringify({
            message: "There is no user with this username.",
        });
        return;
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, user[0].password);
    if(!isPasswordCorrect) {
        ctx.response.status = 403;
        ctx.response.body = JSON.stringify({
            message: "Password was incorrect.",
        });
        return;
    }

    const jwt = await djwt.create(
        { alg: "HS512", typ: "JWT" },
        { id: user[0].id },
        window.jwtKey
    );

    ctx.response.status = 200;
    ctx.response.body = JSON.stringify({
        token: jwt,
        user: User.sanitize(user[0]),
    });
}

/**
 * @apiTitle "Token Verify"
 * @apiPath "/auth/token/verify"
 * @apiMethod POST
 * @apiParam string token
 */
export async function tokenVerify (ctx) {
    let data = await ctx.request.body().value;

    if(
        data.token === undefined
    ) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify({
            message: "Not all required parameters were provided.",
        });
        return;
    }

    let payload;
    try {
        payload = await djwt.verify(
            data.token,
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

    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(User.sanitize(user[0]));
}

routesAuth.get("/me", authMiddleware, async (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(User.sanitize(ctx.request.user));
});