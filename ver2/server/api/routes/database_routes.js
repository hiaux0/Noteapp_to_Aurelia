module.exports = function (app) {
  const nameForSchema = require("../controllers/database_controller")

// change nameForSchema and its methods
// turn off match-whole-word search functionality for easy changing 
/*
 list_all_contact
 create_a_contact
   read_a_contact
 update_a_contact
 delete_a_contact
*/

  app.route('/route')
    .get(nameForSchema.list_all_contact)
    .post(nameForSchema.create_a_contact)

  app.route('/route/:id')
    .get(nameForSchema.read_a_contact)
    .put(nameForSchema.update_a_contact)
    .delete(nameForSchema.delete_a_contact)
}