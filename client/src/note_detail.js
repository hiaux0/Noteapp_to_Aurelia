import { inject } from 'aurelia-framework'
import {HttpClient,json} from 'aurelia-fetch-client'
import {EventAggregator} from 'aurelia-event-aggregator'
import { activationStrategy } from 'aurelia-router';

import { DatabaseAPI } from './database-api';
import { EntryDeleted, EntryUpdated, NewEntrySelected } from './messages'
import {WriteDragDrop} from './features/write_anywhere/write-drag-drop'

const client = new HttpClient()

@inject(DatabaseAPI, EventAggregator)
export class TestDetail {
  editRequested = true;
  route = "/notes"
  id = null

  constructor(dbAPI, ea) {
    this.ea = ea
    this.dbAPI = dbAPI 
    this.detail = ""
  }

  determineActivationStrategy() {
    // return "invoke-lifecycle"
    return "replace"
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.params = params
    this.id = this.params.id
    // on activation send the id to wdd, note that after that this.fromChildWDD will assume it standard purpose
    this.fromChildWDD = this.id
    return this.getDataDetail()
  }

  getDataDetail() {
    this.dbAPI.get_one_database_entry(this.route,this.id)
      .then(dataDetail => {
        if (dataDetail) {
          // console.log(dataDetail)
          // {id,content,position,latestId}
          this.dataDetail = dataDetail
          // this.detailId = dataDetail._id
          this.title = dataDetail.title
          
        }
      })
  }

  editDetail() {
    this.editRequested = true
  }

  saveDetail() {
    console.log("prepare to save ")
    // register changes to dataDetail
    console.log(this.fromChildWDD)
    this.dataDetail.title = this.title
    this.dataDetail.content = this.fromChildWDD
    let updatedKeys = ["title","content"]

    this.dbAPI.put_database_entry(this.route, this.id, this.dataDetail)
    this.ea.publish(new EntryUpdated(this.dataDetail, updatedKeys))
  }

  deleteDetail() {
    this.dbAPI.delete_database_entry(this.route,this.id)
    this.detail = ""
    this.ea.publish(new EntryDeleted(this.id))
  }

}
