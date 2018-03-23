import { inject } from 'aurelia-framework'
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator'
import { activationStrategy } from 'aurelia-router'

import { DatabaseAPI } from './database-api';
import { EntryDeleted, EntryUpdated } from './messages'
import connectArea from "./features/connect_areas/connect-areas"

const client = new HttpClient()

@inject(DatabaseAPI, EventAggregator)
export class App {
  route = "/notes"
  toggleHide = "Hide"
  toggleCreateNewNote = 'none'
  counter = 1
  dataMessage = []
  // obj to store info for naming title
  oneNameEditAtATime = {
    counter: 0,
    last: 0
  }
  
  constructor(dbAPI, ea) {
    this.dbAPI = dbAPI
    this.getData()

    ea.subscribe(EntryDeleted, msg => {
      this.dataMessage = this.dataMessage.filter(ele =>
        ele._id !== msg.deletedId
      )
    })

    // sub to changes of a dataDetail and updates it in real time
    ea.subscribe(EntryUpdated, msg => {
      this.dataMessage.map(ele => {
        if (ele._id === msg.updatedEntry._id) {
          msg.updatedKeys.forEach(key => {
            ele[key] = msg.updatedEntry[key]
          })
        }
      })
    })
  }

    /**
   * If double click on Note title, make it editable
   * @memberOf App
   */
  changeNoteName(ev) {
    let target = ev.target
    // If dblclick different title, remove focus and styles of last
    if(this.oneNameEditAtATime.counter === 1) {
      this.oneNameEditAtATime.last.style.backgroundColor = "#fff3e0"
      this.oneNameEditAtATime.last.setAttribute("contenteditable", false)
      this.oneNameEditAtATime.counter == 0;
    }
    this.oneNameEditAtATime.last = ev.target  
    // prepare name title change styles
    target.setAttribute("contenteditable", true)
    target.style.backgroundColor = "white"
    target.focus()
    
    console.log(this.oneNameEditAtATime.counter)
    target.addEventListener("keydown", function makeEditable(ev ) {
      let target = ev.target
      if (ev.which === 13) {
        ev.preventDefault()
        target.style.backgroundColor = "#fff3e0"
        target.setAttribute("contenteditable", false)
        target.removeEventListener("keydown", makeEditable)
        
      }
    })
    this.oneNameEditAtATime.counter = 1
  
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
    switch (this.toggleHide) {
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
          id: 1,
          content: "",
          position: {
            x: firstAreaPosition.x,
            y: firstAreaPosition.y
          }
        },
        latestId: 1,
        containerSize: coords
      })
      .then(data => {
        if(data.errors) {
          console.log(data)
        }
        this.dataMessage.push(data)
      })
    this.counter++
  }

  postNotebook() {
    let NotebookObject = {
      _id: "5ab3e23b5856a710664af067",
      title: "TestNotebook",
      topic: {
        _id: "5ab3e29d5856a710664af06b",
        title: "Learning Nested Documents",
        notes: [
          {
            _id: "5ab3e29d5856a710664af06c",
            content: "some"
          },
          {
            _id: "5ab3e29d5856a710664af061",
            content: "test"
          }
        ]
      }
    }
    console.log(NotebookObject)
    this.dbAPI.post_database_entry(this.route,NotebookObject)
    .then(data => {
      if(data.errors) console.log(data)
      console.log(data)
    })

  }
  
  dropData() {
    client.fetch("http://localhost:3000/route", {
        method: "delete"
      })
      .then(response => response.json())
      .then(data => {
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
    config.map([{
        route: ['', 'home'],
        name: 'home',
        moduleId: 'router_display',
        nav: true,
        title: "Home"
      },
      {
        route: 'notebooks',
        name: 'notebooks',
        moduleId: './views/notebooks.view',
        nav: true,
        title: 'Notebooks'
      },
      {
        route: 'notes',
        name: 'notes',
        moduleId: 'router_display',
        nav: true,
        title: 'Notes'
      },
      {
        route: 'notes/:id',
        name: 'routeDetail',
        moduleId: './note_detail'
      },
      {
        route: 'playground',
        name: 'playground',
        moduleId: './playground/play',
        nav: true,
        title: 'Playground'
      },
      {
        route: 'threelines',
        name: 'threelines',
        moduleId: './features/gsap/connect-with-line',
        nav: true,
        title: '3 Lines'
      }
    ]);
    this.router = router;

  }
}
