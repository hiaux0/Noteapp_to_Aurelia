import { inject } from 'aurelia-framework'
import {HttpClient,json} from 'aurelia-fetch-client'
import {EventAggregator} from 'aurelia-event-aggregator'

import { DatabaseAPI } from './database-api';
import { EntryDeleted, EntryUpdated } from './messages'

const client = new HttpClient()

@inject(DatabaseAPI, EventAggregator)
export class TestDetail {
  editRequested = true;
  route = "/route"
  id = null
  constructor(dbApi,ea) {
    this.ea = ea
    this.dbApi = dbApi 
    this.detail = ""
  }

  activate(params, routeConfig) {
    console.log("landed in detail")
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
          this.name = dataDetail.name
          this.connection = dataDetail.connection
        }
      })
  }

  editDetail() {
    this.editRequested = true
  }

  saveDetail() {
    // register changes to dataDetail
    this.dataDetail.name = this.name
    this.dataDetail.connectino = this.connection
    let updatedKeys = ["name","connection"]

    this.dbApi.put_database_entry(this.route, this.id, this.dataDetail)
    this.ea.publish(new EntryUpdated(this.dataDetail, updatedKeys))
  }

  deleteDetail() {
    this.dbApi.delete_database_entry(this.route,this.id)
    this.detail = ""
    this.ea.publish(new EntryDeleted(this.id))
  }

}
