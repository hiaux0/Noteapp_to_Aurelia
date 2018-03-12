import {bindable, inject}  from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

import { NewEntrySelected } from "../../messages"
import helper from '../helper_lib'

let dd       = require('../drag_drop/au-drag-drop')
let idCounter=1;

@inject(EventAggregator)
export class WriteDragDrop {
    @bindable databasecontent
    constructor() {  
        this.contentStorage = []
    }

    multipleCalls(event) {
        // wa.helpers.auIsWriteAnywhere(event)
        this.addContentStorageElement(event)
    }
       
       /** Add textarea at mouse position
        * 
        * 1. Click in id#container to add a textarea at mouseposition
        *   - If mouseclick is not directly in container textarea will not be created
        * 2. For the very first textarea a special method is called
        * 3. For subsequent textareas, create them with as you would expect it
        * 4. Push everything into contentStorage
        * 
        * @param event: takes in event to extract target id and position to create element
        * @returns 
        * 
        * @memberOf WriteDragDrop
        */
       addContentStorageElement(event) {
        // 
        if (event.target.id === "container" ? false : true) {
            return;
        }
        // If content of last textarea is empty, delete it and create a new textarea at new place
        if(this.contentStorage.last()) {
              if(this.contentStorage.last().content === "") {
                  this.contentStorage.pop()
              }
           }
        // Create dataobject saving important data of each textarea
            let tempobj = {
                id: idCounter,
                content: "",
                position: {
                    x: event.pageX,
                    y: event.pageY
                }
            }
            this.contentStorage.push(tempobj)
        // counter to give each dataobject an id
            ++idCounter
       }

}


// logContent(content) {
//     console.log(content.id)
// }
