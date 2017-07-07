import { Enum, EnumValue } from "../src/ts-enums"

class Result extends EnumValue {
  constructor(name: string) {
    super(name)
  }
}

class ResultEnumType extends Enum<Result> {
  ACCEPTED: Result = new Result("ACCEPTED")
  REJECTED: Result = new Result("REJECTED")

  constructor() {
    super()
    this.initEnum("Result")
  }
}

const ResultEnum: ResultEnumType = new ResultEnumType()

class State extends EnumValue {
  constructor(
    name: string,
    private _enter: { (iter: IterableIterator<string>): State | Result }
  ) {
    super(name)
  }

  enter(iter: IterableIterator<string>): State | Result {
    return this._enter(iter)
  }
}

class StateEnumType extends Enum<State> {
  START: State = new State("START", (iter: IterableIterator<string>):
    | State
    | Result => {
    const { value, done } = iter.next()
    if (done) {
      return ResultEnum.REJECTED
    }
    switch (value) {
      case "A":
        return StateEnum.A_SEQUENCE
      default:
        return ResultEnum.REJECTED
    }
  })
  A_SEQUENCE: State = new State("A_SEQUENCE", (iter: IterableIterator<string>):
    | State
    | Result => {
    const { value, done } = iter.next()
    if (done) {
      return ResultEnum.REJECTED
    }
    switch (value) {
      case "A":
        return StateEnum.A_SEQUENCE
      case "B":
        return StateEnum.B_SEQUENCE
      default:
        return ResultEnum.REJECTED
    }
  })
  B_SEQUENCE: State = new State("B_SEQUENCE", (iter: IterableIterator<string>):
    | State
    | Result => {
    const { value, done } = iter.next()
    if (done) {
      return StateEnum.ACCEPT
    }
    switch (value) {
      case "B":
        return StateEnum.B_SEQUENCE
      default:
        return ResultEnum.REJECTED
    }
  })
  ACCEPT: State = new State("ACCEPT", (): State | Result => {
    return ResultEnum.ACCEPTED
  })

  constructor() {
    super()
    this.initEnum("State")
  }
}

const StateEnum: StateEnumType = new StateEnumType()

describe("state machine", () => {
  function runStateMachine(str: string): boolean {
    let iter: IterableIterator<string> = str[Symbol.iterator]()
    let state: State | Result = StateEnum.START
    while (true) {
      if (state === ResultEnum.ACCEPTED) {
        return true
      } else if (state === ResultEnum.REJECTED) {
        return false
      } else {
        state = (<State>state).enter(iter)
      }
    }
  }

  it("should accept and reject properly", () => {
    expect(runStateMachine("AABBB")).toBe(true)
    expect(runStateMachine("AA")).toBe(false)
    expect(runStateMachine("BBB")).toBe(false)
    expect(runStateMachine("AABBC")).toBe(false)
    expect(runStateMachine("")).toBe(false)
  })
})
