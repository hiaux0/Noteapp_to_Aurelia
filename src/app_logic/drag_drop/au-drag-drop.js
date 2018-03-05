let data, id, startLocation, targetLocation;
let ddId = "drag-drop"
const doc = document
const getId = (id) => document.getElementById(id)

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//    
//      Setup
//
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
let drag_drop = {
    ddId: "dataDD",
    dragIt: {
        dragEnd,
        dragEnter,
        dragStart,
        helpers: {
            previewAtDropLocation,
            previewDragged,
        },
    },
    dropIt: {
        allowDrop,
        drop,
        dropAnywhere,
        helpers: {
            setPosition,
            correctPosition
        }
    },
    listeners: {
        evListener
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
//      Drag
//
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/**
 * [What data to be dragged.]
 * @param  {[type]} ev [description]
 * @return {[type]}    [description]
 */
function dragStart(ev) {
    // The dataTransfer.setData() method sets the data type and the value of the dragged data:
    // set id to identify what element should be dragged
    startLocation = ev.target.parentNode;
    ev.target.setAttribute("id", ddId)
    id = ev.target.id
    ev.dataTransfer.setData("text", id);
}

function dragEnd(ev) {
    if (targetLocation.classList.contains("dropable")) {
        ev.target.style.opacity = "1"
    } else {
        startLocation.append(ev.target)
        ev.target.style.opacity = "1"
    }
}

/**
 * use dragEnter to preview dragged element at drop location
 * 
 */
function dragEnter(ev) {
    targetLocation = ev.target
    if (targetLocation.id === ddId) {
        targetLocation = targetLocation.parentNode
        return;
    }
    if (!ev.target.classList.contains("dropable")) {
        return;
    }
    ev.preventDefault();
    let currentEle = doc.getElementById(id);
    if (targetLocation !== currentEle.parentNode) {
        currentEle.style.opacity = "0.4"
        previewAtDropLocation(ev, currentEle)
    }
}
    function previewDragged(currentEle) {
        let copy = doc.createElement(currentEle.tagName)
        copy = currentEle
        // console.log(`copy: ${copy}`);
        doc.getElementById("preview").appendChild(copy)
    }

    function previewAtDropLocation(ev, currentEle) {
        // if(ev.target !== currentEle.parentNode) {
        ev.target.appendChild(currentEle)
        // }
    }

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
//            Drop
//
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * [By default, data/elements cannot be dropped in other elements. To allow a drop,
 *  we must prevent the default handling of the element.]
 * @return {[type]}    [description]
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * [When the dragged data is dropped, a drop event occurs.]
 * @param  {[type]} ev [description]
 * @return {[type]}    [description]
 */
function drop(ev) {
    // default is open as link on drop
    ev.preventDefault();
    // Get the dragged data with the dataTransfer.getData() method. 
    // This method will return any data that was set to the same type in the setData() method
    // let currentEle = doc.getElementById(ev.target.id);
    // remove id to allow other element to be dragged again
    // currentEle.style.opacity = "1"
    // currentEle.id = ""
    // ev.target.removeAttribute("id")
    // console.log(ev.target.id);
}

function dropAnywhere(ev) {
    let draggedDataId = ev.dataTransfer.getData("text")
    let draggedData = getId(draggedDataId)
    // const free_drop = getId("free-drop");
    const drop_anywhere = getId("container")
    targetLocation = ev.target;
    // check if dropped on element itself (happens due to preview)
    if (targetLocation.id === ddId) {
        // console.log(`case: id: ${targetLocation.parentNode}`);
        targetLocation = targetLocation.parentNode;
    }
    let parentLeft_posi = targetLocation.offsetLeft;
    let parentTop_posi = targetLocation.offsetTop;
    // let freePosition = doc.createElement("div");
    // freePosition.classList.add('circle');
    // freePosition.setAttribute('draggable', true);
    // append element to dropped position
    let correctPos = correctPosition(draggedData, ev.pageX, ev.pageY);
    setPosition(draggedData, correctPos.x, correctPos.y);
    drop_anywhere.append(draggedData);
};

function setPosition(ele, xcoord, ycoord) {
    // adjust with parent position
    ele.style.position = 'absolute'
    ele.style['left'] = `${xcoord}px`
    ele.style['top'] = `${ycoord}px`
}

function correctPosition(ele, xcoord, ycoord) {
    // setup variables for location correction
    let dropLocation_x, dropLocation_y,
        delta_x, delta_y;

    // calculate deltas
    delta_x = ele.style.width / 2
    // console.log(`deltax: ${delta_x}`)
    delta_y = ele.style.height / 2
    // console.log(`deltay: ${delta_y}`)

    // corrected position
    dropLocation_x = xcoord - 25
    // console.log(`corrected x: ${dropLocation_x}`)
    dropLocation_y = ycoord - 25
    // console.log(`corrected y: ${dropLocation_y}`)
    return {
        x: dropLocation_x,
        y: dropLocation_y
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
//            Etc
//
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// listener
function evListener() {
    doc.body.addEventListener("dragend", dragEnd)
    doc.body.addEventListener("dragenter", dragEnter)
    doc.body.addEventListener("dragover", allowDrop)
    doc.body.addEventListener("dragstart", dragStart)
    doc.body.addEventListener("drop", (ev) => { drop(ev); dropAnywhere(ev); })
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
//          Return
//
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = drag_drop


// sources:
// https://www.w3schools.com/html/html5_draganddrop.asp
