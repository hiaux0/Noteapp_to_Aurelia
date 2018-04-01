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
    console.log('dbapi in post')
    const url = this.baseUrl + route
    return client.fetch(url, {
      body: json(dataObj),
      method: "post"
    })
      .then(response => response.json())
  }
  get_one_notebook(route, nbid) {
    const url = this.baseUrl + route + "/" + nbid
    return client.fetch(url)
      .then(response => response.json())
  }
  /**
   * Patch content of one note
   * 
   * @memberOf DatabaseAPI
   */
  patch_note_content(route, nbid, update) { //#ADJUST TO NOTEBOOKS
    const url = this.baseUrl + route + "/" + nbid
    return client.fetch(url, {
      method: "PATCH",
      body: json(update)
    })
      .then(response => response.json())
  }
  put_notebook(route, nbid, update) {
    console.log('nb in put')
    const url = this.baseUrl + route + "/" + nbid
    return client.fetch(url, {
      method: "put",
      body: json(update)
    })
      .then(response => response.json())
  }
  delete_notebook(route, nbid) {
    const url = this.baseUrl + route + "/" + nbid
    return client.fetch(url, {
      method: 'delete'
    })
      .then(response => response.json())
  }
  drop_all_notebooks() {
    const url = this.baseUrl + "/notebooks"
    return client.fetch(url, {
      method: 'delete'
    })
      .then(response => response.json())
  }

  notebook = {
    get_notebooks: (route) => {
      const url = this.baseUrl + route
      return client.fetch(url)
        .then(response => response.json())
    },
    post_notebook: (route, dataObj) => {
      console.log('dbapi in post')
      const url = this.baseUrl + route
      return client.fetch(url, {
        body: json(dataObj),
        method: "post"
      })
        .then(response => response.json())
    },
    get_one_notebook: (route, nbid) => {
      const url = this.baseUrl + route + "/" + nbid
      return client.fetch(url)
        .then(response => response.json())
    },
    /**
     * Patch content of one note
     * 
     * @memberOf DatabaseAPI
     */
    patch_note_content: (route, nbid, update) => { //#ADJUST TO NOTEBOOKS
      const url = this.baseUrl + route + "/" + nbid
      return client.fetch(url, {
        method: "PATCH",
        body: json(update)
      })
        .then(response => response.json())
    },
    put_notebook: (route, nbid, update) => {
      console.log('nb in put')
      const url = this.baseUrl + route + "/" + nbid
      return client.fetch(url, {
        method: "put",
        body: json(update)
      })
        .then(response => response.json())
    },
    delete_notebook: (route, nbid) => {
      const url = this.baseUrl + route + "/" + nbid
      return client.fetch(url, {
        method: 'delete'
      })
        .then(response => response.json())
    },
    drop_all_notebooks: () => {
      const url = this.baseUrl + "/notebooks"
      return client.fetch(url, {
        method: 'delete'
      })
        .then(response => response.json())
    }
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
post_new_topic_to_notebook(nb_id, new_t) {
  console.log("new topic to nb")
  // get notebook
  const url = this.baseUrl + "/notebooks/" + nb_id + "/topics"
  console.log(new_t)
  return client.fetch(url, {
    body: json(new_t),
    method: 'POST'
  }).then (response => response.json())
  // add new_t to notebook topics section
}

get_topic_from_notebook(nb_id, t_id) {
  const url = this.baseUrl + "/notebooks/" + nb_id + "/topics/" + t_id
  return client.fetch(url)
    .then(response => {
      let payload = response.json()
      return payload  
    })// #BUG I receive the topic but it has 3 extra keys: content,id,position, which are all empty
    // if I GET the database address or via postman the payload is correct however

}
put_topic_from_notebook(nb_id, t_id, t_update) {
  console.log("in put t from notebook")
  const url = this.baseUrl + "/notebooks/" + nb_id + "/topics/" + t_id
  return client.fetch(url, {
    method: "PUT",
    body: json(t_update),
  }).then( response => response.json())  
}
/**
 * Patch a topic.
 * REQUIRED: t_update object to only have one key
 * @param {any} t_update 
 * @memberOf DatabaseAPI
 */
patch_topic_from_notebook(nb_id, t_id, t_update) {
  // ensure correct format
  if(Object.keys(t_update).length > 1) {
    return new Error('Patch should only have one field')
  }
  console.log("in put t from notebook")
  const url = this.baseUrl + "/notebooks/" + nb_id + "/topics/" + t_id
  return client.fetch(url, {
    method: "PATCH",
    body: json(t_update),
  }).then( response => response.json())  
}

delete_a_topic_from_notebook(nb_id, t_id) {
  console.log("nb: ", nb_id)
  console.log("tid: ", t_id)
  const url = this.baseUrl + "/notebooks/" + nb_id + "/topics/" + t_id
  return client.fetch(url, {
    method: "DELETE"
  }).then(response => response.json())
}

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

notes = {
  post_notes_to_topic_from_notebook: (nb_id, t_id, new_note) => {
    console.log('dbapi, new post note to topic')
    const url = this.baseUrl + "/notebooks/" + nb_id + "/topics/" + t_id + '/notes'
    return client.fetch(url, {
      method: 'POST',
      body: json(new_note)
    }).then( response => response.json())
  }
}
//   get_database_entries(route) {
//     const url = this.baseUrl + route
//     return client.fetch(url)
//       .then( response => response.json())
//   }
  
//   post_database_entry(route,dataObj) {
//     console.log('in post')
//     const url = this.baseUrl + route
//     return client.fetch(url, {
//       body: json(dataObj),
//       method: "post"
//     })
//       .then(response => response.json())
//   }
  
//   get_one_database_entry(route,id) {
//     const url = this.baseUrl + route + "/" + id
//     return client.fetch(url)
//       .then(response => response.json())
//   }

//   /**
//    * Patch content of one note
//    * 
//    * @memberOf DatabaseAPI
//    */
//   patch_note_content(route, id, update) {
//     const url = this.baseUrl + route + "/" + id
//     return client.fetch(url, {
//       method: "PATCH",
//       body: json(update)
//     })
//       .then(response => response.json())
//   }

//   put_database_entry(route,id,update) {
//     console.log('in put')
//     const url = this.baseUrl + route + "/" + id
//     return client.fetch(url,{
//       method: "put",
//       body: json(update)
//     })
//       .then(response => response.json())
//   }

//   delete_database_entry(route,id) {
//     const url = this.baseUrl + route + "/" + id
//     return client.fetch(url, {
//       method: 'delete'
//     })
//       .then(response => response.json())
//   }
}
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//
//    Table of content
//
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/**
notebook = { 
  get_notebooks,
  post_notebook,
  get_one_notebook, 
  patch_note_content, 
  put_notebook, 
  delete_notebook, 
  drop_all_notebooks
}
topics = {
  get_topics_from_notebook, 
  post_new_topic_to_notebook, 
  get_topic_from_notebook, 
  put_topic_from_notebook, 
  delete_a_topic_from_notebook
}
notes = {
  post_notes_to_topic_from_notebook
}
 */
