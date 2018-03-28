const mongoose = require("mongoose"),
      Schema = mongoose.Schema

const TopicSchema = new Schema({
  title: {
    type: String
  },
  notes: Array,
  containerSize: { // #DONE #UNCOMMENT when not have to use postman anymore 2018-03-27 20:12:52
    type: {},
  },
  // latestId: Number,
  // create_date: { 
  //   type: Date,
  //   default: Date.now
  // }, #UNCOMMENT
})

module.exports = mongoose.model("Topic", TopicSchema)
