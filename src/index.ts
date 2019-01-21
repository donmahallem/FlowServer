import { FlowApi } from "./flow-api";
import { Config } from "./config";

const a: FlowApi = new FlowApi();

console.log(process.argv);
a.signin(Config.email, Config.password)
    .then((res) => {
        return a.getActivityTimelineForDay(2019, 1, 18);
    })
    .then((res) => {
        console.log("Res", res.statusCode, res.headers);
    })
    .catch(console.error);