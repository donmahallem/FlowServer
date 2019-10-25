/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import * as jsonschema from "jsonschema";

export const timeValuePair: jsonschema.Schema = {
    type: "object",
    properties: {
        time: {
            type: "integer",
        }, value: {
            type: "number",
        },
    },
};
export const startEndTimePair: jsonschema.Schema = {
    type: "object",
    properties: {
        startTime: {
            type: "integer",
        }, endTime: {
            type: "number",
        },
    },
};

export const activityTimelineIconsSchema: jsonschema.Schema = {
    type: "object",
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
};

export const activityGraphData: jsonschema.Schema = {
    id: "/ActivityGraphData",
    type: "object",
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
            type: "array",
            items: startEndTimePair,
        },
    },
};

export const addressSchema: jsonschema.Schema = {
    id: "/SimpleAddress",
    type: "object",
    patternProperties: {
        // the property name will be passed to new RegExp(prop), so backslashes
        // have to be escaped.
        "^[0-9]{4,4}\-[0-9]{1,2}\-[0-9]{1,2}$": {
            type: "object",
            properties: {
                dataPanelData: {
                    type: "object",
                },
                activityGraphData,
            },
        },
    },
    additionalProperties: false,
};
