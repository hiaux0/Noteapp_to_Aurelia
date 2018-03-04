import {inject} from 'aurelia-framework'

@inject(Element)
export class DynamicTextarea {
    constructor(element,content) {
        this.content = content
        this.element = element
        this.position = {}
        this.hasFocus = true
        console.log(element)
    }

    attached() {
        console.log("hi")
    }



}