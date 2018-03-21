
export class Hello {
  toggleBool = true
  constructor() {
    this.greeting = 'Hello'
  }

  toggleTest() {
    switch(this.toggleBool) {
      case true:
        
        this.toggleBool = false
        break;
      case false:
        
        this.toggleBool = true
        break;
    }
  }
  toggleFnc(bool) {
    return bool ? console.log("toggle on") : console.log("toggle off")
  }
}
