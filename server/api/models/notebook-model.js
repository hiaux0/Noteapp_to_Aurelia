const mongoose = require("mongoose"),
      Schema   = mongoose.Schema,
      Topic    = require("../models/topic-model")
      let TopicSchema = require('mongoose').model('Topic').schema

const NotebookSchema = new Schema({
  title: {
    type: String,
    required: 'Please enter a title for your Notebook'
  },
  // topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }]
  topics: [TopicSchema]
})

module.exports = mongoose.model("Notebook",NotebookSchema)
