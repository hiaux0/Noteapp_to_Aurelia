const mongoose = require("mongoose"),
      // ContactDetail = mongoose.model("ContactDetail")
      ContactDetail = require('../models/database_model')


exports.list_all_contacts = function (req, res) {
  ContactDetail.find({}, function (err, contact) {
    if (err) res.send(err)
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Credentials", true );
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json(contact)
    // console.log(res)
  })
}

exports.create_a_contect = function (req, res) {
  const new_task = new ContactDetail(req.body)
  new_task.save(function (err, contact) {
    if (err) res.send(err)
    res.json(contact)
  })
}

exports.read_a_contact = function (req, res) {
  ContactDetail.findById(req.params.taskId, function (err, contact) {
    if (err) res.send(err)
    res.json(contact)
  })
}

exports.update_a_contact = function (req, res) {
  ContactDetail.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function (err, contact) {
    if (err) res.send(err)
    res.json(contact)
  })
}

exports.delete_a_contact = function (req, res) {
  ContactDetail.remove({ _id: req.params.taskId }, function (err, contact) {
    if (err) res.send(err)
    res.json({ message: 'Contact succesfully deleted' })
  })
}

