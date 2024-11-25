import { isObject } from "class-validator";

export function formatConfigValue(value: any) {
    if (typeof value === 'boolean' || typeof value === 'number') {
        return value.toString();
    }

    if (isObject(value)) {
        return JSON.stringify(value);
    }

    return value;
}