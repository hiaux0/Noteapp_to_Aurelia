import {inject} from 'aurelia-framework'

import {AllNotebooks} from './all-notebooks'
import { App } from '../app'

@inject(AllNotebooks,App)
export class Topics {
  constructor(allNbs, app) {
    this.allNbs = allNbs
    this.app = app
    this.mockData = this.allNbs.mockData
  }

  created() {
    this.topicId = (this.allNbs.router.currentInstruction.params.tid)
    // let arr = this.methods.mockData.filterTopic(this.topicId)
    // console.log(arr[0].notes)
    console.log(this.allNbs.router)
    this.nbId = this.allNbs.router.currentInstruction.params.nbid
  }

  methods = {
    mockData: {
      filterTopic: (topicId) => {
        return this.mockData.topics.filter( ele => this.methods.mockData.filterIdOfTopic(ele,topicId)  )
      },
      filterIdOfTopic: (topicsArray, topicId) =>  
        (topicsArray._id == topicId) ? true : false 
    },
    utils: {
      updateX: (ev) => {
        this.app.xcoord = ev.pageX
        this.app.ycoord = ev.pageY
      }
    }
  }
}
