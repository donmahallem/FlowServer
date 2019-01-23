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
    email: string;
    password: string;
}

export const getConfig = (): Config => {
    return yargs
        .default({ y: 10 })
        .option('cookiesecret', {
            alias: 's',
            default: createSecret(),
            array: false
        })
        .option('port', {
            alias: 'p',
            default: 4200,
            array: false
        })
        .option('password', {
            alias: 'c',
            default: "",
            array: false
        })
        .option('email', {
            alias: 'e',
            default: "",
            array: false
        })
        .argv;
}