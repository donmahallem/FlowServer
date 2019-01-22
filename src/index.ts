import { FlowApi } from "./flow-api";
import { Config, getConfig } from "./config";
import { FlowApiClient } from "./flow-api-client";

const a: FlowApiClient = new FlowApiClient();

console.log(getConfig());
a.signin(getConfig().email, getConfig().password)
    .then((res) => {
        console.log(res.headers, res.statusCode, res.body);
    })
    .catch((err: Error) => {
        console.error(err);
    })