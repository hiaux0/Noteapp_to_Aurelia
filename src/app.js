
import {contextMenu} from 'jquery-contextmenu'
import helper from './app_logic/helper_lib'

let wa = require('./app_logic/write_anywhere/write_anywhere')
let dd = require('./app_logic/drag_drop/drag_drop')
let cm_logic = require('./app_logic/context_menu/cm_logic')

export class App {
    constructor() {
    }

    multipleCalls() {
        wa.listeners.evListener()
        dd.listeners.evListener()
        this.addContextmenu()
        cm_logic.listeners.evListener()
        cm_logic.grid.listenForSlider()

    } 

    addContextmenu() {
        // listen to highlight event
        // cm_logic.listeners.evListener()
        console.log(cm_logic)

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
            });
        });       

    }

}


