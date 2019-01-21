import { FlowApi } from "./flow-api";

const a: FlowApi = new FlowApi();
a.signin2()
    .then((res) => {
        console.log("Res", res.statusCode, res.headers);
    })
    .catch(console.error);