import { bindable,inject} from 'aurelia-framework'

// import drag_drop from '../../drag_drop/au-drag-drop'
import {WriteDragDrop} from '../write-drag-drop'

let data, id, startLocation, targetLocation;

@inject(Element, WriteDragDrop)
export class DynamicTextarea {
    id;
    @bindable content
    @bindable position
    @bindable hasfocus
    @bindable dyna_textarea_id
    constructor(element, writedragdrop) {
        this.wdd = writedragdrop
        this.element = element
    }

    created() {
        this.id = this.element.children[0].id
    }

}
