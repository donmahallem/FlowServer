/*!
 * Source https://github.com/donmahallem/FlowServer
 */

export class ServerError extends Error {

    public get code() {
        return this.mCode;
    }

    private mCode: number;
    constructor(msg: string, code: number = 500) {
        super(msg);
        this.mCode = code;
    }
}
