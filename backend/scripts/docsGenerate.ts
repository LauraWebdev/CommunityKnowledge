import {config, env, log } from "../vendor.ts";
import * as path from "https://deno.land/std/path/mod.ts";
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
                case "Param":
                    outputComment.params.push({
                        type: parts[1],
                        name: parts[2],
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
        output += `#### Parameters\n`;

        output += `| Name | Type | Required | Default |\n`;
        output += `| --- | --- | --- | --- |\n`;
        apiCall.params.forEach(parameter => {
            output += `| ${parameter.name} | ${parameter.type} | --- | --- |\n`;
        });
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
    // TODO: Dynamically load this
    const files = [
        "./routes/auth.ts",
        "./routes/main.ts",
        "./routes/page.ts",
        "./routes/user.ts",
    ];

    for (const file: string of files) {
        await generatePage(file);
    }

    await generateReadme(files);
}

Deno.exit(5);