import { bindable,inject} from 'aurelia-framework'

import drag_drop from '../../drag_drop/au-drag-drop'
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
        document.addEventListener("dragstart", this.dragStart)
        document.addEventListener("dragover", this.allowDrop)
        document.addEventListener("drop", this.drop)
        this.id = this.element.children[0].id
    }

    getContentStorage() {
        let temp = this.wdd.contentStorage.filter(x => console.log(x))
		console.log('DynamicTextarea -> getContentStorage -> temp', temp)
    }

    dragStart(event) { 
        // console.log("dragStart")
        // event.target.setAttribute("id",this.id)
        id = event.target.id
		// console.log('DynamicTextarea -> dragStart -> id', id)
        event.dataTransfer.setData("text", id);
        
    }

    allowDrop(event) {
        // console.log("in dragover")
        event.preventDefault() 
    }

    drop(event) { 
        event.preventDefault()
        drag_drop.dropIt.dropAnywhere(event)
    }

    dropAnywhere(event) {
        let draggedDataId = event.dataTransfer.getData("text")
        console.log('DynamicTextarea -> drop -> draggedDataId', draggedDataId)
        let draggedData = document.getElementById(draggedDataId)
        console.log('DynamicTextarea -> drop -> draggedData', draggedData)
        const drop_anywhere = getId("container")
        targetLocation = ev.target;
        // check if dropped on element itself (happens due to preview)
        if (targetLocation.id === this.id) {
            // console.log(`case: id: ${targetLocation.parentNode}`);
            targetLocation = targetLocation.parentNode;
        }
        let parentLeft_posi = targetLocation.offsetLeft;
        let parentTop_posi = targetLocation.offsetTop;
        // let freePosition = doc.createElement("div");
        // freePosition.classList.add('circle');
        // freePosition.setAttribute('draggable', true);
        // append element to dropped position
        let correctPos = this.correctPosition(draggedData, ev.pageX, ev.pageY);
        this.setPosition(draggedData, correctPos.x, correctPos.y);
        drop_anywhere.append(draggedData);
    }

    setPosition(ele, xcoord, ycoord) {
        // adjust with parent position
        ele.style.position = 'absolute'
        ele.style['left'] = `${xcoord}px`
        ele.style['top'] = `${ycoord}px`
    }

    correctPosition(ele, xcoord, ycoord) {
        // setup variables for location correction
        let dropLocation_x, dropLocation_y,
            delta_x, delta_y;

        // calculate deltas
        delta_x = ele.style.width / 2
        // console.log(`deltax: ${delta_x}`)
        delta_y = ele.style.height / 2
        // console.log(`deltay: ${delta_y}`)

        // corrected position
        dropLocation_x = xcoord - 25
        // console.log(`corrected x: ${dropLocation_x}`)
        dropLocation_y = ycoord - 25
        // console.log(`corrected y: ${dropLocation_y}`)
        return {
            x: dropLocation_x,
            y: dropLocation_y
        }
    }
}



    // dragEnd(event) { drag_drop.dragIt.dragEnd(event) }
    // dragEnter(event) { drag_drop.dragIt.dragEnter(event) }
