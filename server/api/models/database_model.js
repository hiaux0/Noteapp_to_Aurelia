const mongoose = require("mongoose"),
      Schema   = mongoose.Schema

// Change NameForSchemaSchema, 'NameForSchema' and Schema model to your liking
const NameForSchemaSchema = new Schema({
  name: {
    type: String
  },
  // age: Number,
  Create_date: {
    type: Date,
    default: Date.now
  },
  connection: {
    type: Boolean,
    required: "PUT request to change connection to TRUE"
  }
  // status: {
  //   type: [{
  //     type: String,
  //     enum: ['pending', 'ongoing', 'compeleted']
  //   }],
  //   default: ['pending']
  // }
})

module.exports = mongoose.model("NameForSchema", NameForSchemaSchema)