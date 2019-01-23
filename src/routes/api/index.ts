import * as express from 'express';
import { flowApiRoute } from './flow';
const _apiRoute: express.Router = express.Router({
    caseSensitive: true
});
_apiRoute.use("/flow", flowApiRoute)

export const apiRoute = _apiRoute;