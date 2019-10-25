/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import { expect } from "chai";
import * as express from "express";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import "mocha";
import * as sinon from "sinon";
import * as testObject from "./index";

describe("/routes/api/index.ts", () => {
    describe("createErrorHandler()", () => {
        it("createErrorHandler()", () => {
            const handler: express.ErrorRequestHandler = testObject.createErrorHandler();
            const resSpies: {
                status: sinon.SinonStub,
                json: sinon.SinonSpy,
            } = {
                status: sinon.stub(),
                json: sinon.spy(),
            };
            resSpies.status.callsFake(() =>
                resSpies);
            const nextSpy: sinon.SinonSpy = sinon.spy();
            handler(null, null, resSpies as any, nextSpy);
            expect(resSpies.status.callCount).to.equal(1);
            expect(resSpies.status.getCall(0).args).to.deep.equal([500]);
            expect(resSpies.json.callCount).to.equal(1);
            expect(resSpies.json.getCall(0).args).to.deep.equal([{
                error: "Server Error occured",
            }]);
        });
    });
});
