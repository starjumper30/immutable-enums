(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.tsEnums = global.tsEnums || {})));
}(this, (function (exports) { 'use strict';

var INITIALIZED = Symbol();
/**
 * An instance of the enum (for example, if you have an enumeration of seasons,
 * Winter would be an EnumValue.
 */
var EnumValue = (function () {
    /**
     * `initEnum()` on Enum closes the class, so subsequent calls to this
     * constructor throw an exception.
     */
    function EnumValue(_description) {
        var _newTarget = this.constructor;
        this._description = _description;
        if ({}.hasOwnProperty.call(_newTarget, INITIALIZED)) {
            throw new Error('EnumValue classes can’t be instantiated individually');
        }
        // keep track of the number of instances that have been created,
        // and use it to set the ordinal
        var size = EnumValue.sizes.get(this.constructor);
        if (!size) {
            size = 0;
        }
        this._ordinal = size;
        size++;
        EnumValue.sizes.set(this.constructor, size);
    }
    Object.defineProperty(EnumValue.prototype, "description", {
        /**
         * The description of the instance passed into the constructor - may be the
         * same as the propName.
         *
         * @returns {string} The description
         */
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    EnumValue.prototype.toString = function () {
        return this.constructor.name + "." + this.propName;
    };
    Object.defineProperty(EnumValue.prototype, "ordinal", {
        /**
         * Returns the index of the instance in the enum (0-based)
         *
         * @returns {number} The index of the instance in the enum (0-based)
         */
        get: function () {
            return this._ordinal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumValue.prototype, "propName", {
        /**
         * Returns the property name used for this instance in the Enum.
         *
         * @returns {string} the property name used for this instance in the Enum
         */
        get: function () {
            return this._propName;
        },
        enumerable: true,
        configurable: true
    });
    EnumValue.sizes = new Map();
    return EnumValue;
}());
/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
var Enum = (function () {
    function Enum() {
    }
    /**
     * Set up the enum and close the class. This must be called after the
     * constructor to set up the logic.
     *
     * @param name The name that will be used for internal storage - must be
     * unique
     * @param theEnum The enum to process
     */
    Enum.initEnum = function (name, theEnum) {
        if (Enum.enumValues.has(theEnum.name)) {
            throw new Error("Duplicate name: " + theEnum.name);
        }
        var enumValues = this.enumValuesFromObject(theEnum);
        Object.freeze(theEnum);
        Enum.enumValues.set(theEnum.name, enumValues);
    };
    /**
     * Extract the enumValues from the Enum. We set the ordinal and propName
     * properties on the EnumValue. We also freeze the objects and lock the Enum
     * and EnumValue to prevent future instantiation.
     *
     * @param theEnum The enum to process
     * @returns {T[]} The array of EnumValues
     */
    Enum.enumValuesFromObject = function (theEnum) {
        var values = Object.getOwnPropertyNames(theEnum)
            .filter(function (propName) { return theEnum[propName] instanceof EnumValue; })
            .map(function (propName) {
            var enumValue = theEnum[propName];
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
        var descriptions = values.map(function (value) { return value.description; });
        if (values.length !== this.unique(descriptions).length) {
            throw new Error('All descriptions must be unique for a given enum type.' +
                ("Instead, there are multiples in " + theEnum.name));
        }
        return values;
    };
    /**
     * Extract the unique values from an array. Based on
     * https://stackoverflow.com/a/23282057.
     */
    Enum.unique = function (values) {
        return values.filter(function (value, i) { return values.indexOf(value) === i; });
    };
    Enum.values = function (name) {
        var values = this.enumValues.get(name);
        return values ? values.slice() : [];
    };
    /**
     * Given the property name of an enum constant, return its value.
     *
     * @param propName The property name to search by
     * @returns {undefined|T} The matching instance
     */
    Enum.prototype.byPropName = function (propName) {
        return this.values.find(function (x) { return x.propName === propName; });
    };
    /**
     * Given the description of an enum constant, return its value.
     *
     * @param description The property name to search by
     * @returns {undefined|T} The matching instance
     */
    Enum.prototype.byDescription = function (description) {
        return this.values.find(function (x) { return x.description === description; });
    };
    Object.defineProperty(Enum.prototype, "values", {
        /**
         * Return a defensively-copied array of all the elements of the enum.
         *
         * @returns {T[]} The array of EnumValues
         */
        get: function () {
            return Enum.values(this.name);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a simple representation of the type.
     *
     * @returns {string} a simple representation of the type
     */
    Enum.prototype.toString = function () {
        return this.name;
    };
    /**
     * Set up the enum and close the class.
     *
     * @param name The name that will be used for internal storage - must be unique
     */
    Enum.prototype.initEnum = function (name) {
        this.name = name;
        Enum.initEnum(name, this);
    };
    Enum.enumValues = new Map();
    return Enum;
}());

exports.EnumValue = EnumValue;
exports.Enum = Enum;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ts-enums.umd.js.map
