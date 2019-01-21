
import { Config } from "./config";
import * as cookieParser from "set-cookie-parser";
import * as FormData from "form-data";
import * as querystring from "querystring";
import * as request from "request";
import * as requestDebug from "request-debug";
import { Agent } from "https";


export class FlowApi {
    private cookieJar2: request.CookieJar = request.jar();
    private readonly baseUrl: string = "https://flow.polar.com";


    public getJar(): request.CookieJar {
        return this.cookieJar2;
    }

    /**
     * 
     * @param mail The mail used to login to flow.polar.com
     * @param password the password used to login to flow.polar.com
     */
    public signin(mail: string, password: string): Promise<request.Response> {
        const data: any = {
            returnUrl: "/",
            email: mail,
            password: password
        };
        return new Promise((resolve, reject) => {
            request.post('https://flow.polar.com/login', {
                form: data,
                jar: this.cookieJar2,
                headers: {
                    //'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    //'content-length': querystring.stringify(data).length,
                    'user-agent': 'Mozilla/5.0'
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(httpResponse);
                }
            })
        });

    }


    public getActivityTimelineForDay(year: number, month: number, day: number, sampleCount: number = 50000): Promise<request.Response> {
        if (month < 1 || month > 12) {
            return Promise.reject(new Error("The month must be equal to or between 1 and 12"));
        }
        if (day < 1 || day > 31) {
            return Promise.reject(new Error("The day must be equal to or between 1 and 31"));
        }
        if (sampleCount < 1) {
            return Promise.reject(new Error("Samplecount must be atleast 1"));
        }
        const _year: string = "" + year;
        const _month: string = (month < 10) ? ("0" + month) : ("" + month);
        const _day: string = (day < 10) ? ("0" + day) : ("" + day);
        return new Promise((resolve, reject) => {
            request.get('https://flow.polar.com/api/activity-timeline/load?day=' + _year + '-' + _month + '-' + _day + '&maxSampleCount=' + sampleCount, {
                jar: this.cookieJar2,
                headers: {
                    //'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    //'content-length': querystring.stringify(data).length,
                    'user-agent': 'Mozilla/5.0'
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(httpResponse);
                }
            })
        });

    }
}