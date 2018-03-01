// requirejs(['porterplay'] , function(porterplay) {
//     // module.exports.test = { name: "hieu", porterplay }    

//     return { porterplay }
// })


// import porterplay from "porterplay"
let porterplay = require('./porterplay')

function hello(){
    console.log("hello from play")
}


module.exports = { name: "hieu", hello}



    // ,
    // {
    //     "name": "play",
    //     "path": "../src/playground",
    //     "main": "play.js"
    // },
    // {
    //     "name": "porterplay",
    //     "path": "../src/playground",
    //     "main": "porterplay.js"
    // }