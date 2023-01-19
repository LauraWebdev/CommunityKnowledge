import { white, yellow, red, green, cyan, gray } from "https://deno.land/std@0.157.0/fmt/colors.ts";

function branding(): void {
    clear();
    line();
    hint("CommunityKnowledge Version 1.0.0", false);
    line();
}

function clear(): void {
    console.clear();
}

function line(): void {
    sendLog(white("----------------------------------------"));
}

function space(height: number): void {
    for(let i: number = 0; i < height; i++) {
        sendLog(" ");
    }
}

function hint(message: string, showIdentifier: boolean = true): void {
    let identifier: string = showIdentifier ? gray("[HINT] ") : "";
    sendLog(identifier + cyan(message.toString()));
}

function info(message: string, showIdentifier: boolean = true): void {
    let identifier: string = showIdentifier ? gray("[INFO] ") : "";
    sendLog(identifier + white(message.toString()));
}

function warn(message: string, showIdentifier: boolean = true): void {
    let identifier: string = showIdentifier ? gray("[WARN] ") : "";
    sendLog(identifier + yellow(message.toString()));
}

function error(message: string, showIdentifier: boolean = true): void {
    let identifier: string = showIdentifier ? gray("[ERROR] ") : "";
    sendLog(identifier + red(message.toString()));
}

function success(message: string, showIdentifier: boolean = true): void {
    let identifier: string = showIdentifier ? gray("[SUCCESS] ") : "";
    sendLog(identifier + green(message.toString()));
}

function sendLog(logMessage: string): void {
    // TODO: Write to file if file logging is active
    console.log(logMessage);
}

export {
    branding,
    clear,
    line,
    space,
    hint,
    info,
    warn,
    error,
    success,
};