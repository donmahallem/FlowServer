/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import * as jsonschema from "jsonschema";

export const timeValuePair: jsonschema.Schema = {
    properties: {
        time: {
            type: "integer",
        }, value: {
            type: "number",
        },
    },
    type: "object",
};
export const startEndTimePair: jsonschema.Schema = {
    properties: {
        endTime: {
            type: "number",
        },
        startTime: {
            type: "integer",
        },
    },
    type: "object",
};

export const activityTimelineIconsSchema: jsonschema.Schema = {
    properties: {
        activityTimelineIconType: {
            type: "string",
        },
        distance: {
            type: "integer",
        },
        duration: {
            type: "integer",
        },
        kiloCalories: {
            type: "integer",
        },
        localTime: {
            type: "integer",
        },
        sleepPlus: {
            type: "boolean",
        },
        sportName: {
            type: "string",
        },
        url: {
            type: "string",
        },
    },
    type: "object",
};

export const activityGraphData: jsonschema.Schema = {
    id: "/ActivityGraphData",
    properties: {
        activityTimelineIcons: {
            items: activityTimelineIconsSchema,
            type: "array",
        },
        activityTimelineSamples: {
            items: timeValuePair,
            type: "array",
        },
        activityZoneLimits: {
            items: {
                type: "number",
            },
            maxItems: 7,
            minItems: 1,
            type: "array",
        },
        heartRateSummary: {
            properties: {
                dayMaximum: { type: "number" },
                dayMaximumDateTime: { type: "number" },
                dayMinimum: { type: "number" },
                dayMinimumDateTime: { type: "number" },
                nightMinimum: { type: "number" },
                nightMinimumDateTime: { type: "number" },
            },
            type: "object",
        },
        heartRateTimelineSamples: {
            items: timeValuePair,
            type: "array",
        },
        highSessionTimelineList: { type: "array" },
        lastSync: { type: "number" },
        trainingTimelineList: {
            items: startEndTimePair,
            type: "array",
        },
    },
    type: "object",
};

export const addressSchema: jsonschema.Schema = {
    additionalProperties: false,
    id: "/SimpleAddress",
    patternProperties: {
        // the property name will be passed to new RegExp(prop), so backslashes
        // have to be escaped.
        "^[0-9]{4,4}\-[0-9]{1,2}\-[0-9]{1,2}$": {
            properties: {
                activityGraphData,
                dataPanelData: {
                    type: "object",
                },
            },
            type: "object",
        },
    }, type: "object",
};
