import {inject} from 'aurelia-framework'

import {AllNotebooks} from './all-notebooks'

@inject(AllNotebooks)
export class Topics {
  constructor(AllNotebooks) {
    this.greeting = 'Hello from topics'
    this.AllNotebooks = AllNotebooks
    this.mockData = this.AllNotebooks.mockData
  }

  created() {
    this.topicId = (this.AllNotebooks.router.currentInstruction.params.tid)
    // let arr = this.methods.mockData.filterTopic(this.topicId)
    // console.log(arr[0].notes)
  }

  methods = {
    mockData: {
      filterTopic: (topicId) => {
        return this.mockData.topics.filter( ele => this.methods.mockData.filterIdOfTopic(ele,topicId)  )
      },
      filterIdOfTopic: (topicsArray, topicId) =>  
        (topicsArray._id == topicId) ? true : false 
    }
  }
}
