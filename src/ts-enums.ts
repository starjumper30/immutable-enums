const INITIALIZED: symbol = Symbol();

/**
 * An instance of the enum (for example, if you have an enumeration of seasons,
 * Winter would be an EnumValue.
 */
export abstract class EnumValue {
  private static sizes: Map<Function, number> = new Map<Function, number>();
  private readonly _ordinal: number; // set in Enum.enumValuesFromObject
  private _propName: string; // set in Enum.enumValuesFromObject

  /**
   * `initEnum()` on Enum closes the class, so subsequent calls to this
   * constructor throw an exception.
   */
  constructor(private _description: string) {
    if ({}.hasOwnProperty.call(new.target, INITIALIZED)) {
      throw new Error('EnumValue classes can’t be instantiated individually');
    }
    // keep track of the number of instances that have been created,
    // and use it to set the ordinal
    let size: number | undefined = EnumValue.sizes.get(this.constructor);
    if (!size) {
      size = 0;
    }
    this._ordinal = size;
    size++;
    EnumValue.sizes.set(this.constructor, size);
  }

  /**
   * The description of the instance passed into the constructor - may be the
   * same as the propName.
   *
   * @returns {string} The description
   */
  get description(): string {
    return this._description;
  }

  toString() {
    return `${this.constructor.name}.${this.propName}`;
  }

  /**
   * Returns the index of the instance in the enum (0-based)
   *
   * @returns {number} The index of the instance in the enum (0-based)
   */
  get ordinal(): number {
    return this._ordinal;
  }

  /**
   * Returns the property name used for this instance in the Enum.
   *
   * @returns {string} the property name used for this instance in the Enum
   */
  get propName(): string {
    return this._propName;
  }
}

/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
export abstract class Enum<T extends EnumValue> {
  private static enumValues: Map<string, EnumValue[]> = new Map<
    string,
    EnumValue[]
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
  private static initEnum<T extends EnumValue>(
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
  private static enumValuesFromObject<T extends EnumValue>(
    theEnum: Enum<T>
  ): T[] {
    const values: T[] = Object.getOwnPropertyNames(theEnum)
      .filter((propName: string) => theEnum[propName] instanceof EnumValue)
      .map((propName: string) => {
        const enumValue: T = theEnum[propName];
        Object.defineProperty(enumValue, '_propName', {
          value: propName,
          configurable: false,
          writable: false,
          enumerable: true
        });
        Object.freeze(enumValue);
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

  private static values(name: string): EnumValue[] {
    let values: EnumValue[] | undefined = this.enumValues.get(name);
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
