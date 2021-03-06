const mongoose = require('mongoose'),
      // Change NoteApp for appropiate model name 
      NoteApp = require('../models/database_model'), // #BEFORE notebook route
      Topic = require('../models/topic-model'),
      Notebook = require('../models/notebook-model')

// Extra configuration to get mongodb id generator 
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectID

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//
// Notebooks
//
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
let notebooks = {
  idRoute: {
    find_a_notebook: function (req, res) {
      Notebook.findById(req.params.nbid, function (err, notebook) {
        if (err) res.send(err);
        res.json(notebook)
      })
    },
    update_a_notebook: function (req, res) {
      Notebook.findOneAndUpdate({ _id: req.params.nbid }, req.body, { new: true }, function (err, output) {
        if (err) res.send(err);
        res.json(output)
      })
    },
    patch_notebook: function (req, res) {
      Notebook.findOneAndUpdate({ _id: req.params.nbid }, { $set: { content: req.body } }, function (err, output) {
        if (err) res.send(err);
        res.json(output)
      })
    },
    delete_a_notebook: function (req, res) {
      Notebook.remove({ _id: req.params.nbid }, function (err, output) {
        if (err) res.send(err);
        res.json({ message: 'Succesfully deleted' })
      })
    }
  },
  mainRoute: {
    get_notebooks: (req, res) => {
      Notebook.find({}, (err, notebook) => {
        if (err) res.send(err)
        res.json(notebook)
      })
    },
    create_a_notebook: function (req, res) {
      const new_task = new Notebook(req.body)
      new_task.save(function (err, output) {
        if (err) { res.send(err) };
        res.json(output)
      })
    },
    drop_all_notebooks: function(req, res) {
        Notebook.remove({}, function (err, output) {
          if (err) res.send(err);
          res.json({ message: 'Succesfully deleted' })
        })
      }
  },
  topics: {
    idRoute: {
      find_a_topic_from_notebook: function (req, res) {
        let nb_id = req.params.nbid
        let t_id = req.params.tid
        Notebook.find({
          '_id': ObjectId(nb_id.toString())
        }, {
          "topics": {$elemMatch: {
            "_id": ObjectId(t_id.toString())
          }}
        }, (err, topic) => {
          if(err) {console.log(err)
          } else {
            res.json(topic)
          }
        })
       },
      
      /** 
       * Patch ONE field in notebook schema
       * Check for ONE field only is made in the API. #CONSIDER a check here as well.
       */
      patch_a_topic_from_notebook: function (req, res) {
        let nb_id = req.params.nbid
        let t_id = req.params.tid
        Notebook.findById(nb_id)
          .then( nb => {
            const targetTopic = nb.topics.id(t_id) // through mongoose id() method, find the subDoc 'topic'
            const targetKey = Object.keys(req.body)[0] // filter keys to update
            targetTopic[targetKey] = req.body[targetKey] // update 
            return nb.save() // save, and mongoose automatically validates
          })
          .then(nb => res.send({ nb })) // return the updated nb // make sure to send an object!!
          .catch(e => res.status(400).send(e)) // error handling
       },
      put_topic_from_notebook: function (req, res) {
        let nb_id = req.params.nbid
        let t_id = req.params.tid
        Notebook.findById(nb_id, function(err, notebook) {
          if(err) console.log(err)
          else {
            // check req.body which POST was send (topic or note)
            if(req.body.notes) {
            } else {
              let new_content = req.body
              notebook.topics.map(ele => {
                if (ele._id == t_id) {
                  // for some reason req.body is in an array
                  ele.notes = (req.body)
                }
              })
            }

            notebook.save((err, result) => {
              if (err) res.send(err)
              else res.json(result)
            })

          }
        })
      },
   
      delete_a_topic: function (req, res) { //#TODO3103fsi09u find out how to delete child doc in mongoose
        let nb_id = req.params.nbid
        let t_id  = req.params.tid
        Notebook.findById(req.params.nbid)          // Find nb and return promise
          .then( nb => {                            // If nb found then
            let target_topic = nb.topics.id(t_id) 
            console.log(target_topic)  // find target topic via id() method
            target_topic.remove()  //#TODO delete the topic
            return nb.save()                        // save changes
          })
          .then(nb => res.send({nb}))               // make sure to send an object!!
          .catch(e => res.status(400).send(e))
      }
    },
    mainRoute: {
      create_a_topic: function (req, res) {
        Notebook.findById(req.params.nbid, function (err, notebook) {
          if (err) { console.log(err)}
          Topic.create(req.body, (err, topic) => {
            if(err) {console.log(err)}
            notebook.topics.push(topic)
            notebook.save((err,saved) => {
              if (err) console.log(err)
            })
            res.json(notebook)
          })
        })  
      },
      // create_a_topic: (req,res) => {
      //   Topic.
      // },  
      list_all_topics: function (req, res) {
        Notebook.findById(req.params.nbid, (err, notebook) => {
          if (err) res.send(err)
          else res.json(notebook.topics)
        })
      }
    }
  }
}

exports.notebooks = notebooks
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//
// Topics/Notes
//
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// Playground //////////////////////////////
let notes = {
  /**
   * post new note to a topic from one notebook
   */
  post_notes_to_topic_from_notebook: (req,res) => {
      let nb_id = req.params.nbid
      let t_id = req.params.tid
      Notebook.findById(nb_id, function (err, notebook) {
        if (err) console.log(err)
        else {
          // check req.body which POST was send (topic or note)
            let new_content = req.body
            notebook.topics.map(ele => {
              if (ele._id == t_id) {
                // for some reason req.body is in an array
                ele.notes = (req.body)
              }
            })

          notebook.save((err, result) => {
            if (err) res.send(err)
            else res.json(result)
          })

        }
      })
  }

}

exports.notes = notes

////////////////////////////// Playground ////////////////////////////// 2018-03-28 17:55:19

exports.get_mongodb_id = function(req,res) {
  res.json(new ObjectId())
}
exports.list_all_note = function (req, res) {
  NoteApp.find({}, function (err, output) {
    if (err) res.send(err);
    // If needed, set response header like this
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Credentials", true );
      // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json(output)
  }) }

exports.create_a_note = function (req, res) {
  const new_task = new NoteApp(req.body)
  new_task.save(function (err, output) {
    if (err) {res.send(err)};
    res.json(output)
  }) }
exports.read_a_note = function (req, res) {
  NoteApp.findById(req.params.id, function (err, output) {
    if (err) res.send(err);
    res.json(output)
  }) }

// To update 
exports.update_a_note = function (req, res) {
  NoteApp.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, output) {
    if (err) res.send(err);
    res.json(output)
  }) }

// Patch Content
exports.patch_note_content = function(req, res) {
  NoteApp.findOneAndUpdate({_id: req.params.id}, {$set:{ content: req.body}} , function(err,output) {
    if(err) res.send(err);
    res.json(output)
  })
}

exports.delete_a_note = function (req, res) {
  NoteApp.remove({ _id: req.params.id }, function (err, output) {
    if (err) res.send(err);
    res.json({ message: 'Succesfully deleted' })
  }) }

exports.delete_all_note = function (req, res) {
  NoteApp.remove({}, function (err, output) {
    if (err) res.send(err);
    res.json({ message: 'Succesfully deleted all data' })
  })
}
