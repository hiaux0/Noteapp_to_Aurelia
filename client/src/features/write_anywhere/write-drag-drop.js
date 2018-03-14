import {bindable, inject}           from 'aurelia-framework'
import {EventAggregator}            from 'aurelia-event-aggregator'
import {activationStrategy, Router} from 'aurelia-router'

import { NewEntrySelected, EntryUpdated } from "../../messages"
import helper      from '../helper_lib'
import connectArea from '../connect_area/connect-area'

let idCounter=1;

@inject(Element, EventAggregator)
export class WriteDragDrop {
    @bindable databasecontent
    constructor(element, ea) { 
        this.ea = ea
        this.element=element
        this.contentStorage = []
        // this.conArea = connectArea
    }

    attached() {
        this.addFromDatabase()
        connectArea.listenToConnect()
    }   

    getConnectStorageSize() {
        connectArea.getConnectStorageSize()
    }
    clearCanvas() {
        this.contentStorage.length=0 }
  
    removeLast() {
        this.contentStorage.pop() }
    multipleCalls(event) {
        this.addContentStorageElement(event) }
        addFromDatabase() {
            const container = document.getElementById("container")
            const pos_of_db_ele = container.getBoundingClientRect()
            // console.log("this dbcont", this.databasecontent)
            const cont = this.databasecontent.content
            this.contentStorage.push({
                id: idCounter,
                content: cont,
                position: {
                    x: pos_of_db_ele.x + 10,
                    y: pos_of_db_ele.y + 10
                }
            })
            ++idCounter
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
           // check whether target has container id
           if (event.target.id === "container" ? false : true) {
                return;
            }
        // If content of last textarea is empty, delete it and create a new textarea at new place
            if(this.contentStorage.last()) {
                // console.log("1 this is the last element", this.contentStorage.last())
                // console.log("2 and it' content: \"", this.contentStorage.last().content, "\"")
                // console.log("3 it's id: ", this.contentStorage.last().id)
               
                // counter to give each dataobject an id
                if(this.contentStorage.last().content === "") {
                    // console.log("4 it's empty so pop")
                    this.contentStorage.pop()
                   
                } 
                let tempobj = {
                    id: idCounter,
                    content: "",
                    position: {
                        x: event.pageX,
                        y: event.pageY
                    }
                }
                this.contentStorage.push(tempobj)
                // console.log("5 length of storage: ",this.contentStorage.length)
                // console.log("6 whole storage:" , this.contentStorage)
            }
           ++idCounter
        } 
       
}
