import { createCipher, createDecipher, Cipher, Decipher } from "crypto";
import { Credentials } from "google-auth-library";
import { decode } from "jsonwebtoken";
import { IConfig } from "../../../config";
export class GapiAuthHelper {
    public static convertCredentialsToToken(creds: Credentials, config: IConfig) {
        return {
            access_token: "",
        };
    }
    public static encryptData(data: string, secret: string) {
        const cipher: Cipher = createCipher("aes-256-cbc", secret);
        cipher.update(data);
        return cipher.final().toString("base64");
    }

    public static decryptData(data: string, secret: string) {
        const decipher: Decipher = createDecipher("aes-256-cbc", secret);
        decipher.update(Buffer.from(data, "base64"));
        return decipher.final().toString("utf-8");
    }
}
