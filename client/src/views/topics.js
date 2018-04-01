import {inject} from 'aurelia-framework'
import { Router, Redirect } from 'aurelia-router';

import {NotebooksRouter} from '../routes/notebooks-router'
import {DatabaseAPI} from '../database-api'
import { App } from '../app'
import {WriteDragDrop} from '../features/write_anywhere/write-drag-drop'

@inject(NotebooksRouter, App, DatabaseAPI, Router, WriteDragDrop)
export class Topics {
  currentNotebook
  notesFromWDD
  // topic_clicked

  constructor(nbsRouter, app, dbAPI,router, wdd) {
    this.nbsRouter = nbsRouter
    this.app = app
    this.dbAPI = dbAPI
    this.mockData = this.nbsRouter.mockData
    this.router = router
    this.wdd = wdd
  }

  activate(params) {
    this.params = params
    this.nbId = params.nbid
    this.tId = params.tid
    // return new Redirect("/tId")
    return this.m.http.getTopicsFromNotebook(this.nbId)
    
  }
  
  canActivate(params) {
      if (params.tid) {
        this.topic_clicked = true
      } 
  }

  determineActivationStrategy() { return "replace" }// return "invoke-lifecycle" }

  m = {
    http: {
      createNewTopic: () => {
       
      },
      deleteTopic: () => {
        this.dbAPI.delete_a_topic_from_notebook(this.nbId, this.tId)
          .then(response => {
            console.log(response)
          })
      },
      getTopicsFromNotebook: (nbId) => {
        this.dbAPI.get_topics_from_notebook('/notebooks', nbId)
          .then(data => {
            if(data === null) {
              console.log("data null")
              throw new Error("This notebook was deleted") 
            } else { 
              this.currentNotebook = data 
          }
          })
      },
      postNewEmptyTopic: () => {
        console.log(this.newEmptyTopicTitle)
        let new_t = {
          title: this.newEmptyTopicTitle,
          notes: [],
          // containerSize: document.getElementById('note-container').getBoundingClientRect(),
          containerSize: {}, // #FIXME #3003oiejfo : no boundingRect specified, thus need to update it later, maybe after first save?
          latestId: 0
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
        // update latestId
        let patch_latestId_in_topic = {latestId: this.latestId}
        this.m.http.patchCurrentTopic(patch_latestId_in_topic)
        this.dbAPI.notes.post_notes_to_topic_from_notebook(this.nbId, this.tId,this.notesFromWDD)
          .then(data => {
            // console.log(data)
          })
      },
      patchCurrentTopic: (topicPatch) => {
        this.dbAPI.patch_topic_from_notebook(this.nbId, this.tId, topicPatch)
          .then(data => {
            console.log(data)
          })
      }
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
      },
      test: () => {
        console.log("testerr")
      },
      toggle_topic_clicked: (bool) => {
        this.topic_clicked = bool

        // switch (bool) {
        //   case true:
        //     this.topic_clicked = false
        //     console.log(this.topic_clicked)
        //     break;
        //     case false:
        //     this.topic_clicked = true
        //     console.log(this.topic_clicked)
        //     break;
        // }
      },
      topic_detail_async: new Promise( resolve => {
        if (this.topic_clicked) {
          resolve(this.params)
        }
      })
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
   
      // provide_topic_for_view: (nbId, tId) => {
      //   console.log('get one topic')
      //   // let nbId = this.router.currentInstruction.params.nbid
      //   // let tId = this.router.currentInstruction.params.tid
      //   this.dbAPI.get_topic_from_notebook(nbId, tId)
      //     .then(topic => {
      //       if (topic.error) { return topic } // dirty cases
      //       // set _idCounter
      //       // _idCounter = topic[0].topics[0].latestId #TODO
      //       //
      //       console.log(topic[0].topics[0].notes)
      //       this.provide_topic = new Promise(resolve => {
      //         this.provide_topic = topic[0].topics[0].notes
      //         resolve(this.provide_topic)
      //       })
      //       console.log('​WriteDragDrop -> this.childNoteStorage', this.provide_topic);
      //     })

      // }
    }
  }
}
