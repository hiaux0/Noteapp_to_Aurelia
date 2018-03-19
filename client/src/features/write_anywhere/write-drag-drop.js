import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { activationStrategy, Router } from 'aurelia-router'

import { NewEntrySelected, EntryUpdated } from "../../messages"
import helper from '../helper_lib'
import connectArea from '../connect_area/connect-area'
import { DatabaseAPI } from '../../database-api';
import 'gsap'
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

@inject(DatabaseAPI, Element, EventAggregator)
export class WriteDragDrop {
  @bindable databaseContent
  @bindable ctpWddTestdail // child to parent (child = wdd, parent = testdetail)

  constructor(dbAPI, element, ea) {
    this.dbAPI = dbAPI
    this.ea = ea
    this.element = element
    this.contentStorage = []
  }

  attached() {
    // this.addFromDatabase()

    connectArea.listenToConnect()
    // on activation get the route/id from
    this.dbAPI.get_one_database_entry("/notes", this.ctpWddTestdail).then(data => {
      this.contentStorageOne = (data)
      // console.log(this.contentStorageOne)
      setTimeout(this.addFromDatabaseNew(), 0)
    })
  }
  addFromDatabaseNew() {
		// console.log(this.databaseContent)
		// need to add a check for resize:
			// get database container (original) coords
		let originalContainerSize = this.databaseContent.containerSize
			// get current coords
		let currentContainerSize = document.getElementById("note-container").getBoundingClientRect()
			// compare
		let test = _.deepDifference(originalContainerSize,currentContainerSize)
			// if different resize accordingly
		this.databaseContent.content.map(ele => {
			this.contentStorage.push({
				id: ele.id,
				content: ele.content,
				position: {
					x: ele.position.x,
					y: ele.position.y
				}
			})
		})
  }
	
	method = {
		draggable: {
			/**
			 * make all dyn TA draggable
			 * 
			 */
			makeDraggable: function() {
				let noteContainer = document.getElementById('note-container')
				let children = noteContainer.children
				console.log(children[0])
				Array.from(children).map( ele => {
					console.log(ele.children)
					Draggable.create(ele.children[0], {
						onDrag: function(ev) {
							console.log(ev)
						}
					})
				})
			}
		}
	}

  delegateToParent() {
    console.log(this.contentStorage)
    this.ctpWddTestdail = this.contentStorage
  }
  // ctpWddTestdailChanged(name, newValue, oldValue) {
  //     console.log(name)
  //     console.log(newValue)
  // }

  getConnectStorageSize() {
    connectArea.getConnectStorageSize()
  }
  clearCanvas() {
    this.contentStorage.length = 0
    this.contentStorage.push({})
  }

  removeLast() {
    this.contentStorage.pop()
  }
  multipleCalls(event) {
    this.addContentStorageElement(event)
  }
  addFromDatabase() { // DEPRECATED
    const container = document.getElementById("note-container")
    const pos_of_db_ele = container.getBoundingClientRect()
    // console.log("this dbcont", this.databasecontent)
    const cont = this.databaseContent.content
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
    if (event.target.id === "note-container" ? false : true) {
      return;
    }
    // If content of last textarea is empty, delete it and create a new textarea at new place
    if (this.contentStorage.last()) {
      // console.log("1 this is the last element", this.contentStorage.last())
      // console.log("2 and it' content: \"", this.contentStorage.last().content, "\"")
      // console.log("3 it's id: ", this.contentStorage.last().id)

      // counter to give each dataobject an id
      if (this.contentStorage.last().content === "") {
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
