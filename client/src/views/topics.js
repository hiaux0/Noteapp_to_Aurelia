import {inject} from 'aurelia-framework'

import {NotebooksRouter} from '../routes/notebooks-router'
import {DatabaseAPI} from '../database-api'
import { App } from '../app'

@inject(NotebooksRouter,App,DatabaseAPI)
export class Topics {
  currentNotebook
  notesFromWDD
  constructor(nbsRouter, app, dbAPI) {
    this.nbsRouter = nbsRouter
    this.app = app
    this.dbAPI = dbAPI
    this.mockData = this.nbsRouter.mockData
  }

  activate(params) {
    this.nbId = params.nbid
    this.tId = params.tid
    console.log('activated')
    return this.m.http.getTopicsFromNotebook(this.nbId)
  }

  determineActivationStrategy() { return "replace" }// return "invoke-lifecycle" }

  m = {
    http: {
      createNewTopic: () => {
       
      },
      
      getTopicsFromNotebook: (nbId) => {
        this.dbAPI.get_topics_from_notebook('/notebooks', nbId)
          .then(data => {
            if(data.error) {return data}
            this.currentNotebook = data 
            console.log('​Topics -> this.currentNotebook', this.currentNotebook);
          })
      },
      postNewEmptyTopic: () => {
        console.log(this.newEmptyTopicTitle)
        let new_t = {
          title: this.newEmptyTopicTitle,
          notes: [],
          containerSize: document.getElementById('note-container').getBoundingClientRect()
        }
        console.log(new_t.containerSize)
        this.dbAPI.post_new_topic_to_notebook(this.nbId, new_t).then(data => {
          console.log(data)
          this.currentNotebook=data
          document.getElementById("create-new-note-db").style.display = "none"
        })
      },
      postNotesToTopic: () => {
        console.log(this.notesFromWDD)
        this.dbAPI.put_topic_from_notebook(this.nbId, this.tId,this.notesFromWDD)
          .then(data => {
            // console.log(data)
          })
      },
    },
    mockData: {
      filterTopic: (tId) => {
        return this.mockData.topics.filter( ele => this.m.mockData.filterIdOfTopic(ele,tId)  )
      },
      filterIdOfTopic: (topicsArray, tId) =>  
        (topicsArray._id == tId) ? true : false 
    },
    utils: {
      updateX: (ev) => {
        this.app.xcoord = ev.pageX
        this.app.ycoord = ev.pageY
      }
    },
    view: {
      createNewNote: () => {
        document.getElementById("create-new-note-db").style.display = "flex" //#ADJUST delete in eleby id "-db"
        $("#create-new-note-db > form > input").focus()
      },
      cancelTopicCreation: (ev) => {
        ev.preventDefault()
        document.getElementById("create-new-note-db").style.display = "none"
      },
      deleteTopic: () => {
        this.dbAPI
      }
    }
  }
}
