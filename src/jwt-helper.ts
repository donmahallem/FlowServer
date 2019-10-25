import * as jwt from "jsonwebtoken";
import { Config } from "./config";

export class JwtHelper {

    public static sign(data: string | object): Promise<string> {
        return new Promise((resolve: (value: string) => void, reject: (error: Error) => void) => {
            jwt.sign(data, Config.get().general.jwtSecret, {
                issuer: Config.get().general.host,
            }, (err: Error, encoded: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(encoded);
                }
            });
        });
    }

    public static verify<T>(token: string): Promise<T> {
        return new Promise((resolve: (value: T) => void, reject: (error: Error) => void) => {
            jwt.verify(token, Config.get().general.jwtSecret, {
                issuer: Config.get().general.host,
            }, (err: Error, encoded: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(encoded);
                }
            });
        });
    }
}
