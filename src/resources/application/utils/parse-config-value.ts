import { isBooleanString, isNumberString, isObject } from "class-validator";

export function parseConfigValue(value: string) {
    if (isBooleanString(value)) {
        return value === 'true';
    }

    if (isNumberString(value)) {
        return parseInt(value);
    }

    if (isObject(value)) {
        return JSON.parse(value);
    }

    return value;
}