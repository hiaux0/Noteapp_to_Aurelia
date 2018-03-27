import {inject} from 'aurelia-framework'

import {DatabaseAPI} from '../database-api'
// import { App } from '../app'

@inject(DatabaseAPI)
export class AllNbs {
  allNotebooks;
  constructor( dbAPI) {
    // this.app = app
    this.dbAPI = dbAPI
  }

  activate() {
    // this.allNotebooks = this.methods.notebooks.getNotebooks()
    return this.methods.notebooks.getNotebooks()
  }

  methods = {
    notebooks: {
      getNotebooks: () => {
        this.dbAPI.get_notebooks("/notebooks")
          .then(data => {
            console.log(data)
            this.allNotebooks = data
          })
      },
      postNotebook: () => {
        this.dbAPI.post_notebook("/notebooks", {
          title: "Fourth Notebook",
          topics: []
        })
      }
    }
  }
}
