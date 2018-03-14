import { TaskQueue, inject } from 'aurelia-framework'
import {HttpClient,json} from 'aurelia-fetch-client'
import {EventAggregator} from 'aurelia-event-aggregator'
import { activationStrategy } from 'aurelia-router';

import { DatabaseAPI } from './database-api';
import { EntryDeleted, EntryUpdated, NewEntrySelected } from './messages'

const client = new HttpClient()

@inject(DatabaseAPI, EventAggregator, TaskQueue)
export class TestDetail {
  editRequested = true;
  route = "/notes"
  id = null

  constructor(dbApi, ea, TaskQueue) {
    this.taskQueue = TaskQueue;    
    this.ea = ea
    this.dbApi = dbApi 
    this.detail = ""
  }

  // determineActivationStrategy() {
  //   return "invoke-lifecycle"
  //   // return "replace"
  // }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.params = params
    this.id = this.params.id
    return this.getDataDetail()
  }

  getDataDetail() {
    this.dbApi.get_one_database_entry(this.route,this.id)
      .then(dataDetail => {
        if (dataDetail) {
          this.dataDetail = dataDetail
          this.detailId = dataDetail._id
          this.title = dataDetail.title
          this.content = dataDetail.content
        }
      })
  }

  editDetail() {
    this.editRequested = true
  }

  saveDetail() {
    // register changes to dataDetail
    this.dataDetail.title = this.title
    this.dataDetail.content = this.content
    let updatedKeys = ["title","content"]

    this.dbApi.put_database_entry(this.route, this.id, this.dataDetail)
    this.ea.publish(new EntryUpdated(this.dataDetail, updatedKeys))
  }

  deleteDetail() {
    this.dbApi.delete_database_entry(this.route,this.id)
    this.detail = ""
    this.ea.publish(new EntryDeleted(this.id))
  }

}
