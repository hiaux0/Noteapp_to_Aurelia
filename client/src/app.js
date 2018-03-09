import {HttpClient, json} from 'aurelia-fetch-client' 

const client = new HttpClient()


export class App {
  
  constructor() {
    this.message = 'Hello World!';
    this.dm = null
    this.myPostObj = {
      connection: true
    }
  }

  getData() {
    client.fetch("http://localhost:3000/route")
      .then( response => response.json())
      .then( data => {
        console.log(data[0])
        this.dm = data[0].connection
      })
  }

  postData() {
    console.log(this.myPostObj)
    client.fetch("http://localhost:3000/route", {
      body: json(this.myPostObj),
      method: "post",
      headers: {
        'content-type':'application/json',
      },
      // body: JSON.stringify(myPostObj)
    })
      .then(response => response.json())
      .then( data => {
        console.log(data)
      })
  }
}
