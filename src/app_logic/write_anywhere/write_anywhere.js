// I want to click anywhere in a specified area (class .write-anywhere) and be able to just type

// import helper from './app_logic/helper_lib'

    'use strict';
    const doc = document
    let writeAnywhereStorage = []

    let write_anywhere = {
        listeners: {
            evListener
        },
        helpers: {
            isWriteAnywhere,
            checkEmptyTextarea
        }
    }

    function evListener() {
        doc.body.addEventListener('click', isWriteAnywhere)
    }


    /**
     * Checks if parent has write-anywhere class. If it does add a contentditable div
     * It is drag-and-drop-able
     * @param {any} ev 
     */
    function isWriteAnywhere(ev) {
        if (ev.target.classList.contains("write-anywhere")) {
            let latestTextarea = writeAnywhereStorage.last()
            if (!checkEmptyTextarea(latestTextarea)) {
                latestTextarea.remove()
                writeAnywhereStorage.pop()
            }
            let container = document.getElementById("container")
            let xPos = ev.pageX
            let yPos = ev.pageY
            // create textarea at mouse location
            let dynamicTextarea = document.createElement("div")
            dynamicTextarea.style['position'] = 'absolute'
            dynamicTextarea.style["left"] = `${xPos}px`
            dynamicTextarea.style["top"] = `${yPos}px`
            dynamicTextarea.style["cursor"] = 'auto'

            // style textarea
            dynamicTextarea.classList.add('dynamic-textarea', 'dropable')
            dynamicTextarea.setAttribute("contenteditable", "true")
            dynamicTextarea.setAttribute("draggable", true)
            // append textarea to container
            container.appendChild(dynamicTextarea)
            dynamicTextarea.focus()
            // append to storae
            writeAnywhereStorage.push(dynamicTextarea)
        }
    }

    /**
     * If you don't type anything into a dynamically created textarea, delete it
     * @returns {bool} : textarea empty?
     */
    function checkEmptyTextarea(latestTextarea) {
        if (writeAnywhereStorage.length > 0) {
            if (latestTextarea.innerText === "") {
                console.log(`true:`)
                return false
            }
        }
        console.log(`false:`)
        return true
    }


    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    //
    //              RETRUN
    //
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
module.exports = write_anywhere






        // let promiseTest = new Promise( function(resolve,reject){ 

                                //     let bool = true
                                //     if(bool) {
                                //         resolve("truuee")
                                //     } else {
                                //         let reason = new Errow
                                //         reject(reason)
                                //     }
                                // })


                                // promiseTest.then(function(fromResolve) {
                                //     console.log(fromResolve)
                                // })