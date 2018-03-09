import {HttpClient, json} from 'aurelia-fetch-client' 

const client = new HttpClient()

export class App {
  constructor() {
    this.message = 'Hello World!';
    this.dm = null
  }

  getData() {
    client.fetch("http://localhost:3000/route")
      .then( response => response.json())
      .then( data => {
        console.log(data[0])
        this.dm = data[0].connection
      })
  }
}
