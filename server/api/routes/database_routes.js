module.exports = function (app) {
  const noteApp = require("../controllers/database_controller")
  const noteBook = require("../models/notebook")

// change noteApp and its methods
// turn off match-whole-word search functionality for easy changing 
/*
 list_all_note
 create_a_note
   read_a_note
 update_a_note
 delete_a_note

 patch_note_content
*/

  app.route('/notes')
    .get(noteApp.list_all_note)
    .post(noteApp.create_a_note)
    .delete(noteApp.delete_all_note)

  app.route('/notes/:id')
    .get(noteApp.read_a_note)
    .patch(noteApp.patch_note_content)
    .put(noteApp.update_a_note)
    .delete(noteApp.delete_a_note)
  
  app.route('/mongodbid')
    .get(noteApp.get_mongodb_id)
}
