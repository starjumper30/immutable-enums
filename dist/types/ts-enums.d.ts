/**
 * An instance of the enum (for example, if you have an enumeration of seasons,
 * Winter would be an EnumValue.
 */
export declare abstract class EnumValue {
    private _description;
    private static sizes;
    private readonly _ordinal;
    private _propName;
    /**
     * `initEnum()` on Enum closes the class, so subsequent calls to this
     * constructor throw an exception.
     */
    constructor(_description: string);
    /**
     * The description of the instance passed into the constructor - may be the
     * same as the propName.
     *
     * @returns {string} The description
     */
    readonly description: string;
    toString(): string;
    /**
     * Returns the index of the instance in the enum (0-based)
     *
     * @returns {number} The index of the instance in the enum (0-based)
     */
    readonly ordinal: number;
    /**
     * Returns the property name used for this instance in the Enum.
     *
     * @returns {string} the property name used for this instance in the Enum
     */
    readonly propName: string;
}
/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
export declare abstract class Enum<T extends EnumValue> {
    private static enumValues;
    private name;
    /**
     * Set up the enum and close the class. This must be called after the
     * constructor to set up the logic.
     *
     * @param name The name that will be used for internal storage - must be
     * unique
     * @param theEnum The enum to process
     */
    private static initEnum<T>(name, theEnum);
    /**
     * Extract the enumValues from the Enum. We set the ordinal and propName
     * properties on the EnumValue. We also freeze the objects and lock the Enum
     * and EnumValue to prevent future instantiation.
     *
     * @param theEnum The enum to process
     * @returns {T[]} The array of EnumValues
     */
    private static enumValuesFromObject<T>(theEnum);
    /**
     * Extract the unique values from an array. Based on
     * https://stackoverflow.com/a/23282057.
     */
    private static unique<T>(values);
    private static values(name);
    /**
     * Given the property name of an enum constant, return its value.
     *
     * @param propName The property name to search by
     * @returns {undefined|T} The matching instance
     */
    byPropName(propName: string): T | undefined;
    /**
     * Given the description of an enum constant, return its value.
     *
     * @param description The property name to search by
     * @returns {undefined|T} The matching instance
     */
    byDescription(description: string): T | undefined;
    /**
     * Return a defensively-copied array of all the elements of the enum.
     *
     * @returns {T[]} The array of EnumValues
     */
    readonly values: T[];
    /**
     * Returns a simple representation of the type.
     *
     * @returns {string} a simple representation of the type
     */
    toString(): string;
    /**
     * Set up the enum and close the class.
     *
     * @param name The name that will be used for internal storage - must be unique
     */
    protected initEnum(name: string): void;
}
