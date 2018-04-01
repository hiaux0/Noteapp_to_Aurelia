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
  route = "/notes" // #DEPRECATED
  navbarHidden = false
  toggleCreateNewNote = 'none'
  counter = 1 // #DEPRECATED
  dataMessage = [] // #DEPRECATED
  // obj to store info for naming title
  oneNameEditAtATime = {
    counter: 0,
    last: 0
  }
  xcoord // utils for displaying mouth position in x-y coords
  ycoord

  constructor(dbAPI, ea) {
    this.dbAPI = dbAPI
    // this.getData()
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
  attached() {
    // navbar toggle option
    this.navbarHidden ? this.navbarToggleStyle = 'display:none' : this.navbarToggleStyle = 'display:flex'
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
      this.oneNameEditAtATime.last.focus()
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
    switch (this.navbarHidden) {
      case false:
        document.getElementById("custom-navbar").style.display = "none"
        this.navbarHidden = true
        break
      case true:
        document.getElementById("custom-navbar").style.display = "flex"
        this.navbarHidden = false
        break
    }
  }

  test() {
    console.log("test success")
  }
  configureRouter(config, router) {
    config.options.pushState = true;
    config.options.root = '/';
    config.title = 'Notes';
    config.map([
      {route: ['', 'home'],name: 'home',      moduleId: './views/home', nav: true, title: "Home" },
      {route: 'notebooks' ,name: 'notebooks', moduleId: './routes/notebooks-router', nav: true, title: 'Notebooks'},
      {route: 'playground',name: 'playground',moduleId: './playground/play', nav: true, title: 'Playground' },
      {route: 'threelines',name: 'threelines',moduleId: './features/gsap/connect-with-line', nav: true,
        title: '3 Lines'},
      {route: 'cm',        name: 'cm',        moduleId: './playground/latest/cm', nav: true, title: "Context Menu"}
    ]);
    this.router = router;
  }
}
