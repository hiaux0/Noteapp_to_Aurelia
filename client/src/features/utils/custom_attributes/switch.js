import { bindable, bindingMode, dynamicOptions, inject } from 'aurelia-framework';

export class SwitchCustomAttribute {
  static inject = [Element] 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) toggleOn
  @bindable({ defaultBindingMode: bindingMode.twoWay }) toggleOff
  @bindable({ defaultBindingMode: bindingMode.twoWay }) toggleFnc

  constructor(element) {
    this.element = element
  }

  bind() {
    // this.element.style.backgroundColor = this.value
  }

  toggleFncChanged(newValue,oldValue) {
    console.log(this.toggleFnc)
  }

}
