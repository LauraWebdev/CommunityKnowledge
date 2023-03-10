import {config, env, log, Router, type Context} from "../vendor.ts";
env({ export: true });
import { authMiddleware } from "../middlewares/auth.ts";

import { Page } from "../models/main.ts";

export const routesPage = new Router();

routesPage.get("/:slug", getPage);
routesPage.post("/:slug", authMiddleware, createPage);
routesPage.put("/:slug", authMiddleware, updatePage);

// TODO: Delete

/**
 * @apiTitle "Get Page"
 * @apiPath "/page/:slug"
 * @apiMethod GET
 * @apiReturn string slug
 * @apiReturn string title
 * @apiReturn json content
 * @apiReturn datetime createdAt
 * @apiReturn datetime updatedAt
 */
async function getPage (ctx: Context) : Promise<void> {
    const page = await Page.where('slug', ctx.params.slug).get();

    if(page.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = JSON.stringify({
            message: "There is no page with this slug.",
        });
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(Page.sanitize(page[0]));
}

/**
 * @apiTitle "Create Page"
 * @apiPath "/page/:slug"
 * @apiMethod POST
 * @apiParam string title true
 * @apiParam json content false "A json array of page blocks"
 * @apiReturn string slug
 * @apiReturn string title
 * @apiReturn json content
 * @apiReturn datetime createdAt
 * @apiReturn datetime updatedAt
 * @apiAuthentication
 */
async function createPage (ctx: Context) : Promise<void> {
    let data = await ctx.request.body().value;
    data.slug = ctx.params.slug;

    if(
        data.title === undefined
    ) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify({
            message: "Not all required parameters were provided.",
        });
        return;
    }

    const page = new Page();
    const result = await save(page, data);

    ctx.response.status = result.status;
    ctx.response.body = result.body;
}

/**
 * @apiTitle "Update Page"
 * @apiPath "/page/:slug"
 * @apiMethod PUT
 * @apiParam string title false "The new title of the page"
 * @apiParam string slug false "The new url slug of the page"
 * @apiParam json content false "A json array of page blocks"
 * @apiReturn string slug
 * @apiReturn string title
 * @apiReturn json content
 * @apiReturn datetime createdAt
 * @apiReturn datetime updatedAt
 * @apiAuthentication
 */
async function updatePage (ctx: Context) : Promise<void> {
    const data = await ctx.request.body().value;
    const page = await Page.where('slug', ctx.params.slug).get();

    if(page.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = JSON.stringify({
            message: "There is no page with this slug.",
        });
        return;
    }

    const result = await save(page[0], data);

    ctx.response.status = result.status;
    ctx.response.body = result.body;
}

const save = async (page: Page, data: any) => {
    try {
        if(data.slug !== undefined) page.slug = data.slug;
        if(data.title !== undefined) page.title = data.title;
        if(data.content !== undefined) page.content = JSON.stringify(data.content);

        let resultPage;
        if(page.id === undefined) {
            const result = await page.save();
            resultPage = await Page.find(result.lastInsertId);
        } else {
            resultPage = await page.update();
        }

        return {
            status: 200,
            body: JSON.stringify(Page.sanitize(resultPage)),
        };
    } catch(error: unknown) {
        if(error.message === "Duplicate entry '" + data.slug + "' for key 'slug'") {
            return {
                status: 409,
                body: JSON.stringify({
                    message: "This slug is already in use.",
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