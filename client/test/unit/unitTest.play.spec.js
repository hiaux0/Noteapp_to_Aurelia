import {UnitTest} from '../../src/playground/unitTest.play'

describe('Unit test play normal', function() {
  beforeEach(function() {
    this.ut = new UnitTest()
  })

  /** Can track variables defined outside of class context. */
  it('wait for replay', function() {
    expect(this.ut.waitForReply()).toBe('other side')
  })

  /** Acts like regular call in class context, sets class variables */
  it('set baz to foo', function() {
    this.ut.foo()
    expect(this.ut.baz).toBe("foo")
  })

  /** Acts like regular call in class context, calls class methods */
  it('should shout BAR', function() {
    expect(this.ut.shout()).toBe('BAR')
  })
  
})

/** Test using spies */
describe("Unit test play with spy, simple spy 1", function() {
  beforeEach(function() {
    this.ut = new UnitTest()

    spyOn(this.ut, 'foo')
    this.ut.foo()
  })
  
  it('spy was called', function() {
    expect(this.ut.foo).toHaveBeenCalled()
  })

  it('spy was called with args', function() {
    expect(this.ut.foo).toHaveBeenCalledWith()
  })

  it('spy stops execution of spied-on-fnc', function() {
    expect(this.ut.baz).toBe("baz") // without spy, "baz" should be "foo"
  })
})

describe('Unit test with spies, simple spy 2 ', function() {
  beforeEach(function() {
    this.ut = new UnitTest()
    spyOn(this.ut,"bar")
  })
  it('spy should intercept functin call', function() {
    // OK expect( () => {this.ut.shout()}).toThrowError(TypeError)
    expect(this.ut.shout).toThrowError(TypeError, "Cannot read property 'bar' of undefined")
    // NOPE expect(this.ut.shout().bind(this.ut) ).toThrowError(TypeError)
  })
})

describe('Unit test with spies, advanced spy callThrough', function() {
  beforeEach(function() {
    this.ut = new UnitTest()

    spyOn(this.ut, "bar").and.callThrough();
    this.ut.shout();
  })

  /** Spy can intercept fnc in body of parent fnc */
  it('spy should intercept this.bar()', function() {
    expect(this.ut.bar).toHaveBeenCalled()
  })

})

describe('Uni test with spies, advanced spy: returnValue', function() {
  beforeEach(function() {
    this.ut = new UnitTest()
    
    spyOn(this.ut,'bar').and.returnValue('bii')
    this.ut.shout()
  })

  it('spy should activate', function() {
    expect(this.ut.bar).toHaveBeenCalled()
  })

})
