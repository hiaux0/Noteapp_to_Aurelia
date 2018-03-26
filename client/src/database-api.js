import {HttpClient,json} from 'aurelia-fetch-client'

const client = new HttpClient()

export class DatabaseAPI {
  baseUrl = 'http://localhost:3000'

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//
// Notebooks
//
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
  get_notebooks(route) {
    const url = this.baseUrl + route
    return client.fetch(url)
      .then(response => response.json())
  }

  post_notebook(route, dataObj) {
    console.log('in post')
    const url = this.baseUrl + route
    return client.fetch(url, {
      body: json(dataObj),
      method: "post"
    })
      .then(response => response.json())
  }

  get_one_notebook(route, id) {
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url)
      .then(response => response.json())
  }

  /**
   * Patch content of one note
   * 
   * @memberOf DatabaseAPI
   */
  patch_note_content(route, id, update) {
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url, {
      method: "PATCH",
      body: json(update)
    })
      .then(response => response.json())
  }

  put_notebook(route, id, update) {
    console.log('in put')
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url, {
      method: "put",
      body: json(update)
    })
      .then(response => response.json())
  }

  delete_notebook(route, id) {
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url, {
      method: 'delete'
    })
      .then(response => response.json())
  }
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//
// Topics
//
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

/**
 * GET all topics from notebook with ID @notebook_id.
 * Uses `get_one_notebook(notebook_id)` from `Notebooks` dbAPI
 * @param {any} notebook_id 
 */
  get_topics_from_notebook(route, nb_id) {
  return this.get_one_notebook(route, nb_id).then( notebook => notebook)
}
post_new_topic_to_notebook(nb_id, new_t) {}

get_a_topic_from_notebook(nb_id, t_id) {}
put_a_topic_from_notebook(nb_id, t_id, t_update) {} 
delete_a_topic_from_notebook(nb_id, t_id) {}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//
// Notes
//
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
get_mongodb_id() {
    const route = "/mongodbid"
    const url = this.baseUrl + route
    return client.fetch(url)
      .then(response => response.json())
  }

  get_database_entries(route) {
    const url = this.baseUrl + route
    return client.fetch(url)
      .then( response => response.json())
  }
  
  post_database_entry(route,dataObj) {
    console.log('in post')
    const url = this.baseUrl + route
    return client.fetch(url, {
      body: json(dataObj),
      method: "post"
    })
      .then(response => response.json())
  }
  
  get_one_database_entry(route,id) {
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url)
      .then(response => response.json())
  }

  /**
   * Patch content of one note
   * 
   * @memberOf DatabaseAPI
   */
  patch_note_content(route, id, update) {
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url, {
      method: "PATCH",
      body: json(update)
    })
      .then(response => response.json())
  }

  put_database_entry(route,id,update) {
    console.log('in put')
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url,{
      method: "put",
      body: json(update)
    })
      .then(response => response.json())
  }

  delete_database_entry(route,id) {
    const url = this.baseUrl + route + "/" + id
    return client.fetch(url, {
      method: 'delete'
    })
      .then(response => response.json())
  }
}
