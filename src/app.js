
import {contextMenu} from 'jquery-contextmenu'
let inSty = require('./app_logic/inline_styles')

export class App {
    constructor() {
    }

    multipleCalls() {
        console.log(inSty)
        let container = document.getElementById("container")
        let box = {
            border: "3px dotted blue"
        }
        inSty.addInlineStyle(container,box)
    }

}


