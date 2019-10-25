
import { expect } from "chai";
import * as express from "express";
import * as jsonschema from "jsonschema";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import "mocha";
import * as sinon from "sinon";
import { JwtHelper } from "../../../jwt-helper";
import { ServerError } from "../../../server-error";
import * as testObject from "./auth.route";
import { Gapi } from "./gapi";

describe("/routes/api/google/auth.route.ts", () => {
    describe("createUrlRequestHandler(Gapi)", () => {
        let stubInstanceGapi: sinon.SinonStubbedInstance<Gapi>;
        let nextSpy, requestSpy: sinon.SinonSpy;
        let responseSpy: { json: sinon.SinonSpy };

        beforeEach(() => {
            stubInstanceGapi = sinon.createStubInstance(Gapi);
            nextSpy = sinon.spy();
            responseSpy = {
                json: sinon.spy(),
            };
            requestSpy = sinon.spy();
        });
        afterEach(() => {
            expect(stubInstanceGapi.generateAuthUrl.callCount).to.equal(1);
            expect(nextSpy.callCount).to.equal(0);
        });
        it("it should succeed", () => {
            stubInstanceGapi.generateAuthUrl.returns("test");
            const testRequestHandler: express.RequestHandler = testObject.createUrlRequestHandler(stubInstanceGapi as any);
            testRequestHandler(nextSpy, responseSpy as any, requestSpy);
            expect(responseSpy.json.getCall(0).args).to.deep.equal([{
                url: "test",
            }]);
            expect(responseSpy.json.callCount).to.equal(1);
        });
        it("it should fail", () => {
            stubInstanceGapi.generateAuthUrl.throws(new Error("test error"));
            const testRequestHandler: express.RequestHandler = testObject.createUrlRequestHandler(stubInstanceGapi as any);
            expect(testRequestHandler.bind(testRequestHandler, nextSpy, responseSpy as any, requestSpy)).to.throw(Error, "test error");
            expect(responseSpy.json.callCount).to.equal(0);
        });
    });
    describe("createAuthRoute(Gapi)", () => {

        let routerStub: sinon.SinonStub;
        let postSpy, getSpy: sinon.SinonSpy;
        let createPostCodeRequestHandlerStub,
            createUrlRequestHandlerStub: sinon.SinonStub;
        let fakeRouter: any;
        before(() => {
            routerStub = sinon.stub(express, "Router");
            createPostCodeRequestHandlerStub = sinon.stub(testObject, "createPostCodeRequestHandler");
            createUrlRequestHandlerStub = sinon.stub(testObject, "createUrlRequestHandler");
        });

        beforeEach(() => {
            postSpy = sinon.spy();
            getSpy = sinon.spy();
            fakeRouter = {
                post: postSpy,
                get: getSpy,
            };
            routerStub.returns(fakeRouter);
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
        it("should create the router correctly", () => {
            const testGapi: any = { test: "object" };
            const createPostCodeResponse: any = {
                test: 1,
                test2: "1299",
            };
            const createUrlResponse: any = {
                test: 1,
                test2: "1299",
                test3: 29,
            };
            expect(createUrlResponse).to.not.equal(createPostCodeResponse);
            createPostCodeRequestHandlerStub.returns(createPostCodeResponse);
            createUrlRequestHandlerStub.returns(createUrlResponse);
            const resultingRoute: express.Router = testObject.createAuthRoute(testGapi);
            expect(resultingRoute).to.deep.equal(fakeRouter);
            expect(postSpy.callCount).to.equal(1);
            expect(getSpy.callCount).to.equal(1);
            expect(getSpy.getCall(0).args).to.deep.equal(["/url", createUrlResponse]);
            expect(postSpy.getCall(0).args).to.deep.equal(["/code", createPostCodeResponse]);
        });
    });
    describe("createPostCodeRequestHandler(Gapi)", () => {
        let testSandbox: sinon.SinonSandbox;
        let gapiStubInstance: sinon.SinonStubbedInstance<Gapi>;
        let nextSpy: sinon.SinonStub;
        let validatorStubInstance: sinon.SinonStubbedInstance<jsonschema.Validator>;
        let validatorStub: sinon.SinonStub;

        const reqObject: any = {
            body: {
                code: "asdfjas dfjnoaösdjfnmöalsdfjnaösdfjasdf",
            },
        };
        before(() => {
            testSandbox = sinon.createSandbox();
            gapiStubInstance = testSandbox.createStubInstance(Gapi);
            nextSpy = testSandbox.stub();
            validatorStubInstance = testSandbox.createStubInstance(jsonschema.Validator);

        });

        beforeEach(() => {
            validatorStub = testSandbox.stub(jsonschema, "Validator").callsFake((args) =>
                validatorStubInstance);
        });

        afterEach(() => {
            expect(validatorStubInstance.validate.callCount).to.equal(1);
            expect(validatorStubInstance.validate.getCall(0).args).to.deep.equal([reqObject.body, testObject.exchangeCodeSchema]);
            testSandbox.reset();
            validatorStub.restore();
        });

        after(() => {
            testSandbox.restore();
        });
        describe("body validates", () => {
            beforeEach(() => {
                validatorStubInstance.validate.returns({ valid: false } as any);
            });
            it("should not work with failing validator", () => {
                const reqHandler: express.RequestHandler = testObject.createPostCodeRequestHandler(gapiStubInstance as any);
                expect(reqHandler(reqObject, undefined, nextSpy)).to.be.undefined;
                expect(nextSpy.callCount).to.equal(1);
            });
        });
        describe("body does validate", () => {
            let jwtSignStub: sinon.SinonStub;
            const testError: Error = new Error("test error");
            before(() => {
                jwtSignStub = sinon.stub(JwtHelper, "sign");
            });
            beforeEach(() => {
                validatorStubInstance.validate.returns({ valid: true } as any);
            });
            it("should fail on exchangeCode rejection", (done) => {
                const reqHandler: express.RequestHandler = testObject.createPostCodeRequestHandler(gapiStubInstance as any);
                jwtSignStub.rejects(testError);
                gapiStubInstance.exchangeCode.rejects(testError);
                nextSpy.callsFake(() => {
                    expect(gapiStubInstance.exchangeCode.callCount).to.equal(1, "exchangeCode should be called just once");
                    expect(gapiStubInstance.exchangeCode.getCall(0).args).to.deep.equal([reqObject.body.code], "exchangeCode should be called with the requestBody");
                    expect(nextSpy.callCount).to.equal(1, "nextSpy should be called once");
                    expect(jwtSignStub.callCount).to.equal(0, "jwtSign should not be called at all");
                    done();
                });
                expect(reqHandler.bind(reqHandler, reqObject, undefined, nextSpy)).to.not.throw();
            });
            it("should fail on exchangeCode returning non 200 response code", (done) => {
                const reqHandler: express.RequestHandler = testObject.createPostCodeRequestHandler(gapiStubInstance as any);
                jwtSignStub.rejects(testError);
                gapiStubInstance.exchangeCode.resolves({ res: { status: 4923 } } as any);
                nextSpy.callsFake((...args: any) => {
                    expect(args.length).to.equal(1);
                    expect(args[0]).to.be.instanceOf(ServerError);
                    expect(args[0].message).equal("Could not exchange code");
                    expect(args[0].code).equal(4923);
                    expect(gapiStubInstance.exchangeCode.callCount).to.equal(1, "exchangeCode should be called just once");
                    expect(gapiStubInstance.exchangeCode.getCall(0).args).to.deep.equal([reqObject.body.code], "exchangeCode should be called with the requestBody");
                    expect(nextSpy.callCount).to.equal(1, "nextSpy should be called once");
                    expect(jwtSignStub.callCount).to.equal(0, "jwtSign should not be called at all");
                    done();
                });
                expect(reqHandler.bind(reqHandler, reqObject, undefined, nextSpy)).to.not.throw();
            });
            it("should fail on jwtSignFail", (done) => {
                const reqHandler: express.RequestHandler = testObject.createPostCodeRequestHandler(gapiStubInstance as any);
                jwtSignStub.rejects(testError);
                gapiStubInstance.exchangeCode.resolves({ res: { status: 200 } } as any);
                nextSpy.callsFake((...args: any) => {
                    expect(args.length).to.equal(1);
                    expect(args[0]).to.be.instanceOf(Error);
                    expect(args[0].message).equal("test error");
                    expect(gapiStubInstance.exchangeCode.callCount).to.equal(1, "exchangeCode should be called just once");
                    expect(gapiStubInstance.exchangeCode.getCall(0).args).to.deep.equal([reqObject.body.code], "exchangeCode should be called with the requestBody");
                    expect(nextSpy.callCount).to.equal(1, "nextSpy should be called once");
                    expect(jwtSignStub.callCount).to.equal(1, "jwtSign should not be called at all");
                    done();
                });
                expect(reqHandler.bind(reqHandler, reqObject, undefined, nextSpy)).to.not.throw();
            });
            it("should succeed", (done) => {
                const reqHandler: express.RequestHandler = testObject.createPostCodeRequestHandler(gapiStubInstance as any);
                const teststring: string = "jasdfadsjafjaskdfkasnjf aosdfjn aws0irfj 0wru ";
                jwtSignStub.resolves(teststring);
                const testResponse: any = {
                    json: sinon.stub(),
                };
                gapiStubInstance.exchangeCode.resolves({ res: { status: 200 } } as any);
                testResponse.json.callsFake((...args: any) => {
                    expect(args.length).to.equal(1);
                    expect(args).to.deep.equal([{
                        token: teststring,
                    }]);
                    expect(gapiStubInstance.exchangeCode.callCount).to.equal(1, "exchangeCode should be called just once");
                    expect(gapiStubInstance.exchangeCode.getCall(0).args).to.deep.equal([reqObject.body.code], "exchangeCode should be called with the requestBody");
                    done();
                });
                reqHandler(reqObject, testResponse, undefined);
            });
        });
    });
});
