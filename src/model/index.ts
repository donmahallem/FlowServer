/*!
 * Source https://github.com/donmahallem/FlowServer
 */

export interface IDaySummary {

    [key: string]: IDayData;
}
export interface IMiniGraphData {
    calorieReportUrl: string;
    dailyGoalReportUrl: string;
    data: {
        calories: ITimeValuePair;
        dailyGoal: ITimeValuePair;
        date: number;
        distance: ITimeValuePair;
        nightLowHr: ITimeValuePair;
        sleepAverage: ITimeValuePair;
        sleepPlus: boolean;
    };
    distanceReportUrl: string;
    sampleDate: number;
    sleepAvgReportUrl: string;
}
export interface IDayData {
    activityGraphData: IActivityGraphData;
    miniGraphData: IMiniGraphData;
}
export interface IActivityGraphData {
    heartRateTimelineSamples: ITimeValuePair[];
    heartRateSummary: IHeartRateSummary;
    activityZoneLimits: number[];
    activityTimelineSamples: ITimeValuePair[];
}

export interface ITimeValuePair {
    time: number;
    value: number;
}

export interface IHeartRateSummary {
    dayMaximum: number;
    dayMaximumDateTime: number;
    dayMinimum: number;
    dayMinimumDateTime: number;
    nightMinimum: number;
    nightMinimumDateTime: number;
}
