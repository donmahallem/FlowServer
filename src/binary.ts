import { IConfig, getConfig } from "./config";
import { HeartFitServerApp } from "./app";

const config: IConfig = getConfig();

const app: HeartFitServerApp = new HeartFitServerApp(config);
app.start();