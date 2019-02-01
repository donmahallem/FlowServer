
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import 'mocha';
import * as testObject from './index';
import * as express from 'express';
import * as sinon from 'sinon';

describe('/routes/api/index.ts', () => {
    describe('createErrorHandler()', () => {
        it('createErrorHandler()', () => {
            const handler: express.ErrorRequestHandler = testObject.createErrorHandler();
            const resSpies: {
                status: sinon.SinonStub,
                json: sinon.SinonSpy
            } = {
                status: sinon.stub(),
                json: sinon.spy()
            };
            resSpies.status.callsFake(() => {
                return resSpies;
            });
            const nextSpy: sinon.SinonSpy = sinon.spy();
            handler(null, null, <any>resSpies, nextSpy);
            expect(resSpies.status.callCount).to.equal(1);
            expect(resSpies.status.getCall(0).args).to.deep.equal([500]);
            expect(resSpies.json.callCount).to.equal(1);
            expect(resSpies.json.getCall(0).args).to.deep.equal([{
                error: "Server Error occured"
            }]);
        });
    });
});