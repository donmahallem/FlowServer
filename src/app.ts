import { IConfig } from "./config";

export class HeartFitServerApp {

    private readonly mConfig: IConfig;
    public constructor(config: IConfig) {
        this.mConfig = config;
    }

    public start(): void {

    }
}