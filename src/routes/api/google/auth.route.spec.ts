
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import 'mocha';
import * as testObject from './auth.route';
import * as express from 'express';
import * as sinon from 'sinon';
import { Gapi } from './gapi';

describe('/routes/api/google/auth.route.ts', () => {
    describe('createUrlRequestHandler(Gapi)', () => {
        let stubInstanceGapi: sinon.SinonStubbedInstance<Gapi>;
        let nextSpy, requestSpy: sinon.SinonSpy;
        let responseSpy: { json: sinon.SinonSpy };

        beforeEach(() => {
            stubInstanceGapi = sinon.createStubInstance(Gapi);
            nextSpy = sinon.spy();
            responseSpy = {
                json: sinon.spy()
            }
            requestSpy = sinon.spy();
        });
        afterEach(() => {
            expect(stubInstanceGapi.generateAuthUrl.callCount).to.equal(1);
            expect(nextSpy.callCount).to.equal(0);
        });
        it('it should succeed', () => {
            stubInstanceGapi.generateAuthUrl.returns('test');
            let testRequestHandler: express.RequestHandler = testObject.createUrlRequestHandler(<any>stubInstanceGapi);
            testRequestHandler(nextSpy, <any>responseSpy, requestSpy);
            expect(responseSpy.json.getCall(0).args).to.deep.equal([{
                url: 'test'
            }]);
            expect(responseSpy.json.callCount).to.equal(1);
        });
        it('it should fail', () => {
            stubInstanceGapi.generateAuthUrl.throws(new Error("test error"));
            let testRequestHandler: express.RequestHandler = testObject.createUrlRequestHandler(<any>stubInstanceGapi);
            expect(testRequestHandler.bind(testRequestHandler, nextSpy, <any>responseSpy, requestSpy)).to.throw(Error, "test error");
            expect(responseSpy.json.callCount).to.equal(0);
        });
    });
});