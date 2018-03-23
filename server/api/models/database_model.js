const mongoose = require("mongoose"),
      Schema   = mongoose.Schema

// Change NoteAppSchema, 'NoteApp' and Schema model to your liking
const NoteAppSchema = new Schema({
  title: {
    type: String
  },
  content: Array ,
  containerSize: {
    type: {},
    // required: "Please specify container size. Should be of form getBoundingClient()"
  },
  latestId: Number,
  family_tree: {
    parents: [{}],
    siblings: [{}],
    children: [{}]
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  // connection: {
  //   type: Boolean,
  //   required: "PUT request to change connection to TRUE"
  // }
  // status: {
  //   type: [{
  //     type: String,
  //     enum: ['pending', 'ongoing', 'compeleted']
  //   }],
  //   default: ['pending']
  // }
})

module.exports = mongoose.model("NoteApp", NoteAppSchema)
