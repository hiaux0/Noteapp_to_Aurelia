import {inject} from 'aurelia-framework'

@inject(Element)
export class DynamicTextarea {
    constructor(element,content) {
                                        this.element = element
    }


}