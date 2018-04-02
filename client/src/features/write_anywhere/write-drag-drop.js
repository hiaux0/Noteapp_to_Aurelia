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

  import { ContextMenu, ContextMenuItemTypes } from 'jquery-contextmenu';
  import { DatabaseAPI } from '../../database-api';
  import connectArea from '../connect_areas/connect-areas'
  import Draggable from "gsap/Draggable";
  import helper from '../helper_lib'
  
const _conMenu = new ContextMenu();
let _idCounter = 0;
let _latestId = 0;

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
@inject(DatabaseAPI, Element, Router)
export class WriteDragDrop {
  draggableToggleNotes = false
  draggableToggleNoteContainer = false
  firstDrag = true
  note_container_coords
  // currentTopic
  @bindable ctpWddTopics // child to parent (child = wdd, parent = testdetail)
  @bindable latestIdOfNotes
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//     Component Initialization
//^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////

  constructor(dbAPI, element, router) {
    this.dbAPI = dbAPI
    this.element = element
    this.noteStorage = [] // #INIT
    this.router = router
  }

  attached() {
    this.m.http.getTopicFromNotebook()
    // add context menu
    _conMenu.create(this._wdd_conMenu)
    this.note_container_coords = document.getElementById("note-container").getBoundingClientRect()
  }

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Methods
//^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////

	m = {
    dataSharing: {
      // #FEATURE #0204_9erjfnk
      ////////////////////////////// v Playground v //////////////////////////////
      wordsAsDiv: () => {
        console.log(this.noteStorage[0])
      }
      
      ////////////////////////////// ^ Playground ^ //////////////////////////////
    },
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
        console.log("pushed to history: ",storageEle.positionHistory.last())
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
        // console.log('------------------------------')
        // console.log("Beging first adjust")
        let storageElement = this.m.notes.findInChildNoteStorage(ele)
        let prevPos = storageElement.positionHistory
        let originalPos = prevPos[0] // #DEPRECATED
        // console.log('​WriteDragDrop -> originalPos', originalPos);
        let latestPos_isString = prevPos.slice(-1)[0]
        // console.log('​WriteDragDrop -> latestPos_isString', latestPos_isString);

        if (prevPos.length > 1) {
          // console.log("prevPos.length > 1")
          // transform latestPos (which is a string "translate3d") using regex
          let regex = /(-?\d+(\.\d*)?)/g // matches 3 in "3d" aswell (still learning regex)
          let latestPos_isArr = latestPos_isString.match(regex)
          let latestPos_xy = {
            x: latestPos_isArr[1],
            y: latestPos_isArr[2]
          }
          // console.log('​WriteDragDrop -> latestPos_xy', latestPos_xy);
          return (latestPos_xy)
        }
        else {
          // console.log("prevPos.length <= 1")
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
            // x: movedEle.getBoundingClientRect().x - this.note_container_coords.x, // relative
            x: movedEle.getBoundingClientRect().x, // absolute
            // y: movedEle.getBoundingClientRect().y - this.note_container_coords.y // relative
            y: movedEle.getBoundingClientRect().y // absolute
          }
          ////////////////////////////// v Playground v //////////////////////////////
          // let adjustPositionVar = this.m.view.notes.adjustPosition.call(this,newPosition)
          
          ////////////////////////////// ^ Playground ^ //////////////////////////////
          this.noteStorage.map(childNote => {
            // console.log('​Pos was WriteDragDrop -> childNote.position', childNote.position.x);
            if (childNote.id == id) { // check which one matches 
              childNote.position = newPosition
              movedEle.style.transform = '' //resets transform of Draggable
            }
          })
        })
      }
    },
    view: {
      draggable: {
        /** Make all notes draggable.
         * @CONSIDER Autoscroll only works if #note-container is scrollable, doesn't support "new" autoscroll, ie can't scroll in "unknown territory"
         */
        makeDraggableToggle: () => {
          switch (this.draggableToggleNotes) {
            case false:
              Array.from($(".draggable")).map((ele) => {
                ele.setAttribute("contenteditable", false)
                Draggable.create(ele, {
                  autoScroll: 1,
                  // type: "x,y",
                  // bounds: document.getElementById("note-container"),
                  onDragStart: () => {
                    /** #?!BUG: If there is a bug when dragging, ie. notes jump on the FIRST drag. See here.
                     * More exactly: in if(this.firstDrag) where the first drag case is checked, adjust via the `this.m.notes.getPreviousPosition(ele)` function
                     * First drag needs extra care due to Draggable behaviour, ie. transform3d(x,y,z ) 
                     * If not adjusted like below dyn area will jump around since you save new x and y's 
                     * but transform will ALWAYS be relative to ORIGINAL x and y
                    //  */
                    /** POSITION RELATIVE */
                      // if (this.firstDrag) {
                      //   console.log("First drag: ",this.firstDrag)
                      //   console.log(this.m.notes.getPreviousPosition(ele))
                      //   // x position
                      //   this.m.notes.findInChildNoteStorage(ele).position.x = this.m.notes.findInChildNoteStorage(ele).positionHistory[0].x * 1 - this.m.notes.getPreviousPosition(ele).x 
                      //   // y position
                      //   this.m.notes.findInChildNoteStorage(ele).position.y = this.m.notes.findInChildNoteStorage(ele).positionHistory[0].y * 1 - this.m.notes.getPreviousPosition(ele).y
                      //   // // turn off firstDrag
                      //   this.firstDrag = false
                      // }
                    /** POSITION ABSOLUTE */
                      if (this.firstDrag) {
                        console.log("First drag: ",this.firstDrag)
                        console.log(this.m.notes.getPreviousPosition(ele))
                        // x position
                        this.m.notes.findInChildNoteStorage(ele).position.x = this.m.notes.findInChildNoteStorage(ele).positionHistory[0].x * 1 // this.m.notes.getPreviousPosition(ele).x 
                        // y position
                        this.m.notes.findInChildNoteStorage(ele).position.y = this.m.notes.findInChildNoteStorage(ele).positionHistory[0].y * 1 // this.m.notes.getPreviousPosition(ele).y
                        // // turn off firstDrag
                        this.firstDrag = false
                      }
                  },
                  onDragEnd: () => {
                    ele.classList.add('movedDueDrag')
                    this.m.notes.addToPositionHistory(ele)
                  }
                });
              });
              this.draggableToggleNotes = true;
              break;
            case true:
              Array.from($(".draggable")).map((ele) => {
                let D = Draggable.create(ele)
                D[0].disable();
                ele.setAttribute("contenteditable", true)
              });
              this.draggableToggleNotes = false;
              break;
          }
        },
        /** 1. Make the whole #note-container draggable.
         * 2. Also turn off notes draggable to prevents drag bugs
         */
        makeNoteContainerDraggableToggle: () => {
          switch (this.draggableToggleNoteContainer) {
            case false:
              Draggable.create("#note-container", {
                type: "scroll",
                edgeResistance: 0.5,
                throwProps: true
              });
              this.draggableToggleNoteContainer = true;
              // 2.
              this.draggableToggleNotes = true;
              this.m.view.draggable.makeDraggableToggle()
              break;
            case true:
              let D = Draggable.create("#note-container")
              D[0].disable();
              this.draggableToggleNoteContainer = false;
              break;
          }
        },
      },
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
                x: ev.pageX, 
                y: ev.pageY
              }, 
             
              ////////////////////////////// v Playground v //////////////////////////////
              // position: {
              //   x: this.m.view.notes.adjustPosition_X.call(this, ev.pageX),
              //   y: this.m.view.notes.adjustPosition_Y.call(this, ev.pageY)
              // },
              ////////////////////////////// ^ Playground ^ //////////////////////////////

              // position history in format of Draggable
              // positionHistory: [this.m.view.notes.adjustPosition.call(this,ev.pageX, ev.pageY)] //relative
              positionHistory: [{ //absolute
                x: ev.pageX,
                y: ev.pageY
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
                x: ev.pageX,
                y: ev.pageY
              }, 
              // position history in format of Draggable
              // positionHistory: [this.m.view.notes.adjustPosition.call(this,ev.pageX, ev.pageY)] //relative
              positionHistory: [{ //absolute
                x: ev.pageX,
                y: ev.pageY
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
            let adjust_y = y - this.note_container_coords.y
            return {
              x: x - this.note_container_coords.x,
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
        }
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
      // correctNotePosition: {
      //   name: 'Correct Note Position',
      //   callback: () => this.m.view.notes.correctNotePositions()
      // },
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

}
