import {config, env, log } from "../vendor.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";
env({ export: true });

log.branding();

log.info("Generating documentation...");
await generateDocumentation();

function extractApiComments (fileContent: string): object {
    let output = [];

    let comments = fileContent.match(/(\/\*\*[\s\S]*?\*\/)|(\/\/.*$)/gm);
    if(comments === null) return null;
    comments.forEach( comment => {
        let outputComment = {};
        outputComment.params = [];
        outputComment.returns = [];
        outputComment.needsAuthentification = false;

        let annotations = comment.match(/@([a-zA-Z]+)[\s]([^@\n\r]*)/g);
        if(annotations === null) return null;
        annotations.forEach( annotation => {
            let parts = annotation.match(/(".*?"|[^"\s]+)/g);
            let command = parts[0].replace("@api", "");
            let values = ([x, ...parts]) => parts;

            switch(command) {
                case "Title":
                    outputComment.title = parts[1].replaceAll("\"", "");
                    break;
                case "Path":
                    outputComment.path = parts[1].replaceAll("\"", "");
                    break;
                case "Method":
                    outputComment.method = parts[1].replaceAll("\"", "");
                    break;
                case "Authentication":
                    outputComment.needsAuthentification = true;
                    break;
                case "Param":
                    outputComment.params.push({
                        type: parts[1],
                        name: parts[2],
                        required: (parts[3] === "true"),
                        description: parts[4]?.replaceAll("\"", ""),
                    });
                    break;
                case "Return":
                    outputComment.returns.push({
                        type: parts[1],
                        name: parts[2],
                        description: parts[3]?.replaceAll("\"", ""),
                    });
                    break;
            }
        });

        output.push(outputComment);
    });

    return output;
}

async function generatePage (pathToFile: string) : void {
    const basename = path.basename(pathToFile).replace(".ts", "");

    log.hint(`File: ${basename}.md`);
    const text = await Deno.readTextFile(pathToFile);

    log.info("Extracting annotations...");
    const apiData = extractApiComments(text);

    if(apiData === null) {
        log.info("File has no annotations...");
        return;
    }

    log.info("Generating page...");
    let output = '';

    output += `# CommunityKnowledge API Documentation\n`;
    output += `## ${basename}\n`;

    output += `[Back to overview](README.md)\n`;

    apiData.forEach(apiCall => {
        output += `\n### ${apiCall.title}\n`;
        output += `**[${apiCall.method}]** /api${apiCall.path}\n\n`;

        if(apiCall.needsAuthentification) {
            output += `**AUTH REQUIRED** This api call needs authentification. Generate a token via /auth/token/create and send it via the Authorization header.\n\n`;
        }

        if(apiCall.params.length > 0) {
            output += `#### Parameters\n`;

            output += `| Name | Type | Required | Description |\n`;
            output += `| --- | --- | --- | --- |\n`;
            apiCall.params.forEach(parameter => {
                output += `| ${parameter.name} | ${parameter.type} | ${parameter.required ? "&check;" : "&cross;"} | ${parameter.description ?? ""} |\n`;
            });
        }

        if(apiCall.returns.length > 0) {
            output += `#### Returns\n`;

            output += `| Name | Type | Description |\n`;
            output += `| --- | --- | --- |\n`;
            apiCall.returns.forEach(returnItem => {
                output += `| ${returnItem.name} | ${returnItem.type} | ${returnItem.description ?? ""} |\n`;
            });
        }
    });

    log.info("Writing file...");
    await Deno.writeTextFile(`./docs/${basename}.md`, output);
}

async function generateReadme (files: string[]) : void {
    log.hint(`File: README.md`);

    log.info("Generating page...");
    let output = '';

    output += `# CommunityKnowledge API Documentation\n`;
    output += `## Overview\n`;

    for(const file: string of files) {
        const basename = path.basename(file).replace(".ts", "");

        output += `- [${basename}](${basename}.md)\n`;
    }

    log.info("Writing file...");
    await Deno.writeTextFile(`./docs/README.md`, output);
}

async function generateDocumentation () : void {
    let files = [];

    for await (const entry of walk("./routes/")) {
        if(entry.isFile) {
            files.push(entry.path);
        }
    }

    for (const file: string of files) {
        await generatePage(file);
    }

    await generateReadme(files);
}

Deno.exit(5);