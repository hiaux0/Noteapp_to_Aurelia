import { ContextMenu, ContextMenuItemTypes } from 'jquery-contextmenu';
const _conMenu = new ContextMenu();

export class Cm {
  constructor() {
    this.greeting = "Context Menu playground"
    console.log(_conMenu)
  }

  attached() {
    // by repeating .create: create multiple context menus
    _conMenu.create(simple_cm);
    _conMenu.create(seperator_cm);
    _conMenu.create(child_items_cm);
    _conMenu.create(build_cm);
    _conMenu.create(name_as_html_cm);
  }
}

/*****************************************************
 * Table of content
 * 1. Quickstart
 * 2. Docs
 * 3. Todo
 * ---------------------------------------------------
 * 1. Quickstart 
 * - Import required modules
 * - See simple_cm
 * ---------------------------------------------------
 * 2. Adding own documentation for custom context menu
 * - Simple
 * - Seperator
 * - Children / submenus
 * - Build
 * - As html
 * ---------------------------------------------------
 * 3. TODO:
 * - Adding custom divs/spans to cme
 * - appendTo: ''
 *****************************************************/

/** Create a simple context menu
 */
let simple_cm = {
  selector: "#simple-cm",         // here goes the html element where the _conMenu should be triggered
  items: {                        // items in your context menu
    item1: {                      // name of the item
      name: 'name-of-item-1',     // displayed name in context menu
      callback: function () { }   // optional callback
    }
  }
 }
/** A seperator between many items
 */
let seperator_cm = {
  selector: "#seperator-cm",         
  items: {                        
    item1: { name: 'name-of-item-1' },
    item2: { name: 'name-of-item-2' }, 
    "sep1": "------",
    item3: { name: 'name-of-item-3' }
  }  
 }
/** Child items in context menu
  */
let child_items_cm = {
  selector: "#child-items-cm",
  items: {
    item1: { name: 'name-of-item-1' },
    item2: { name: 'name-of-item-2' },
    "sep1": "------",                   
    item3: { name: 'name-of-item-3' },
    item4: {
      name: "item-with-children",       // name of parent
      items: {                          // nest another items key
        child1: { name: 'child1' },
        child2: { name: 'child2' },
        child3: { name: 'child3' }
      }
    }
  }
 }
/** Events on activation/hide/shown of a context menu
 * https://swisnl.github.io/jQuery-contextMenu/docs.html#events
 */
let events_show_cm = {
  selector: '#events-cm',
    events: {
    show: function(options) {

    },
    hide: function(options) {
      _conMenu.update()
    },
    activated: function(options) {

    },
   }
 }
/**
 * Various input types
 * https://swisnl.github.io/jQuery-contextMenu/demo/input.html
 */

 /**
  * Context menu build functionality
  */
 let build_cm = {
   selector: '#build-cm',
   build: function(element,event) {
     let string = "dasdr23r"
     console.log(element)
     return {
       items: {
         dasdkas: { name: string }
       }
     }
   }
 }

let name_as_html_cm = {
  selector: "#name-as-html-cm",
  items: {
    firstCommand: {
      name: "Copy <span style='font-weight: bold'>Text</span>",
      isHtmlName: true
    }
  }
}
//
