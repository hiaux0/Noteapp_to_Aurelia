module.exports = function(app) {
  const contactDetail = require("../controllers/database_controller")
  const __serverDir = path.resolve(path.dirname(''))
  const __srcDir = path.join(__serverDir, "../", "client")
  console.log(__srcDir)
  
  const index = path.join(__srcDir, 'index.html')
  // app.get("/", function(req,res) {
  //   console.log(__srcDir)
  //   console.log('module.exports -> index', index)
    
  //   res.sendFile(index)
  // })

  app.route('/contacts')
    .get(contactDetail.list_all_contacts) 
    .post(contactDetail.create_a_contect) 

  app.route('/contact/:contactId')
    .get(contactDetail.read_a_contact) 
    .put(contactDetail.update_a_contact) 
    .delete(contactDetail.delete_a_contact)
}