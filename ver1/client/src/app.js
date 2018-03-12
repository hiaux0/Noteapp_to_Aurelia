import {HttpClient, json} from 'aurelia-fetch-client' 

const client = new HttpClient() 

// client.fetch('package.json')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data.description);
// });

// client.configure(config => {
//   config
//     .withBaseUrl('api/')
//     .withDefaults({
//       credentials: 'cors',
//       headers: {
//         'Accept': 'application/json',
//         'X-Requested-With': 'Fetch'
//       }
//     })
//     .withInterceptor({
//       request(request) {
//         console.log(`Requesting ${request.method} ${request.url}`);
//         return request;
//       },
//       response(response) {
//         console.log(response)
//         console.log(`Received ${response.status} ${response.url}`);
//         return response;
//       }
//     });
// });

// client.fetch('http://localhost:3000/contacts')
//   .then(function (response) {
//     return response.json()
//   })
//   .then(data => {
//     console.log(data);
//   });

// const myHeaders = new Headers();
// myHeaders.append('Content-Type', 'application/json');
// // myHeaders.append("Access-Control-Allow-Origin", "*");
// // myHeaders.append("Access-Control-Allow-Credentials", true );
  

// const myInit = {
//   method: 'GET',
//   headers: myHeaders,
//   mode: 'no-cors',
//   cache: 'default'
// }
// const myRequest = new Request('http://localhost:3000/contacts', myInit)
// // const myRequest = new Request('https://jsonplaceholder.typicode.com/posts/1', myInit)

export class App {
  constructor() {
    this.message = 'Hello World!';
  }

  getData() {
    client.fetch('http://localhost:3000/contacts',{mode:'cors'})
      .then(function (response) {
        return response.json()
      })
      .then(data => {
        console.log(data[0]);
      });
  }
  /**
   * 
   * 
   * @param {any} config 
   * @param {any} router 
   * 
   * @memberOf App
   */
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Aurelia';
    config.options.pushState = true;
    config.options.root = '/';
    // Use the map method to map route patterns to the modules that should handle the patterns.
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'testview' },
      { route: 'users', name: 'users', moduleId: 'testview1', nav: true, title: 'Users' },
      { route: 'contacts' , name: "contacts" , moduleId: 'testview', nav:true, title: 'Contacts'}
      // { route: 'users/:id/detail', name: 'userDetail', moduleId: 'testview' },
      // { route: 'files/*path', name: 'files', moduleId: 'testview', nav: 0, title: 'Files', href: '#files' }
    ]);
  }

}
