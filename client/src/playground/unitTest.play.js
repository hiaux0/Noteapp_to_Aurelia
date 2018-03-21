let outsideVar = 'other side'

export class UnitTest {
  constructor() {
    this.greeting = 'Hello'
    this.baz = 'baz'
  }

  /**
   * Sets baz to foo
   */
  foo() {
    this.baz = 'foo'
  }
  /**
   * @returns 'bar'
   */
  bar() {
    return 'bar'
  }
  /**
   * C.logs the parameter `sth`
   * @param sth
   */
  say(sth) {
    console.log(toString(sth))
  }
  /**
   * Get value of `this.bar` and prints it as uppercase 
   * @returns `this.bar` value as uppercase
   */
  shout() {
    let bar = this.bar()
    console.log(bar.toUpperCase())
    return bar.toUpperCase()
  }
  /**
   * @returns variable from outside class scope
   */
  waitForReply() {
    return outsideVar
  }
}
