export class ServerError extends Error {

    public get code() {
        return this._code;
    }

    private _code: number;
    constructor(msg: string, code: number = 500) {
        super(msg);
        this._code = code;
    }
}