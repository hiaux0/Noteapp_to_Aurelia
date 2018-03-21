import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { activationStrategy, Router } from 'aurelia-router'

import { NewEntrySelected, EntryUpdated } from "../../messages"
import helper from '../helper_lib'
import connectArea from '../connect_area/connect-area'
import { DatabaseAPI } from '../../database-api';
import Draggable from "gsap/Draggable";

let idCounter = 1;
/** hack to make test work, ~~make accessible to class via constructor?~~ */
// let draggableToggle = false //#DEPRECATED 2018-03-21 18:30:47

/**
 * Deep diff between two object, using lodash
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

@inject(DatabaseAPI, Element, EventAggregator)
export class WriteDragDrop {
  draggableToggle = false
  Draggable = Draggable
  @bindable databaseContent
  @bindable ctpWddTestdail // child to parent (child = wdd, parent = testdetail)

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Initializing Component 
//
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

  constructor(dbAPI, element, ea) {
    this.dbAPI = dbAPI
    this.ea = ea
    this.element = element
    this.childNoteStorage = []
  }

  attached() {
    // connectArea.listenToConnect()
    /* on activation get the route/id from */
    this.dbAPI.get_one_database_entry("/notes", this.ctpWddTestdail).then(data => {
      // this.contentStorageOne = (data) // #DEPRECATED
      // console.log(this.contentStorageOne)
      this.addFromDatabaseNew()
    })
  }

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Method Object
//
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

	methods = {
		draggable: {
			/**
			 * make all dyn TA draggable
			 */
      makeDraggableToggle: () => {
        switch (this.draggableToggle) {
          case false:
            Array.from($(".draggable")).map( (ele) => {
              ele.setAttribute("contenteditable",false)
              Draggable.create(ele, {
                onDragEnd: () => {
                  ele.classList.add('movedDueDrag')              
                  this.methods.childNotes.addToPositionHistory(ele)
                }
              });
            });
            this.draggableToggle = true;
            break;
          case true:
            Array.from($(".draggable")).map( (ele) => {
              let D = Draggable.create(ele)
              D[0].disable();
              ele.setAttribute("contenteditable", true)
            });
            this.draggableToggle = false;
            break;
        }
      }
    },
    childNotes: {
      addToPositionHistory: (ele) => {
        this.childNoteStorage.positionHistory.push( ele.style.transform )
        console.log(this.childNoteStorage.positionHistory)
      },
      /** 
       * When child Note is dragged, save new position to childNoteStorage
       */
      listenToDragAndUpdate: (ele) => { // #DEPRECATED 2018-03-21 18:27:58
        // not needed anymore, but the regex stuff is good, so save is somehow
        this.childNoteStorage.map( (note,index,array) => {
          if(note.id == ele.id) {
            let coord = ele.getBoundingClientRect() // get coords
            let string = ele.style.transform // adjust with style.tranform property applied from Draggable
            let regex = /(-?\d+(\.\d*)?)/g // matches 3 in "3d" aswell (still learning regex)
            let adjust = string.match(regex)
            // this.childNoteStorage[index].position.x = Math.round(coord.x) // adjust displayed position
            // this.childNoteStorage[index].position.y = Math.round(coord.y)
            // adjust saved position, note that above adjustment and this adjustment differ, since we don't change the style property of the element
            // Example for `left` style: 
            /** #DONT NEED IT, since position should be save in the save method
             * ele.left = 200px 
             * Draggable will adjust position with transfrom3d: transform(x,y,z)
             * In view: childNoteStorage[index].position adjusted
             * For database: childNoteStorage[index].position should be getBoundingClientRect()
             */
          }
        })
      },
      // should the content storage get a new key signaling that an element has been moved?
      saveChangesAndDelegateToView() { // #DEPRECATED 2018-03-21 18:28:41
        //get moved
        let moved = this.methods.childNotes.getMoved()
        // get corresponding childNoteStorage element and update position
      },
      /**
       * Helper to gather all elements that where moved and updates their position
       * @returns elements in childNoteStorage that where moved
       */
      getMoved: () => {
        // get all ele with class .movedDueDrag
        let movedElements = document.getElementsByClassName('movedDueDrag')
        // loop through all ele with class
        _.forOwn(movedElements, (movedEle,key) => {
          console.log(movedEle)
          let id = movedEle.id
          let newPosition = {
            x:movedEle.getBoundingClientRect().x,
            y:movedEle.getBoundingClientRect().y
          }
          this.childNoteStorage.map( childNote => {
            if(childNote.id == id) { // check which one matches 
              childNote.position = newPosition
              movedEle.style.transform = '' //resets transform of Draggable
              
            }
          })

        })
      }
    }
	}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Method old style: Consider putting these in the method object
//
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
  addFromDatabaseNew() {
    // console.log(this.databaseContent)
    // need to add a check for resize:
    // get database container (original) coords
    let originalContainerSize = this.databaseContent.containerSize
    // get current coords
    let currentContainerSize = document.getElementById("note-container").getBoundingClientRect()
    // compare
    let test = _.deepDifference(originalContainerSize, currentContainerSize)
    // if different resize accordingly
    this.databaseContent.content.map(ele => {
      this.childNoteStorage.push({
        id: ele.id,
        content: ele.content,
        position: {
          x: ele.position.x,
          y: ele.position.y
        },
        // position history in format of Draggable
        positionHistory: [ "translate3d(0px, 0px, 0px)" ]
      })
    })
    console.log(this.childNoteStorage)
  }
  
  delegateToParent() {
    console.log('​delegateToParent -> this.childNoteStorage', this.childNoteStorage);
    console.log('​WriteDragDrop -> delegateToParent -> this.methods.childNotes.getMoved()', this.methods.childNotes.getMoved());
    // this.methods.childNotes.saveChangesAndDelegateToView() 

    this.ctpWddTestdail = this.childNoteStorage
  }

  removeLast() {
    this.childNoteStorage.pop()
  }
  
  /** Add textarea at mouse position
   * 
   * 1. Click in id#container to add a textarea at mouseposition
   *   - If mouseclick is not directly in container textarea will not be created
   * 2. For the very first textarea a special method is called
   * 3. For subsequent textareas, create them with as you would expect it
   * 4. Push everything into childNoteStorage
   * 
   * @param event: takes in event to extract target id and position to create element
   * @returns 
   * 
   * @memberOf WriteDragDrop
   */
  addContentStorageElement(event) {
    // check whether target has container id
    if (event.target.id === "note-container" ? false : true) {
      return;
    }
    console.log('add new')
    // If content of last textarea is empty, delete it and create a new textarea at new place
    if (this.childNoteStorage.last()) {
      // counter to give each dataobject an id
      if (this.childNoteStorage.last().content === "") {
        this.childNoteStorage.pop()
      }
      let tempobj = {
        id: idCounter,
        content: "",
        position: {
          x: event.pageX,
          y: event.pageY
        }
      }
      this.childNoteStorage.push(tempobj)
    } else {
      let tempobj = {
        id: idCounter,
        content: "",
        position: {
          x: event.pageX,
          y: event.pageY
        }
      }
      this.childNoteStorage.push(tempobj)
    }
    ++idCounter
  }
}
