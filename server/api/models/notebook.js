const mongoose = require("mongoose"),
      Schema = mongoose.Schema

const NoteBookSchema = new Schema({
  title: String,
  topics: {}
})
