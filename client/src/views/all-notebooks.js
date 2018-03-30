import {inject} from 'aurelia-framework'

import {DatabaseAPI} from '../database-api'
// import { App } from '../app'

@inject(DatabaseAPI)
export class AllNotebooks {
  allNotebooks;
  constructor( dbAPI) {
    // this.app = app
    this.dbAPI = dbAPI
  }

  determineActivationStrategy() { return "replace" }// return "invoke-lifecycle" }

  activate() {
    // this.allNotebooks = this.m.notebooks.getNotebooks()
    return this.m.notebooks.getNotebooks()
  }

  m = {
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
          title: this.newNotebookTitle,
          topics: []
        }).then( data => {
          console.log(data)
          this.allNotebooks.push(data)
        })
        this.m.notebooks.getNotebooks()
      },
    },
    view: {
      createNewNotebook: () => {
        document.getElementById("create-new-note").style.display = "flex"
        $("#create-new-note > form > input").focus()
      },
      cancelTopicCreation: (ev) => {
        ev.preventDefault()
        document.getElementById("create-new-note").style.display = "none"
      },
      dropAllNotebooks: () => {
        this.dbAPI.drop_all_notebooks()
      }
    }
  }
}
