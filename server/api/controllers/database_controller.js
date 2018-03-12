const mongoose = require('mongoose'),
      // Change NoteApp for appropiate model name 
      NoteApp = require('../models/database_model')

// rename output and id and method names
// turn off match-whole-word search functionality for easy changing 
/* 
 list_all_note
 create_a_note 
   read_a_note 
 update_a_note 
 delete_a_note
*/

exports.list_all_note = function (req, res) {
  NoteApp.find({}, function (err, output) {
    if (err) res.send(err)
    // If needed, set response header like this
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Credentials", true );
      // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json(output)
  })
}

exports.create_a_note = function (req, res) {
  const new_task = new NoteApp(req.body)
  new_task.save(function (err, output) {
    if (err) res.send(err)
    res.json(output)
  })
}

exports.read_a_note = function (req, res) {
  NoteApp.findById(req.params.id, function (err, output) {
    if (err) res.send(err)
    res.json(output)
  })
}

// To update 
exports.update_a_note = function (req, res) {
  NoteApp.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, output) {
    if (err) res.send(err)
    res.json(output)
  })
}

exports.delete_a_note = function (req, res) {
  NoteApp.remove({ _id: req.params.id }, function (err, output) {
    if (err) res.send(err)
    res.json({ message: 'Succesfully deleted' })
  })
}

exports.delete_all_note = function (req, res) {
  NoteApp.remove({}, function (err, output) {
    if (err) res.send(err)
    res.json({ message: 'Succesfully deleted all data' })
  })
}
