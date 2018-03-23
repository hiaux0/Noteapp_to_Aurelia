import {inject} from 'aurelia-framework'

import { DatabaseAPI } from '../database-api';

@inject(DatabaseAPI)
export class NoteBooksView {
  constructor(dbAPI) {
    this.greeting = "In Notebooks"
    this.dbAPI = dbAPI
  }

  mockData = {
    _id: '15shts4eohts',
    title: 'First Notebook',
    topics: [
      { _id: 'nt2htshnt21enth',
        title: 'Aurelia child routes',
        notes: [
          {
            id: 1,
            content: 'important note',
            position: {x: 329, y: 264},
          },
          {
            id: 2,
            content: 'not so cool note here',
            position: {x: 389, y: 229}
          }
        ]
      },
      { _id: 'nt2h2380t21enth',
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
    }
  }

}
