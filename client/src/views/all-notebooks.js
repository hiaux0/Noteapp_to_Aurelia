import {inject} from 'aurelia-framework'

import {App} from '../app'
import { DatabaseAPI } from '../database-api';

@inject(App, DatabaseAPI)
export class AllNotebooks {
  constructor(app,dbAPI) {
    this.greeting = 'Display All notebooks here'
    this.app = app
    this.dbAPI = dbAPI
  }

  determineActivationStrategy() {
    // return "invoke-lifecycle"
    return "replace"
  }

  mockData = {
    _id: '15shts4eohts',
    title: 'First Notebook',
    topics: [
      {
        _id: 'nt2htshnt21enth',
        title: 'Aurelia child routes',
        notes: [
          {
            id: 1,
            content: 'important note',
            position: { x: 329, y: 264 },
          },
          {
            id: 2,
            content: 'not so cool note here',
            position: { x: 389, y: 229 }
          }
        ]
      },
      {
        _id: 'nt2h2380t21enth',
        title: 'Functional Programming',
        notes: [
          {
            id: 1,
            content: 'important note',
            position: { x: 329, y: 264 },
          },
          {
            id: 2,
            content: 'not so cool note here',
            position: { x: 389, y: 229 }
          }
        ]
      }
    ]
  }  
  methods = {
    http: {
      getNotebooks: () => {
        this.dbAPI.get_notebooks("/notebooks")
          .then(data => {
            console.log(data)
          })
      }
    },
    topics: {
      cancelTopicCreation: (ev) => {
        ev.preventDefault()
        document.getElementById("create-new-note").style.display = "none"
      }
    },
    utils: {
      updateX: (ev) => {
        this.app.xcoord = ev.pageX
        this.app.ycoord = ev.pageY
      }
    }
  }
  configureRouter(config, router) {
    config.options.pushState = true;
    config.options.root = '/notebooks';
    config.title = 'Notebooks';
    config.map([
      { route: '', redirect: 'topics', },
      // { route: '/no', name: 'allNotebooks', title: 'All Notebooks', moduleId: '../views/all-notebooks' },
      { route: 'topics', name: 'topics', title: 'Topics', moduleId: '../views/topics', nav: true },
      { route: 'topics/:tid', name: 'topicsDetail', title: 'Topics Detail', moduleId: '../views/topics' }
    ]);
    this.router = router;
  }
}
