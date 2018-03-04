import {inject}          from 'aurelia-framework'
import {contextMenu}     from 'jquery-contextmenu'
import {DynamicTextarea} from './dynamic_textarea/dynamic-textarea'

import helper from '../helper_lib'

// let wa       = require('../app_logic/write_anywhere/write_anywhere')
let dd       = require('../drag_drop/drag_drop')
let cm_logic = require('../context_menu/cm_logic')


let idCounter=1;

@inject(Element)
export class WriteDragDrop {
    constructor(element) {  
                                    this.element = element
        this.contentStorage = []
        this.wddContent = "hello"   
    }

    created() {
        this.addContextmenu()
        dd.listeners.evListener()
        cm_logic.listeners.evListener()
    }

    logContent(content) {
        console.log(content.id)
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
       



    addContextmenu() {
        // listen to highlight event
        $(function () {
            $.contextMenu({
                selector: '#container',
                // trigger: 'left',
                // delay:1,
                items: {
                    SplitDiv: {
                        name: "Split Div",
                        items: {
                            Split_test: {
                                name: "Split",
                                className: "head-line",
                            },
                            Split_horizontally: {
                                name: "Horizontal",
                                callback: cm_logic.grid.splitThisHorizontally
                            },
                            Split_vertically: {
                                name: "Vertical",
                                callback: cm_logic.grid.splitThisVertically
                            },
                            range: {
                                name: 'By',
                                type: 'range',
                                id: 'contextMenuSlider',
                                // #425 be able to input min, max,step and value somehow
                                options: { min: 1, max: 5, step: 1, },
                                value: 3
                            }
                        }
                    },
                    ChangeTagTo: {
                        name: "Change Tag to",
                        items: {
                            ChangeToTextarea: {
                                name: "Textarea",
                                // isHtmlName: true,
                                callback: cm_logic.textmanipulation.changeToTextarea
                            },
                            ChangeToDiv: {
                                name: "Div",
                                callback: cm_logic.textmanipulation.changeToDiv
                            }
                        }
                    },

                    Sep: "--------------------------",
                },
                events: {
                    show: function (itemKey, opt) {
                        // console.log("changed? " + itemKey.commands.edit.name);
                        cm_logic.grid.listenForSlider();
                        // cm_logic.textmanipulation.displayCurrentTarget();

                    }
                }
            });
        });

    }

}

