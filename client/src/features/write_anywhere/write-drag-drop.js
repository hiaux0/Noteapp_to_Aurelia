/** Readme
 * 1. Handles notes view, ie, drag and drop, dynamic creation at mouse click
 * 2. Init: get topics from notebook from router params (#INIT)
 *  2.1 Displays content of each note in note-container
 * 3. Save changes during note writing and delegates them to topic.cmpt
 */

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Imports
//*
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////

  import { bindable, inject } from 'aurelia-framework'
  import { Router } from 'aurelia-router'
  import { TaskQueue } from 'aurelia-framework';

  import { ContextMenu } from 'jquery-contextmenu';
  import { DatabaseAPI } from '../../database-api';
  import {ScrollExpansion} from './scroll_expansion/scroll-expansion'
  // import connectArea from '../connect_areas/connect-areas'
  import {helper, test} from '../helper_lib'
  
  const _conMenu = new ContextMenu();
  let _idCounter = 0;
  let _latestId = 0;
  let note_container_global;
  let note_container_rect;
 
/** Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 * @source https://gist.github.com/Yimiprod/7ee176597fef230d1451
 */
  function deepDifference(object, base) {
    function changes(object, base) {
      return _.transform(object, function (result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }
  _.mixin({ 'deepDifference': deepDifference });

//
@inject(DatabaseAPI, Element, Router, TaskQueue)
export class WriteDragDrop {
  draggableToggleNotes = false
  draggableToggleNoteContainer = false
  firstDrag = true

  @bindable ctpWddTopics // child to parent (child = wdd, parent = testdetail)
  @bindable latestIdOfNotes
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//     Component Initialization
//^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  constructor(dbAPI, element, router, tq) {
    this.dbAPI = dbAPI
    this.element = element
    this.noteStorage = [] // #INIT
    this.router = router
    this.tq = tq
  }

  attached() {
    this.m.http.getTopicFromNotebook() // get notebooks from database
    // add context menu
    _conMenu.create(this._wdd_conMenu)
    note_container_rect = document.getElementById("note-container").getBoundingClientRect()
    note_container_global = document.getElementById("note-container")
    // ScrollExpansion //
    ScrollExpansion.note_container_rect = document.getElementById("note-container").getBoundingClientRect()
    ScrollExpansion.note_container_global = document.getElementById("note-container")
  }

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Methods
//^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////

	m = {
    http: {
      getTopicFromNotebook: () => { //#INIT
        let nbId = this.router.currentInstruction.params.nbid
        let tId = this.router.currentInstruction.params.tid
        this.dbAPI.get_topic_from_notebook(nbId, tId)
          .then(topic => {
            if (topic.error) { return topic } // dirty cases
            // set _idCounter
            _idCounter = topic[0].topics[0].latestId
            this.noteStorage = topic[0].topics[0].notes // pushes data the main storage
          })
      },
    },
    notes: {
      /**
       * Every time a note is dragged, add its position to history
       * //TODO consider adding a limit;
       */
      addToPositionHistory: (ele) => {
        let storageEle = this.m.notes.findInChildNoteStorage(ele)
        // push new position to history
        storageEle.positionHistory.push(ele.style.transform)
      },
      /**
       * Takes in HTML element and
       * @returns corresponding element in storage
       */
      findInChildNoteStorage: (ele) => {
        let result;
        let id = ele.id
        this.noteStorage.map(childNote => {
          if (childNote.id == id) {
            result = childNote;
          }
        })
        return result
      },
      /**
       * @param ele From `ele` get its "latest" previous positions. NOTE latest position saved in Draggable format, ie a string "tranform3d(x,y,z)"
       * @returns x and y coordinates
       */
      getPreviousPosition: (ele) => {
        // prepare variables
        // console.log("Beging first adjust")
        let storageElement = this.m.notes.findInChildNoteStorage(ele)
        let prevPos = storageElement.positionHistory
        let latestPos_isString = prevPos.slice(-1)[0]

        if (prevPos.length > 1) {
          // transform latestPos (which is a string "translate3d") using regex
          let regex = /(-?\d+(\.\d*)?)/g // matches 3 in "3d" aswell (still learning regex)
          let latestPos_isArr = latestPos_isString.match(regex)
          let latestPos_xy = {
            x: latestPos_isArr[1],
            y: latestPos_isArr[2]
          }
          return (latestPos_xy)
        }
        else {
          return {
            x: 0,
            y: 0
          }
        }
      },
      /**
       * Helper to gather all elements that where moved and updates their position
       * @returns elements in noteStorage that where moved
       */
      saveChangesOfDragged: () => {
        this.firstDrag = true   // turn on firstDrag, since this method will save(reset) the .style. position
        let movedElements = document.getElementsByClassName('movedDueDrag')   // get all ele with class .movedDueDrag
        // loop through all ele with class
        _.forOwn(movedElements, (movedEle, key) => {  
          console.log('​WriteDragDrop -> movedEle', movedEle.innerText);
          let id = movedEle.id
          let newPosition = {
            // x: movedEle.getBoundingClientRect().x - note_container_rect.x, // relative
            x: movedEle.getBoundingClientRect().x - note_container_rect.x,// absolute
            // y: movedEle.getBoundingClientRect().y - note_container_rect.y // relative
            y: movedEle.getBoundingClientRect().y - note_container_rect.y// absolute
          }
          this.noteStorage.map(childNote => {
            if (childNote.id == id) { // check which one matches 
              childNote.position = newPosition
              movedEle.style.transform = '' //resets transform of Draggable
            }
          })
        })
      }
    },
    view: {
      notes: {
        /** Add textarea at mouse position
          * 
          * 1. Click in id#container to add a textarea at mouseposition
          *   - If mouseclick is not directly in container textarea will not be created
          * 2. For the very first textarea a special method is called
          * 3. For subsequent textareas, create them with as you would expect it
          * 4. Push everything into noteStorage
          * 
          * @param event: takes in event to extract target id and position to create element
          * @returns 
          */
         // !note !dyn-note
        addDynamicChildNote: (ev) => {
// Playground
  //
  //
  //
  //
  //
  //
  //
  //
  //
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  //////////////////////////////////////// v Playground v //////////////////////////////
          console.log('​WriteDragDrop -> ev', ev);
          console.log("Cur Mouse Pos: ",ev.layerX + note_container_global.scrollLeft)
  //////////////////////////////////////// ^ Playground ^ //////////////////////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  ////////////                                                              ////////////
  //
  //
  //
  //
  //
  //
  //
  //
  //
//
          // If target is not in valid area, ie not in note-container AND not dyn-textarea return with no action
          let notNoteContainer = ev.target.id === "note-container" ? false : true
          let notDynTextarea = ev.target.tagName === "DYNAMIC-TEXTAREA" ? false : true
          if (notNoteContainer && notDynTextarea) {
            return;
          }

          // If content of last textarea is empty, delete it and create a new textarea at new place
          if (this.noteStorage.last()) {
            // counter to give each dataobject an id
            if (this.noteStorage.last().content === "") {
              this.noteStorage.pop()
              --_idCounter // if empty dyn area gets deleted adjust idCounter
            }

            let tempobj = {
              id: _idCounter,
              content: "",
              // position: this.m.view.notes.adjustPosition.call(this,ev.pageX, ev.pageY), //relative
              position: { //absolute
                x: ev.pageX - note_container_rect.x + note_container_global.scrollLeft, 
                y: ev.pageY - note_container_rect.y + note_container_global.scrollTop 
              }, 
             
              // position history in format of Draggable
              // positionHistory: [this.m.view.notes.adjustPosition.call(this,ev.pageX, ev.pageY)] //relative
              positionHistory: [{ //absolute
                x: ev.pageX - note_container_rect.x + note_container_global.scrollLeft, 
                y: ev.pageY - note_container_rect.y + note_container_global.scrollTop 
              }], 
            }
            this.noteStorage.push(tempobj)
          } 
          else { // else just add new area
            let tempobj = {
              id: _idCounter,
              content: "",
              // position: this.m.view.notes.adjustPosition.call(this,ev.pageX,ev.pageY), //relative
              position: { //absolute
                x: ev.pageX - note_container_rect.x + note_container_global.scrollLeft, 
                y: ev.pageY - note_container_rect.y + note_container_global.scrollTop 
              }, 
              // position history in format of Draggable
              // positionHistory: [this.m.view.notes.adjustPosition.call(this,ev.pageX, ev.pageY)] //relative
              positionHistory: [{ //absolute
                x: ev.pageX - note_container_rect.x + note_container_global.scrollLeft, 
                y: ev.pageY - note_container_rect.y + note_container_global.scrollTop 
              }], 
            }            
            this.noteStorage.push(tempobj)
          }
          _idCounter++
        },
        /**
         * Can take in object {x,y} or just coords x,y
         * @returns an object {x,y} with adjusted coords
         * @BUGS - #0104_pufnth: When deleting empty note to create a new note, the height of the empty one also counts into cumHeight
         * - #0204_dlakj92: In combination with autoscroll/draggable things get messy again.
         * @Tasks 1. Take child note coords and adjust according to note-container 
         * 2. Fixing unusual bug: When creating dyn notes, the custom components `dynamic-textarea` stack on each other, thus the position of every new dyn note gets pushed down according to the stack size.
         * @CONSIDER 
         * 1. Generalizing to more than getBoundingClientRect case by passing adjuster as args aswell
         * 2. Using hight order functions to split this method into one for x and one for y, right now this method is called too often (twice?)
         */
        adjustPosition: function() {
          // x,y case
          let args = arguments
          if(args.length === 2) {
            const x = args[0], y = args[1]
              return adjustCoordinates.call(this,x,y) // <----------- RETURN
          } 
          // {x,y} case
          else if (typeof args === "object") {
            const x = args[0].x, y =args[0].y
            return adjustCoordinates.call(this,x, y) // <----------- RETURN
          }
          else {
            throw new Error("Please recheck your args, should be of type ({x,y}) or (x,y)")
          }
          //@Task 1.
          function adjustCoordinates(x,y) {
            let adjust_y = y - note_container_rect.y
            return {
              x: x - note_container_rect.x,
              y: fixStackingBug.call(this, adjust_y),

            }
          }
          //@Task 2.: Only need to apply to y
          function fixStackingBug(yCoord) {
            // keep track of noteStorage 'stack' size
            if (this.noteStorage.length === 0) { return yCoord} // if no notes just return the input
            // get cumulative height of notes, need to cycle through every dyn note, since the height is dependent in real time on every previous dyn note
            let cumHeight = Array.from(document.getElementsByClassName('dynamic-textarea')).reduce(reduceToCumHeight,0)
              function reduceToCumHeight(acc,curVal) {
                // get height
                return acc + curVal.getBoundingClientRect().height
              }
            return yCoord-cumHeight
          }
        },
        /** Be able to quickly remove last note by double clicking
         */
        removeLast: () => {
          if(this.noteStorage.last().content === "") {
            this.noteStorage.pop()
          } 
        },
      },
    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Method Context Menu
//^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  _wdd_conMenu = {
    selector: '#note-container',
    items: {
      wordsAsDiv: {
        name: "Words as Div",
        className: "btn btn-outline-success",
        callback: () => this.m.dataSharing.wordsAsDiv()
      },
      sep1: "----------",
      draggableToggleNotes: {
        name: 'Draggable Toggle',
        callback: () => this.m.view.draggable.makeDraggableToggle()
      },
      makeNoteContainerDraggable: {
        name: "Make Note-Con draggable",
        callback: () => this.m.view.draggable.makeNoteContainerDraggableToggle()
      },
      saveChanges: {
        name: 'Save Changes',
        callback: () => this.delegateToParent()
      },
      
    }
  }

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Method old style: Consider putting these in the method object
//^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////
 
  delegateToParent = () => {
    this.m.notes.saveChangesOfDragged() 
    this.ctpWddTopics = this.noteStorage
    console.log('​WriteDragDrop -> delegateToParent -> this.noteStorage', this.noteStorage);
    this.latestIdOfNotes = _idCounter // how is this delegated to the parent?
    // this.notesContainer = document.getElementById('note-container').getBoundingClientRect() // #CONSIDER : renaming, 
  }

  // test for dynly added html, want that to have aurelia power
  test() {
    let div = document.createElement("DIV")
    div.innerHTML = '<span textcontent.bind="draggableToggleNotes">Hello</span>'
    document.getElementById("note-container").appendChild(div)
  }
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Playground
 //^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////
  conlog() {
            // Compare width to scrollWidth
    // Ele relative position in #note-container
    let three = document.getElementById("3").getBoundingClientRect().x - note_container_rect.x + note_container_global.scrollLeft 
    console.log('​WriteDragDrop -> conlog -> three', three);
  }
  /** Since note_container_* is global, you shoul always get the latest coords
   * @returns current coordinates of #note-container
    */
  currentNoteContainerCoords() {
    return {
      x: {
        "left": note_container_rect.x + note_container_global.scrollLeft,
        "right": note_container_rect.x + note_container_global.scrollLeft + note_container_rect.width,
      },
      y: {
        "left": note_container_rect.y + note_container_global.scrollTop,
        "right": note_container_rect.y + note_container_global.scrollTop + note_container_rect.height,
      }
    }
  }
  rel_pos(ele) {
    return {
      x: ele.getBoundingClientRect().x 
    }
  }
}
