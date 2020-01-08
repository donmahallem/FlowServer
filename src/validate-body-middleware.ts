import { RequestHandler, NextFunction, Request, Response } from "express";
import { Schema, validate, ValidatorResult } from "jsonschema";
import { ServerError } from "./server-error";
export const createValidateBodyMiddleware: (scheme: Schema) => RequestHandler = (scheme: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.body) {
            const result: ValidatorResult = validate(req.body, scheme);
            if (result.valid === true) {
                next();
            } else {
                next(new ServerError(result.errors[0].message, 400));
            }
        } else {
            next(new ServerError("No body provided", 400));
        }
    }
}