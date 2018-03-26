// import {EstablishConnection} from '../../src/data-sharer'

// describe('Establish Connection', function() {
//   beforeEach(function(){ 
//     const linkId = "AllNotebooks<->Topics"
//     this.EC = new EstablishConnection(linkId)
//     // this.EC.linkId = linkId
//     let linker = { provider: "AllNotebooks", receiver: "Topics" }
//     this.EC.linkToDataSharerAsReceiver(linker)
//     this.EC.linkToDataSharerAsProvider(linker)
//   })   
//   //
//   it('should connect for correct setup', function() {
//     this.EC.connectAsProvider("AllNotebooks")
//     this.EC.connectAsReceiver("Topics")
//     expect(this.EC.isConnected()).toBe(true)
//   })

//   it('should not connect for wrong provider', function() {
//     this.EC.connectAsProvider("Other name")
//     this.EC.connectAsReceiver("Topics")
//     expect(this.EC.isConnected()).toBe(false)
//   })
//   it('should not connect for wrong receiver', function() {
//     this.EC.connectAsProvider("AllNotebooks")
//     this.EC.connectAsReceiver("asdladj")
//     expect(this.EC.isConnected()).toBe(false)
//   })
//   it('should not connect for wrong setup', function() {
//     this.EC.connectAsProvider("dsda")
//     this.EC.connectAsReceiver("asdladj")
//     expect(this.EC.isConnected()).toBe(false)
//   })
// })
