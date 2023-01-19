import { config, env, log, Router } from "../vendor.ts";
env({ export: true });
import { authMiddleware } from "../middlewares/auth.ts";

import { Page } from "../models/main.ts";

export const routesPage = new Router();

routesPage.get("/:slug", async (ctx) => {
    let page = await Page.where('slug', ctx.params.slug).get();

    if(page.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = JSON.stringify({
            message: "There is no page with this slug.",
        });
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(Page.sanitize(page[0]));
});

routesPage.post("/:slug", authMiddleware, async (ctx) => {
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
});

routesPage.put("/:slug", authMiddleware, async (ctx) => {
    let data = await ctx.request.body().value;

    let page = await Page.where('slug', ctx.params.slug).get();

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
});

// TODO: Delete

const save = async (page: Page, data: object) => {
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
    } catch(error: Error) {
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