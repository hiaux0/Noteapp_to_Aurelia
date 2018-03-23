const mongoose = require('mongoose'),
      // Change NoteApp for appropiate model name 
      NoteApp = require('../models/database_model'),
      Notebook = require('../models/notebook')

// Extra configuration to get mongodb id generator 
const mongodb = require('mongodb')
const ObjectID = mongodb.ObjectID

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
      console.log("in update")
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
      console.log("created")
      const new_task = new Notebook(req.body)
      new_task.save(function (err, output) {
        if (err) { res.send(err) };
        res.json(output)
      })
    }
  },
  topics: {
    idRoute: {
      find_a_topic: function (req, res) {
        NoteApp.findById(req.params.tid, function (err, output) {
          if (err) res.send(err);
          res.json(output)
        })
      },
      // To update 
      update_a_topic: function (req, res) {
        console.log("in update")
        NoteApp.findOneAndUpdate({ _id: req.params.tid }, req.body, { new: true }, function (err, output) {
          if (err) res.send(err);
          res.json(output)
        })
      },
      // Patch Content
      patch_a_topic: function (req, res) {
        NoteApp.findOneAndUpdate({ _id: req.params.tid }, { $set: { content: req.body } }, function (err, output) {
          if (err) res.send(err);
          res.json(output)
        })
      },
      delete_a_topic: function (req, res) {
        NoteApp.remove({ _id: req.params.tid }, function (err, output) {
          if (err) res.send(err);
          res.json({ message: 'Succesfully deleted' })
        })
      }

    },
    mainRoute: {
      list_all_topics: function (req, res) {
        NoteApp.find({}, function (err, output) {
          if (err) res.send(err);
          // If needed, set response header like this
          // res.header("Access-Control-Allow-Origin", "*");
          // res.header("Access-Control-Allow-Credentials", true );
          // res.header("Access-Control-Allow-Headers", "X-Requested-With");
          res.json(output)
        })
      },
      create_a_topic: function (req, res) {
        console.log("created")
        const new_task = new NoteApp(req.body)
        new_task.save(function (err, output) {
          if (err) { res.send(err) };
          res.json(output)
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

exports.get_mongodb_id = function(req,res) {
  res.json(new ObjectID())
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
  console.log("created")
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
  console.log("in update")
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
