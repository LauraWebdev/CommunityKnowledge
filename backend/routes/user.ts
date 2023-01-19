import { config, env, log, Router, bcrypt } from "../vendor.ts";
env({ export: true });
import { authMiddleware } from "../middlewares/auth.ts";

import { User } from "../models/main.ts";

export const routesUser = new Router();

routesUser.get("/:username", getUser);
routesUser.post("/:username", createUser);
routesUser.put("/:username", authMiddleware, updateUser);

// TODO: Delete
// TODO: Middleware where only Moderators and Users can change User

/**
 * @apiTitle "Get User"
 * @apiPath "/user/:username"
 * @apiMethod GET
 */
async function getUser (ctx) : void {
    let user = await User.where('username', ctx.params.username).get();

    if(user.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = JSON.stringify({
            message: "There is no user with this username.",
        });
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(User.sanitize(user[0]));
}

/**
 * @apiTitle "Create User"
 * @apiPath "/user/:username"
 * @apiMethod POST
 * @apiParam string username
 * @apiParam string password
 */
async function createUser (ctx) : void {
    let data = await ctx.request.body().value;
    data.username = ctx.params.username;

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

    const user = new User();
    const result = await save(user, data);

    ctx.response.status = result.status;
    ctx.response.body = result.body;
}

/**
 * @apiTitle "Update User"
 * @apiPath "/user/:username"
 * @apiMethod PUT
 * @apiParam string username
 * @apiParam string password
 * @apiAuthentication
 */
async function updateUser (ctx) : void {
    let data = await ctx.request.body().value;

    let user = await User.where('username', ctx.params.username).get();

    if(user.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = JSON.stringify({
            message: "There is no user with this username.",
        });
        return;
    }

    const result = await save(user[0], data);

    ctx.response.status = result.status;
    ctx.response.body = result.body;
}

const save = async (user: User, data: object) => {
    try {
        if(data.username !== undefined) user.username = data.username;
        if(data.password !== undefined) user.password = await bcrypt.hash(data.password);

        let resultUser;
        if(user.id === undefined) {
            const result = await user.save();
            resultUser = await User.find(result.lastInsertId);
        } else {
            resultUser = await user.update();
        }

        return {
            status: 200,
            body: JSON.stringify(User.sanitize(resultUser)),
        };
    } catch(error: Error) {
        if(error.message === "Duplicate entry '" + data.username + "' for key 'username'") {
            return {
                status: 409,
                body: JSON.stringify({
                    message: "This username is already in use.",
                }),
            };
        } else {
            log.error(error.message);

            return {
                status: 500,
                body: JSON.stringify({
                    message: "Unknown Server Error",
                }),
            };
        }
    }
}