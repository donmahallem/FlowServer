import { HeartFitServerApp } from "./app";
import { getConfig, IConfig } from "./config";

const config: IConfig = getConfig();

const app: HeartFitServerApp = new HeartFitServerApp(config);
app.start();
