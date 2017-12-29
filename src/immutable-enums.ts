import {Record} from 'immutable';
import {IEnumValue, Enum as TsEnum} from './ts-enums';

export interface EnumValueType {
  new (description: string, values?: {[index: string]: any}): IEnumValue;
}

export function EnumValue(
  defaultValues: {[index: string]: any},
  name?: string
): EnumValueType {
  let size = 0;
  const allDefaults: any = {
    ordinal: undefined,
    description: undefined,
    propName: undefined,
    isEnumValue: true,
    ...defaultValues as Object
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

    constructor(description: string, values: {[index: string]: any} = {}) {
      super({
        ...values as Object,
        description,
        ordinal: size,
        isEnumValue: true
      });
      if (TsEnum.isInitialized(this)) {
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

function isEnumValue(val: any): boolean {
  return val.isEnumValue && val.merge instanceof Function;
}

function mapEnumValue<T extends IEnumValue>(
  theEnum: TsEnum<T>,
  propName: string
): T {
  const enumValue: T = theEnum[propName].merge({propName});
  theEnum[propName] = enumValue;
  return enumValue;
}

/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
export abstract class Enum<T extends IEnumValue> extends TsEnum<T> {
  /**
   * Set up the enum and close the class.
   *
   * @param name The name that will be used for internal storage - must be unique
   */
  protected initEnum(name: string): void {
    super.initEnum(name, isEnumValue, mapEnumValue);
  }
}
