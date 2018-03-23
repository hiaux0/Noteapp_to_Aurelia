const mongoose = require("mongoose"),
      Schema = mongoose.Schema

const NotebookSchema = new Schema({
  title: {
    type: String,
    required: 'Please enter a title for your Notebook'
  },
  topics: {}
})

module.exports = mongoose.model("Notebook",NotebookSchema)
