export class Config {
    static password: string = "";
    static email: string = "";
}

import * as yargs from 'yargs';
import { randomBytes } from 'crypto';
export const createSecret = (): string => {
    return randomBytes(48).toString("hex");
}

export interface Config {
    cookiesecret: string;
    port: number;
}

export const getConfig = (): Config => {
    return yargs
        .default({ y: 10 })
        .option('cookiesecret', {
            alias: 'c',
            default: createSecret(),
            array: false
        })
        .option('port', {
            alias: 'p',
            default: 4200,
            array: false
        })
        .argv;
}