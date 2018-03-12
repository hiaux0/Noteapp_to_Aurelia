module.exports = function (app) {
  const nameForSchema = require("../controllers/database_controller")

// change nameForSchema and its methods
// turn off match-whole-word search functionality for easy changing 
/*
 list_all_note
 create_a_note
   read_a_note
 update_a_note
 delete_a_note
*/

  app.route('/notes')
    .get(nameForSchema.list_all_note)
    .post(nameForSchema.create_a_note)
    .delete(nameForSchema.delete_all_note)

  app.route('/notes/:id')
    .get(nameForSchema.read_a_note)
    .put(nameForSchema.update_a_note)
    .delete(nameForSchema.delete_a_note)
}
