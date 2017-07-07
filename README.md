# Ts-Enums

A TypeScript library for enums, inspired by Java enums and forked from [Enumify](https://github.com/rauschma/enumify).

## Motivation

Dr. Axel Rauschmeyer created [Enumify](https://github.com/rauschma/enumify) to bring an analogue of Java's Enums to JavaScript. In a [blog post](http://2ality.com/2016/01/enumify.html), he explained why a naive implementation of enums in JavaScript lacks the power of Java Enums.

[TypeScript Enums](https://www.typescriptlang.org/docs/handbook/enums.html) provide a start to a Java-style Enum implementation, but they lack the killer feature of Java's Enum: classes. [Java's Enums](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html) are full classes, enabling properties and methods (including abstract methods and overriding within an enum). In contrast, TypeScript enums are limited to being namespaced integers or strings.

[Enumify](https://github.com/rauschma/enumify) is a strong introduction to class-style enums in JavaScript, and this project ports the idea to TypeScript. This port loses the feature from Enumify of creating an enumeration from an array of Strings, but string-based TypeScript enums were added in 2.4.1, so that is not a large loss.


## The basics

Install:

```text
npm install ts-enums
```

Use:

```typescript
import {Enum, EnumValue} from 'ts-enums';

export class Color extends EnumValue {
  constructor(name: string) {
    super(name);
  }
}

class ColorEnumType extends Enum<Color> {

  RED: Color = new Color('RED name');
  GREEN: Color = new Color('GREEN name');
  BLUE: Color = new Color('BLUE name');

  constructor() {
    super();
    this.initEnum('Color');
  }
}

export const ColorEnum: ColorEnumType = new ColorEnumType();

// examples of use
console.log(ColorEnum.RED); // Color.RED
console.log(ColorEnum.GREEN instanceof Color); // true

new Color();
    // Error: EnumValue classes can’t be instantiated individually
```

Unfortunately, this is not as terse as Enumify's syntax. Here are the steps: 
1. We define the implementation of EnumValue that defines each of the instances.
2. We implement each instance of the EnumValue as a property on the Enum. Within the Enum, we call `initEnum()` with a unique name to set up all of the Enum-specific behavior.
3. We export an instance of the enum so that other modules can use it.

## Properties of Enum classes

Enum exposes the getter `values`, which produces an Array with all enum values:

```typescript
for (const c of ColorEnum.values) {
    console.log(c);
}
// Output:
// Color.RED
// Color.GREEN
// Color.BLUE
```

Enum exposes the methods `byPropName` and `byDescription`, to extract the EnumValue instance by either the property name of the object in the Enum or the description string passed into the EnumValue's constructor, respectively:

```typescript
console.log(ColorEnum.byPropName('RED') === ColorEnum.RED); // true
console.log(ColorEnum.byDescription('RED name') === ColorEnum.RED); // true
true
```

## Properties of enum values

Ts-Enums adds two properties to every enum value:

* `propName`: the property name of the object in the Enum.

    ```repl
    > ColorEnum.BLUE.name
    'BLUE'
    ```

* `ordinal`: the position of the enum value within the Array `values`.

    ```repl
    > ColorEnum.BLUE.ordinal
    2
    ```

## Adding properties to enum values

The EnumValues are full TypeScript classes, enabling you to add properties and methods (see the tests for more examples).

```typescript
class TicTacToeColor extends EnumValue {
      constructor(name: string, private _inverse: { (): TicTacToeColor }) {
        super(name);
      }

      get inverse(): TicTacToeColor {
        return this._inverse();
      }
    }

    class TicTacToeColorEnumType extends Enum<TicTacToeColor> {

      // Alas, data properties don’t work, because the enum
      // values (TicTacToeColor.X etc.) don’t exist when
      // the object literals are evaluated.
      O: TicTacToeColor = new TicTacToeColor('O', () => this.X);
      X: TicTacToeColor = new TicTacToeColor('X', () => this.O);

      constructor() {
        super();
        this.initEnum('TicTacToeColor');
      }
    }

    const TicTacToeColorEnum: TicTacToeColorEnumType =
      new TicTacToeColorEnumType();

console.log(TicTacToeColorEnum.O.inverse); // TicTacToeColorEnum.X
```

## More information

* The directory `test/` contains examples.