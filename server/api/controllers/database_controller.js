const mongoose = require('mongoose'),
      // Change NameForSchema for appropiate model name 
      NameForSchema = require('../models/database_model')

// rename output and id and method names
// turn off match-whole-word search functionality for easy changing 
/* 
 list_all_contact
 create_a_contact 
   read_a_contact 
 update_a_contact 
 delete_a_contact
*/

exports.list_all_contact = function (req, res) {
  NameForSchema.find({}, function (err, output) {
    if (err) res.send(err)
    // If needed, set response header like this
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Credentials", true );
      // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json(output)
  })
}

exports.create_a_contact = function (req, res) {
  const new_task = new NameForSchema(req.body)
  new_task.save(function (err, output) {
    if (err) res.send(err)
    res.json(output)
  })
}

exports.read_a_contact = function (req, res) {
  NameForSchema.findById(req.params.id, function (err, output) {
    if (err) res.send(err)
    res.json(output)
  })
}

// To update 
exports.update_a_contact = function (req, res) {
  NameForSchema.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, output) {
    if (err) res.send(err)
    res.json(output)
  })
}

exports.delete_a_contact = function (req, res) {
  NameForSchema.remove({ _id: req.params.id }, function (err, output) {
    if (err) res.send(err)
    res.json({ message: 'Succesfully deleted' })
  })
}

exports.delete_all_contact = function (req, res) {
  NameForSchema.remove({}, function (err, output) {
    if (err) res.send(err)
    res.json({ message: 'Succesfully deleted all data' })
  })
}
