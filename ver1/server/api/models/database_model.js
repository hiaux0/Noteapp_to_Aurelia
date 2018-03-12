const mongoose = require("mongoose"),
      Schema   = mongoose.Schema

const ContactDetailSchema = new Schema({
  name: {
    type: String,
    required: "Please enter your name"
  },
  age: Number
})

module.exports = mongoose.model("ContactDetail", ContactDetailSchema)
