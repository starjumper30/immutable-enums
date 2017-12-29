import {Record} from 'immutable';

const INITIALIZED: symbol = Symbol();

export interface IEnumValue {
  readonly description: string;
  readonly ordinal: number;
  readonly propName: string;
  merge: {(values: {propName: string}): IEnumValue}
}

export interface EnumValueType {
  new (description: string, values?: {[index: string]: any}): IEnumValue;
}

export function EnumValue(defaultValues: {[index: string]: any}, name?: string): EnumValueType {
  let size = 0;
  const allDefaults: any = {
    ordinal:undefined,
    description:undefined,
    propName:undefined,
    isEnumValue:true,
    ...(defaultValues as Object)
  };

  /**
   * `initEnum()` on Enum closes the class, so subsequent calls to this
   * constructor throw an exception.
   */
  class EnumValue extends Record(allDefaults, name) {
    /**
     * The description of the instance passed into the constructor - may be the
     * same as the propName.
     */
    readonly description: string;
    /**
     * The index of the instance in the enum (0-based)
     */
    readonly ordinal: number;

    /**
     * The property name used for this instance in the Enum.
     */
    readonly propName: string;

    readonly merge: {(values: {propName: string}): IEnumValue};

    constructor(description: string, values: {[index: string]: any} = {}) {
      super({...values as Object, description, ordinal: size, isEnumValue:true});
      if (this.constructor.hasOwnProperty(INITIALIZED)) {
        throw new Error('EnumValue classes can’t be instantiated individually');
      }

      // keep track of the number of instances that have been created,
      size++;
    }

    toString() {
      return `${this.constructor.name}.${this.propName}`;
    }
  }

  return EnumValue;
}


/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
export abstract class Enum<T extends IEnumValue> {
  private static enumValues: Map<string, IEnumValue[]> = new Map<
    string,
    IEnumValue[]
    >();
  private name: string;

  /**
   * Set up the enum and close the class. This must be called after the
   * constructor to set up the logic.
   *
   * @param name The name that will be used for internal storage - must be
   * unique
   * @param theEnum The enum to process
   */
  private static initEnum<T extends IEnumValue>(
    name: string,
    theEnum: Enum<T>
  ): void {
    if (Enum.enumValues.has(theEnum.name)) {
      throw new Error(`Duplicate name: ${theEnum.name}`);
    }
    let enumValues: T[] = this.enumValuesFromObject(theEnum);
    Object.freeze(theEnum);
    Enum.enumValues.set(theEnum.name, enumValues);
  }

  /**
   * Extract the enumValues from the Enum. We set the ordinal and propName
   * properties on the EnumValue. We also freeze the objects and lock the Enum
   * and EnumValue to prevent future instantiation.
   *
   * @param theEnum The enum to process
   * @returns {T[]} The array of EnumValues
   */
  private static enumValuesFromObject<T extends IEnumValue>(
    theEnum: Enum<T>
  ): T[] {
    const values: T[] = Object.getOwnPropertyNames(theEnum)
      .filter((propName: string) => theEnum[propName]['isEnumValue'])
      .map((propName: string) => {
        const enumValue: T = theEnum[propName].merge({propName});
        theEnum[propName] = enumValue;
        return enumValue;
      });
    if (values.length) {
      values[0].constructor[INITIALIZED] = true;
    }

    let descriptions: string[] = values.map(
      (value: T): string => value.description
    );
    if (values.length !== this.unique(descriptions).length) {
      throw new Error(
        'All descriptions must be unique for a given enum type.' +
        `Instead, there are multiples in ${theEnum.name}`
      );
    }
    return values;
  }

  /**
   * Extract the unique values from an array. Based on
   * https://stackoverflow.com/a/23282057.
   */
  private static unique<T>(values: T[]): T[] {
    return values.filter((value: T, i: number) => values.indexOf(value) === i);
  }

  private static values(name: string): IEnumValue[] {
    let values: IEnumValue[] | undefined = this.enumValues.get(name);
    return values ? [...values] : [];
  }

  /**
   * Given the property name of an enum constant, return its value.
   *
   * @param propName The property name to search by
   * @returns {undefined|T} The matching instance
   */
  byPropName(propName: string): T | undefined {
    return this.values.find((x: T) => x.propName === propName);
  }

  /**
   * Given the description of an enum constant, return its value.
   *
   * @param description The property name to search by
   * @returns {undefined|T} The matching instance
   */
  byDescription(description: string): T | undefined {
    return this.values.find((x: T) => x.description === description);
  }

  /**
   * Return a defensively-copied array of all the elements of the enum.
   *
   * @returns {T[]} The array of EnumValues
   */
  get values(): T[] {
    return Enum.values(this.name) as T[];
  }

  /**
   * Returns a simple representation of the type.
   *
   * @returns {string} a simple representation of the type
   */
  toString(): string {
    return this.name;
  }

  /**
   * Set up the enum and close the class.
   *
   * @param name The name that will be used for internal storage - must be unique
   */
  protected initEnum(name: string): void {
    this.name = name;
    Enum.initEnum(name, this);
  }
}
