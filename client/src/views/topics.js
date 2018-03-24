import {inject} from 'aurelia-framework'

import {AllNotebooks} from './all-notebooks'

@inject(AllNotebooks)
export class Topics {
  constructor(AllNotebooks) {
    this.greeting = 'Hello from topics'
    this.AllNotebooks = AllNotebooks
    this.mockData = this.AllNotebooks.mockData
  }
}
