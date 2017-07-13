import {Enum, EnumValue} from '../src/ts-enums';

describe('Basic Tests', () => {
  describe('simple', () => {
    class Color extends EnumValue {
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

    const ColorEnum: ColorEnumType = new ColorEnumType();

    it('should handle instanceof', () => {
      expect(ColorEnum.RED instanceof Color).toBe(true);
    });

    it('should handle toString', () => {
      expect(ColorEnum.RED.toString()).toBe('Color.RED');
    });

    it('should handle ordinal', () => {
      expect(ColorEnum.GREEN.ordinal).toBe(1);
    });

    it('should handle toString', () => {
      expect(ColorEnum.GREEN.toString()).toBe('Color.GREEN');
    });

    it('should handle byPropName', () => {
      expect(ColorEnum.byPropName('BLUE')).toBe(ColorEnum.BLUE);
    });

    it('should handle byDescription', () => {
      expect(ColorEnum.byDescription('BLUE name')).toBe(ColorEnum.BLUE);
    });

    it('should handle values', () => {
      expect(ColorEnum.values).toEqual([
        ColorEnum.RED,
        ColorEnum.GREEN,
        ColorEnum.BLUE
      ]);
    });

    it('should handle closing the value', () => {
      try {
        let color: Color = new Color('foo');
        fail('should have been prevented');
      } catch (e) {
        // no-op
      }
    });

    it('should handle closing the enum', () => {
      try {
        const type: ColorEnumType = new ColorEnumType();
        fail('should have been prevented');
      } catch (e) {
        // no-op
      }
    });
  });

  describe('custom constructor and instance method', () => {
    class TicTacToeColor extends EnumValue {
      constructor(name: string, private _inverse: {(): TicTacToeColor}) {
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

    const TicTacToeColorEnum: TicTacToeColorEnumType = new TicTacToeColorEnumType();

    it('should handle custom instance method', () => {
      expect(TicTacToeColorEnum.X.inverse).toBe(TicTacToeColorEnum.O);
      expect(TicTacToeColorEnum.O.inverse).toBe(TicTacToeColorEnum.X);
    });

    it('should handle toString', () => {
      expect(String(TicTacToeColorEnum.O)).toBe('TicTacToeColor.O');
    });

    it('should handle ordinal', () => {
      expect(TicTacToeColorEnum.O.ordinal).toBe(0);
      expect(TicTacToeColorEnum.X.ordinal).toBe(1);
    });
  });

  describe('custom prototype method', () => {
    class Weekday extends EnumValue {
      constructor(name: string) {
        super(name);
      }

      isBusinessDay(): boolean {
        switch (this) {
          case WeekdayEnum.SATURDAY:
          case WeekdayEnum.SUNDAY:
            return false;
          default:
            return true;
        }
      }
    }

    class WeekdayEnumType extends Enum<Weekday> {
      MONDAY: Weekday = new Weekday('MONDAY');
      TUESDAY: Weekday = new Weekday('TUESDAY');
      WEDNESDAY: Weekday = new Weekday('WEDNESDAY');
      THURSDAY: Weekday = new Weekday('THURSDAY');
      FRIDAY: Weekday = new Weekday('FRIDAY');
      SATURDAY: Weekday = new Weekday('SATURDAY');
      SUNDAY: Weekday = new Weekday('SUNDAY');

      constructor() {
        super();
        this.initEnum('Weekday');
      }
    }

    const WeekdayEnum: WeekdayEnumType = new WeekdayEnumType();

    it('should handle a custom prototype method', () => {
      expect(WeekdayEnum.SATURDAY.isBusinessDay()).toBe(false);
      expect(WeekdayEnum.MONDAY.isBusinessDay()).toBe(true);
    });
  });

  describe('custom property', () => {
    class Weekday extends EnumValue {
      constructor(name: string, private _businessDay: boolean = true) {
        super(name);
      }

      // use a private field and a getter to establish immutability
      isBusinessDay(): boolean {
        return this._businessDay;
      }
    }

    class WeekdayEnumType extends Enum<Weekday> {
      MONDAY: Weekday = new Weekday('MONDAY');
      TUESDAY: Weekday = new Weekday('TUESDAY');
      WEDNESDAY: Weekday = new Weekday('WEDNESDAY');
      THURSDAY: Weekday = new Weekday('THURSDAY');
      FRIDAY: Weekday = new Weekday('FRIDAY');
      SATURDAY: Weekday = new Weekday('SATURDAY', false);
      SUNDAY: Weekday = new Weekday('SUNDAY', false);

      constructor() {
        super();
        this.initEnum('Weekday (by Property)');
      }
    }

    const WeekdayEnum: WeekdayEnumType = new WeekdayEnumType();

    it('should handle a custom prototype method', () => {
      expect(WeekdayEnum.SATURDAY.isBusinessDay()).toBe(false);
      expect(WeekdayEnum.MONDAY.isBusinessDay()).toBe(true);
    });
  });

  describe('flags', () => {
    class Mode extends EnumValue {
      constructor(name: string, private _n: number) {
        super(name);
      }

      // use a private field and a getter to establish immutability
      get n(): number {
        return this._n;
      }
    }

    class ModeEnumType extends Enum<Mode> {
      USER_R: Mode = new Mode('USER_R', 0b100000000);
      USER_W: Mode = new Mode('USER_W', 0b010000000);
      USER_X: Mode = new Mode('USER_X', 0b001000000);
      GROUP_R: Mode = new Mode('GROUP_R', 0b000100000);
      GROUP_W: Mode = new Mode('GROUP_W', 0b000010000);
      GROUP_X: Mode = new Mode('GROUP_X', 0b000001000);
      ALL_R: Mode = new Mode('ALL_R', 0b000000100);
      ALL_W: Mode = new Mode('ALL_W', 0b000000010);
      ALL_X: Mode = new Mode('ALL_X', 0b000000001);

      constructor() {
        super();
        this.initEnum('Mode');
      }
    }

    const ModeEnum: ModeEnumType = new ModeEnumType();

    it('should handle using the flags', () => {
      expect(
        ModeEnum.USER_R.n |
          ModeEnum.USER_W.n |
          ModeEnum.USER_X.n |
          ModeEnum.GROUP_R.n |
          ModeEnum.GROUP_X.n |
          ModeEnum.ALL_R.n |
          ModeEnum.ALL_X.n
      ).toBe(0o755);
      expect(
        ModeEnum.USER_R.n |
          ModeEnum.USER_W.n |
          ModeEnum.USER_X.n |
          ModeEnum.GROUP_R.n
      ).toBe(0o740);
    });
  });
});
