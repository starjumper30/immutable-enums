import { IEnumValue, Enum as TsEnum } from './ts-enums';
export interface EnumValueType {
    new (description: string, values?: {
        [index: string]: any;
    }): IEnumValue;
}
export declare function EnumValue(defaultValues: {
    [index: string]: any;
}, name?: string): EnumValueType;
/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
export declare abstract class Enum<T extends IEnumValue> extends TsEnum<T> {
    /**
     * Set up the enum and close the class.
     *
     * @param name The name that will be used for internal storage - must be unique
     */
    protected initEnum(name: string): void;
}
