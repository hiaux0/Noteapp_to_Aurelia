// let _connector = []
// let _dataToTransfer = undefined

// export function EstablishConnection(linkId) {
//   this.linkId = linkId;
//   this.connectAsProvider = (prov) => {
//     if (_connector[linkId].provider == prov) {
//       _connector[linkId].providerConnected = true
//     }
//     return {
//       provide: (Data) => {
//         _providedData = Data
//       }
//     }
//   }
//   this.connectAsReceiver = (rec) => {
//     if(_connector[linkId].receiver == rec) {
//       _connector[linkId].receiverConnected = true
//     }
//     return {
//       receive: () => {
//         return _providedData
//       }
//     }
//   }
//   this.isConnected = () => {
//     if(_connector[linkId].providerConnected && _connector[linkId].receiverConnected) {
//       return true
//     }
//     return false
//   }
//   /**
//    * @param linker: {provider: "", receiver: ""}
//    */
//   this.linkToDataSharer = (linkerObj) => {
//     const createLinkId = linkerObj.provider + "<->" + linkerObj.receiver
//     linkerObj["providerConnected"] = false
//     linkerObj["receiverConnected"] = false
//     _connector[createLinkId] = linkerObj
//   }
//   this.linkToDataSharerAsProvider = (linkerObj) => {
//     const createLinkId = linkerObj.provider + "<->" + linkerObj.receiver
//     linkerObj["providerConnected"] = false
//     _connector[createLinkId].provider = linkerObj.provider
//   }
//   this.linkToDataSharerAsReceiver = (linkerObj) => {
//     const createLinkId = linkerObj.provider + "<->" + linkerObj.receiver
//     linkerObj["providerConnected"] = false
//     _connector[createLinkId] = linkerObj
//     console.log(_connector)
//   }
//   this.provideData = (data) => {
//     _dataToTransfer = data
//   }
  
//   this.readData = () => {
//     return _dataToTransfer
//   }
//   this.providerIsConnected = new Promise((resolve, reject) => {
//     console.log(_connector)
//     // if (this.isConnected()) {
//     if (_connector) {
//       // resolve(this.proivdeData)
//       resolve(this.provideData)
//     }
//   })  
//   this.receiverIsConnected = new Promise((resolve, reject) => {
//     if (_dataToTransfer) {
//       resolve(this.readData)
//     }
//   })
// }

// //   }
// // )
// /**
//  * Tasks: In charge of sharing data across modules
//  * 1. receiver and provider connect to DataSharer
//  * 2. Make sure the right data is being passed (as I want to allow mutlitple connections to the data-sharer)
//  * 3. receiver may only receive data, when unique connection is satisfied
//  * 4. Need an identifier to make connection unique
//  */
