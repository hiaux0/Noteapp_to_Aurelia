
import {contextMenu} from 'jquery-contextmenu'
import cm from './app_logic/context_menu/context_menu'
import helper from './app_logic/helper_lib'

let cm1 = require('./app_logic/context_menu/context_menu')
let wa = require('./app_logic/write_anywhere/write_anywhere')
let dd = require('./app_logic/drag_drop/drag_drop')

export class App {
    constructor() {
    }

    multipleCalls() {
        console.log(cm)
        wa.listeners.evListener()
        dd.listeners.evListener()
    } 

}


