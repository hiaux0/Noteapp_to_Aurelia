import {inject} from 'aurelia-framework'
import {HttpClient, json} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator'

import {DatabaseAPI} from './database-api';
import {EntryDeleted, EntryUpdated} from './messages'

const client = new HttpClient()

@inject(DatabaseAPI,EventAggregator)
export class App {
  route = "/notes"
  
  constructor(dbApi,ea) {
    this.dbApi = dbApi 
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
  }
   
  getData() {
    this.dbApi.get_database_entries(this.route)
      .then(data => {
        console.log(data)
        this.dataMessage = data
      })
  }

  postData() {
    this.dbApi.post_database_entry(this.route, {
      content: `${this.counter}`,
      title: `test ${this.counter}`
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

  configureRouter(config, router) {
    this.router = router;
    config.options.pushState = true;
    config.options.root = '/';
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'router_display', nav: true, title: "Home" },
      { route: 'notes', name: 'notes', moduleId: 'router_display', nav: true, title: 'Notes' },
      { route: 'notes/:id', name: 'routeDetail', moduleId: 'test_detail' },
    ]);
    this.router = router;

  }
}

