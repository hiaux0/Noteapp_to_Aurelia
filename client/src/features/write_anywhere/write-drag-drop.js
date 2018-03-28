import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { activationStrategy, Router } from 'aurelia-router'

import { NewEntrySelected, EntryUpdated } from "../../messages"
import helper from '../helper_lib'
import connectArea from '../connect_areas/connect-areas'
import { DatabaseAPI } from '../../database-api';
import Draggable from "gsap/Draggable";

let idCounter = 1;

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

@inject(DatabaseAPI, Element, EventAggregator, Router)
export class WriteDragDrop {
  draggableToggle = false
  Draggable = Draggable
  firstDrag = true
  currentTopic
  /**
   * Should be of the from
   * 
   * 
   * @memberOf WriteDragDrop
   */
  @bindable databaseContent
  @bindable ctpWddTopics // child to parent (child = wdd, parent = testdetail)

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Initializing Component 
//
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

  constructor(dbAPI, element, ea, router) {
    this.dbAPI = dbAPI
    this.ea = ea
    this.element = element
    this.childNoteStorage = []
    this.router = router
  }

  attached() {
    // connectArea.listenToConnect()
    /* on activation get the route/id from */
    // this.dbAPI.get_one_database_entry("/notes", this.ctpWddTopics).then(data => {
    //   this.m.init.addFromDatabaseNew()
    // })
    console.log('new?')
    this.m.topics.getTopicFromNotebook()
  }

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Method Object
//
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

	m = {
    childNotes: {
      /**
       * Every time a note is dragged, add its position to history
       * //TODO consider adding a limit;
       */
      addToPositionHistory: (ele) => {
        let storageEle = this.findInChildNoteStorage(ele)
        // push new position to history
        storageEle.positionHistory.push(ele.style.transform)
      },
      /**
       * @param ele From `ele` get its "latest" previous positions. NOTE latest position saved in Draggable format, ie a string "tranform3d(x,y,z)"
       * @returns x and y coordinates
       */
      getPreviousPosition: (ele) => {
        // prepare variables
        let storageElement = this.findInChildNoteStorage(ele)
        let prevPos = storageElement.positionHistory
        let originalPos = prevPos[0]
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
       * @returns elements in childNoteStorage that where moved
       */
      saveChangesOfDragged: () => {
        // turn on firstDrag, since this method will save(reset) the .style. position
        this.firstDrag = true
        // get all ele with class .movedDueDrag
        let movedElements = document.getElementsByClassName('movedDueDrag')
        // loop through all ele with class
        _.forOwn(movedElements, (movedEle, key) => {
          console.log('​WriteDragDrop -> saveChangesOfDragged');
          let id = movedEle.id
          let newPosition = {
            x: movedEle.getBoundingClientRect().x,
            y: movedEle.getBoundingClientRect().y
          }
          console.log(newPosition)
          this.childNoteStorage.map(childNote => {
            if (childNote.id == id) { // check which one matches 
              childNote.position = newPosition
              movedEle.style.transform = '' //resets transform of Draggable
            }
          })
        })
      }
    },
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
                onDragStart: () => {
                  /** 
                   * First drag needs extra care due to Draggable behaviour, ie. transform3d(x,y,z ) 
                   * If not adjusted like below dyn area will jump around since you save new x and y's 
                   * but transform will ALWAYS be relative to ORIGINAL x and
                   */
                  if(this.firstDrag) { 
                    // x position
                    this.findInChildNoteStorage(ele).position.x = this.findInChildNoteStorage(ele).position.x - this.m.childNotes.getPreviousPosition(ele).x * 1
                    // y position
                    this.findInChildNoteStorage(ele).position.y = this.findInChildNoteStorage(ele).position.y - this.m.childNotes.getPreviousPosition(ele).y * 1
                    // turn off firstDrag
                    this.firstDrag = false
                  }
                  
                },
                onDragEnd: () => {
                  ele.classList.add('movedDueDrag')              
                  this.m.childNotes.addToPositionHistory(ele)
                  
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
    init: {
      /** 
       * Initialize database content with databaseContent received from note_detail
       */
      addFromDatabaseNew: () => {
        console.log('in here')
            // need to add a check for resize: #TODO 2018-03-22 00:14:43
            // get database container (original) coords
            let originalContainerSize = this.databaseContent.containerSize
            // get current coords
            let currentContainerSize = document.getElementById("note-container").getBoundingClientRect()
            // compare
            let test = _.deepDifference(originalContainerSize, currentContainerSize)
            // if different resize accordingly
        // idCounter = this.databaseContent.latestId #TODO 2018-03-27 17:36:01 uncomment when notebooks routes are finished
        this.databaseContent.content.map(ele => { //$WORKINGON_STEP2
          this.childNoteStorage.push({
            id: ele.id,
            content: ele.content,
            position: {
              x: ele.position.x,
              y: ele.position.y
            },
            // position history in format of Draggable
            positionHistory: [{
              x: ele.position.x,
              y: ele.position.y
            }]
          })
        })

      }
    },
    dynamicTextarea: {
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
        */
      addDynamicChildNote: (ev) => {
        // check whether target has container id
        if (ev.target.id === "note-container" ? false : true) {
          return;
        }
        // If content of last textarea is empty, delete it and create a new textarea at new place
        if (this.childNoteStorage.last()) {
          // counter to give each dataobject an id
          if (this.childNoteStorage.last().content === "") {
            this.childNoteStorage.pop()
            --idCounter // if empty dyn area gets deleted adjust idCounter
          }
          let tempobj = {
            id: idCounter,
            content: "",
            position: {
              x: ev.pageX,
              y: ev.pageY
            },
            // position history in format of Draggable
            positionHistory: [{
              x: ev.pageX,
              y: ev.pageY
            }]
          }
          this.childNoteStorage.push(tempobj)
        } else {
          let tempobj = {
            id: idCounter,
            content: "",
            position: {
              x: ev.pageX,
              y: ev.pageY
            },
            // position history in format of Draggable
            positionHistory: [{
              x: ev.pageX,
              y: ev.pageY
            }]
          }
          this.childNoteStorage.push(tempobj)
        }
        this.databaseContent.latestId = idCounter++
      }
    },
    topics: {
      getTopicFromNotebook: () => {
        this.router
        console.log('get one topic')
        let nbId = this.router.currentInstruction.params.nbid
        let tId = this.router.currentInstruction.params.tid
        this.dbAPI.get_topic_from_notebook(nbId, tId)
          .then(topic => {
            if(topic.error) {return topic}
            console.log(topic[0].topics[0].notes)
            this.childNoteStorage = topic[0].topics[0].notes
            console.log('​WriteDragDrop -> this.childNoteStorage', this.childNoteStorage);
            
          })
      },
      reveal: () => {
        // databaseContent provides me the whole notebook
        console.log(this)
        console.log('​WriteDragDrop -> this.currentTopic', this.currentTopic);
        this.reveal = this.currentTopic
        console.log('​WriteDragDrop -> this.reveal', this.reveal);
        this.allChildNotes = this.reveal
        console.log('​WriteDragDrop -> this.allChildNotes', this.allChildNotes);
        this.childNoteStorage = this.allChildNotes
      },
      validateTopicSchema: () => {
        let topic = {
          title: this.currentTopic[0].topics[0].title,
          notes: this.currentTopic[0].topics[0].content,
          containerSize: document.getElementById('note-container').getBoundingClientRect()
        }
        console.log(topic)
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
 
  delegateToParent() {
    this.m.childNotes.saveChangesOfDragged() 
    this.ctpWddTopics = this.childNoteStorage
    console.log('​WriteDragDrop -> delegateToParent -> this.childNoteStorage', this.ctpWddTopics);
  }

  /**
   * Takes in HTML element and
   * @returns corresponding element in storage
   */
  findInChildNoteStorage(ele) {
    let result;
    let id = ele.id
    this.childNoteStorage.map( childNote => {
      if(childNote.id == id) {
        result = childNote;
      }
    })
    return result
  }

  removeLast() {
    this.childNoteStorage.pop()
  }
  
}
