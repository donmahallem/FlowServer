
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
            stubInstanceGapi.generateAuthUrl.throws(new Error('test error'));
            let testRequestHandler: express.RequestHandler = testObject.createUrlRequestHandler(<any>stubInstanceGapi);
            expect(testRequestHandler.bind(testRequestHandler, nextSpy, <any>responseSpy, requestSpy)).to.throw(Error, 'test error');
            expect(responseSpy.json.callCount).to.equal(0);
        });
    });
    describe('createAuthRoute(Gapi)', () => {

        let routerStub: sinon.SinonStub;
        let postSpy, getSpy: sinon.SinonSpy;
        let createPostCodeRequestHandlerStub,
            createUrlRequestHandlerStub: sinon.SinonStub;
        before(() => {
            routerStub = sinon.stub(express, 'Router');
            createPostCodeRequestHandlerStub = sinon.stub(testObject, 'createPostCodeRequestHandler');
            createUrlRequestHandlerStub = sinon.stub(testObject, 'createUrlRequestHandler');
        });

        beforeEach(() => {
            postSpy = sinon.spy();
            getSpy = sinon.spy();
            routerStub.returns({
                post: postSpy,
                get: getSpy
            });
        });

        afterEach(() => {
            routerStub.reset();
            createPostCodeRequestHandlerStub.reset();
            createUrlRequestHandlerStub.reset();
        });
        after(() => {
            routerStub.restore();
            createPostCodeRequestHandlerStub.restore();
            createUrlRequestHandlerStub.restore();
        });
        it('should create the router correctly', () => {
            const testGapi: any = { test: 'object' };
            const createPostCodeResponse: any = {
                test: 1,
                test2: '1299'
            };
            const createUrlResponse: any = {
                test: 1,
                test2: '1299',
                test3: 29
            };
            expect(createUrlResponse).to.not.equal(createPostCodeResponse);
            createPostCodeRequestHandlerStub.returns(createPostCodeResponse);
            createUrlRequestHandlerStub.returns(createUrlResponse);
            const resultingRoute: express.Router = testObject.createAuthRoute(testGapi);
            expect(postSpy.callCount).to.equal(1);
            expect(getSpy.callCount).to.equal(1);
            expect(getSpy.getCall(0).args).to.deep.equal(['/url', createUrlResponse]);
            expect(postSpy.getCall(0).args).to.deep.equal(['/code', createPostCodeResponse]);
        });
    });
    describe('createPostCodeRequestHandler(Gapi)', () => {
        let testSandbox: sinon.SinonSandbox;
        let gapiStubInstance: sinon.SinonStubbedInstance<Gapi>;
        let nextSpy: sinon.SinonSpy;
        before(() => {
            testSandbox = sinon.createSandbox();
            gapiStubInstance = testSandbox.createStubInstance(Gapi);
            nextSpy = testSandbox.spy();
        });

        afterEach(() => {
            testSandbox.reset();
        });

        after(() => {
            testSandbox.restore();
        });

        it('should not work with failing validator', () => {
            const reqHandler: express.RequestHandler = testObject.createPostCodeRequestHandler(<any>gapiStubInstance);
            const reqObject: any = {
                body: 'no data in body'
            };
            expect(reqHandler(reqObject, null, nextSpy)).to.be.undefined;
            expect(nextSpy.callCount).to.equal(1);
        });
    });
});