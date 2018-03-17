import {inject} from 'aurelia-framework'
import {HttpClient, json} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator'
import { activationStrategy } from 'aurelia-router'

import {DatabaseAPI} from './database-api';
import {EntryDeleted, EntryUpdated} from './messages'
import connectArea from "./features/connect_area/connect-area"

const client = new HttpClient()

@inject(DatabaseAPI,EventAggregator)
export class App {
  route = "/notes"
  toggleHide = "Hide"
  toggleCreateNewNote = 'none'

  constructor(dbAPI,ea) {
    this.dbAPI = dbAPI 
    this.counter = 1
    this.dataMessage = []
    this.getData()

    ea.subscribe(EntryDeleted, msg => {
      this.dataMessage = this.dataMessage.filter(ele => 
        ele._id !== msg.deletedId
      )
    })
    
    // sub to changes of a dataDetail and updates it in real time
    ea.subscribe(EntryUpdated, msg => {
      this.dataMessage.map( ele => {
        if (ele._id === msg.updatedEntry._id) {
          msg.updatedKeys.forEach(key => {
            ele[key] = msg.updatedEntry[key]
          })
        }
      })
    })
    // show x and y pos of mouse
 
  }

  updateX(ev) {
    this.xcoord = ev.pageX
    this.ycoord = ev.pageY
  }

  createNewNote() {
    document.getElementById("create-new-note").style.display = "flex"
    $("#create-new-note > form > input").focus()
  }

  postNewNote() {
    this.postData()
    this.newNoteTitle = ""
    document.getElementById("create-new-note").style.display = "none"    

  }

    

 

  /**
   * Show or hide the navbar
   * @memberOf App
   */
  toggleNavbar() {
    switch(this.toggleHide) {
      case "Hide":
        document.getElementById("custom-navbar").style.display = "none"
        this.toggleHide = "Show"
        break
      case "Show":
        document.getElementById("custom-navbar").style.display = "flex"
        this.toggleHide = "Hide"
        break        
    }
  }
   
  getData() {
    this.dbAPI.get_database_entries(this.route)
      .then(data => {
        this.dataMessage = data
      })
  }
  postData() {
    // console.log(document.getElementById("note-container"))
    let coords = document.getElementById("note-container").getBoundingClientRect() 
    let firstAreaPosition = connectArea.rectangle.getMiddlePoint(
      coords.x,
      coords.y,
      coords.height,
      coords.width
    )
    this.dbAPI.post_database_entry(this.route, {
      title: `${this.newNoteTitle}`,
      content: {
        id:1,
        content: "",
        position: {
          x: firstAreaPosition.x,
          y: firstAreaPosition.y
        }
      }
    })
      .then( data => {
        this.dataMessage.push(data)
      })
    this.counter++
  }
  dropData() {
    client.fetch("http://localhost:3000/route", {
      method: "delete"
    })
      .then(response => response.json())
      .then( data => {
        this.dataMessage = []
        console.log(data)
      })
  }
  test() {
    console.log("test success")
  }
  configureRouter(config, router) {
    config.options.pushState = true;
    config.options.root = '/';
    config.title = 'Notes';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'router_display', nav: true, title: "Home" 
      },
      { route: 'notes', name: 'notes', moduleId: 'router_display', nav: true, title: 'Notes'
      },
      { route: 'notes/:id', name: 'routeDetail', moduleId: 'note_detail' 
      },
    ]);
    this.router = router;

  }
}

