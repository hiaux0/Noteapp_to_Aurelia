//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Imports
 //^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////

import {inject} from 'aurelia-framework'
import { Router, Redirect } from 'aurelia-router';

import {DatabaseAPI} from '../database-api'
import { App } from '../app'

@inject( App, DatabaseAPI, Router)
export class Topics {
  currentNotebook
  notesFromWDD
  // topic_clicked

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//        Component Initialization
  //^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  constructor( app, dbAPI,router) {
    this.app = app
    this.dbAPI = dbAPI
    this.router = router
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
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Methods
 //^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////
  m = {
    http: {
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
      patchCurrentTopic: (topicPatch) => {
        this.dbAPI.patch_topic_from_notebook(this.nbId, this.tId, topicPatch)
          .then(data => {
            console.log(data)
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
    },
    utils: {
      updateX: (ev) => {
        this.app.xcoord = ev.pageX
        this.app.ycoord = ev.pageY
      },
      test: () => {
        console.log("testerr")
      },
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
    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Playground
 //^
 /////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////
}
