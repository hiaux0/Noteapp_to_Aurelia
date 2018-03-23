module.exports = function (app) {
  const noteApp = require("../controllers/database_controller")

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

  // Notebooks route
  app.route('/notebooks')
    .get(noteApp.notebooks.mainRoute.get_notebooks)
    .post(noteApp.notebooks.mainRoute.create_a_notebook)

  app.route('/notebooks/:nbid')
    .get(noteApp.notebooks.idRoute.find_a_notebook)
    .patch(noteApp.notebooks.idRoute.patch_notebook)
    .put(noteApp.notebooks.idRoute.update_a_notebook)
    .delete(noteApp.notebooks.idRoute.delete_a_notebook)

  // Notebook/Topic route
  app.route('/notebooks/:nbid/topics')
    .get(noteApp.notebooks.mainRoute.get_notebooks)
    .post(noteApp.notebooks.mainRoute.create_a_notebook)

  app.route('/notebooks/:nbid/topics/:tid')
    .get(noteApp.notebooks.idRoute.find_a_notebook)
    .patch(noteApp.notebooks.idRoute.patch_notebook)
    .put(noteApp.notebooks.idRoute.update_a_notebook)
    .delete(noteApp.notebooks.idRoute.delete_a_notebook)

  // Notes route
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
