const _inSty = require('../inline_styles')

// start ======================================
let doc = document,
    grid = {},
    methods = {},
    target,
    txtman = {};


let cm_logic = {
    grid: {
        numCol: 3,
        appendChildsTo,
        changeGridColumns,
        // listenForSlider,
        splitThisVertically,
        splitThisHorizontally
    },
    listeners: {
        evListener
    },
    methods: {
        highlightTarget
    },
    textmanipulation: {
        changeToDiv,
        changeToTextarea,
        displayCurrentTarget
    }
}

const container = doc.getElementById('container')

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////
///////              grid
///////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

let numCol = 3;


// #423, #728, #200202
/**
 * [append {number} of childs to selector]
 * @param  {[type]} number   [description]
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
// --> #727
function appendChildsTo(selector, number) {
    let count = number;
    if (selector.innerHTML) {
        var childDiv = doc.createElement("DIV")
        childDiv.innerHTML = selector.innerHTML
        // remove original content
        selector.innerHTML = "";
        // add box style to childDiv
        childDiv.classList.add('box');
        selector.appendChild(childDiv);
        count--;
        // area becomes dropable and draggable
        childDiv.classList.add("dropable")
        childDiv.setAttribute("draggable", true)
    }
    while (count--) {
        var childDiv = doc.createElement("DIV")
        childDiv.innerHTML = ' .'
        // add box style to childDiv
        childDiv.classList.add('box');
        selector.appendChild(childDiv);
    }
}

/** #729 (issue like #726, but very close)
 * [description]
 * @param  {[type]} selector [description]
 * @param  {[type]} number   [description]
 * @return {[type]}          [description]
 */
function changeGridColumns(selector, number) {
    // remove children from last split
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild)
    }
    // add new children according to grid.numCol
    appendChildsTo(selector, number)
    // change grid-template accordingly
    selector.style["grid-template-columns"] = `repeat(${number}, 1fr)`

}

// #325
// 
// function listenForSlider() {
//     // get slider and slider output
//     let sliderOutput = doc.getElementById("sliderOutput")
//     let contextMenuSlider = doc.getElementById('contextMenuSlider')

//     // listener for changes, when changes happen, change the div
//     contextMenuSlider.addEventListener("input", function (ev) {
//         if (doc.getElementsByClassName("wrapper").length !== 0) {
//             sliderOutput.innerHTML = ` ${contextMenuSlider.value}`
//             let wrapper = doc.getElementsByClassName("wrapper")
//             // change numCol value
//             numCol = contextMenuSlider.value
//             changeGridColumns(wrapper[0], numCol)
//         }
//     });
// }


// #426, #724 ,#725
/**
 * [Splits Div  into equal sections via CSS-grid]
 * @return {[type]} [description]
 */
function splitThisVertically() {
    if (!target) {
        return;
    }
    ///////////////////////////////////////
    //   ->        #724.
    //
    // add warpper class to target in order to have gird layout
    //  do I add a class to target or create a child???? 07-02-2018 15:53
    //     I go with the first optino for now 07-02-2018 15:58
    target.classList.add("wrapper")
    // area becomes dropable and draggable
    target.classList.add("dropable")
    target.setAttribute("draggable", true)

    // add dynamic style to wrapper
    _inSty.method.addInlineStyle(target, {
        // "background-color": "lightgray",
        "display": "grid",
        "grid-template-columns": `repeat(${numCol}, 1fr)`
    })
    //  split eleNode into numCol columns
    appendChildsTo(target, numCol)
}

/**
 * [Splits Div  into equal sections via CSS-grid]
 * @return {[type]} [description]
 */
function splitThisHorizontally() {
    if (!target) {
        return;
    }
    target.classList.add("wrapper")
    // area becomes dropable and draggable
    target.classList.add("dropable")
    target.setAttribute("draggable", true)
    // add dynamic style to wrapper
    _inSty.method.addInlineStyle(target, {
        // "background-color": "lightgray",
        "display": "grid"
    })
    // "grid-template-columns": `repeat(${numCol}, 1fr)`})
    //  split eleNode into numCol columns
    appendChildsTo(target, numCol)
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////
///////                 styles
///////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// 323
let stylesheet = doc.createElement('style')

let manage_styles = {
    //___ manage_styles beging ________________
    classes: {
        'box': {
            "border": "1px dotted blue",
            "resize": "both",
            "overflow": "auto"
        },

        'menuitem': {
            "color": "blue"
        }
    },
    ids: {
        'heaven': {
            "font-size": "3px"
        }
    },
    general: {
        'div': {
            "draggable": "true"
        }
    }
    //___ manage_styles end ________________
}

stylesheet.innerHTML = _inSty.toStylesheet(manage_styles)
doc.body.appendChild(stylesheet);

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////
///////                              methods
/////// this section contains general methods
///////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/** #722 not every element will get highlighted due to specification
 * [Toggles selected class, shows only the one clicked last]
 * @param  {[type]} target [description]
 * @return {[type]}        [first time I experienced a "WHAT DID I DO"]
 */
function highlightTarget() {
    ++count;
    if (count % 2 === 1) {
        target.classList.toggle("selected")
        if (count > 1) {
            temp.classList.toggle("selected")
            count = 1;
        }
        temp = target
    } else {
        target.classList.toggle("selected")
        temp.classList.toggle("selected")
        temp = target
        count = 2
    }
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////
///////                txtman
///////                this section is for textmanipulation (eg. div to textarea)
///////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// #721
function changeToDiv() {
    if (!target) {
        return;
    }
    // saves textarea value to pass to div
    let tempVal = target.value
    console.log(tempVal);
    // get the parent
    let div = target.parentNode;
    div.innerText = tempVal;

}

/**
 * [ Changes Div to Textarea]
 * @return {[type]} [logic]
 */
function changeToTextarea() {
    if (!target) {
        return;
    }
    // create textarea
    let copyTextarea = doc.createElement('TEXTAREA')
    // copy content
    copyTextarea.innerText = target.innerText;
    // get size of current div
    let targetWidth = target.offsetWidth;
    let targetHeight = target.offsetHeight;
    // change textarea size to div size
    copyTextarea.style['width'] = `${targetWidth}px`;
    copyTextarea.style['height'] = `${targetHeight}px`;
    // hide the changed Element and adjust parent div size
    target.innerHTML = "";
    // add textarea
    target.appendChild(copyTextarea);
    // target.style["height"] = `${targetHeight+3}px`
    console.log(target.style["height"]);
}

/**
 * [Displays the current target in the context_menu]
 * @return {[type]} []
 */
function displayCurrentTarget() {
    // trigger only if target is set
    if (target) {
        const cm_item = doc.getElementsByClassName('cmi__CurrentTarget')
        cm_item[0].children[0].innerText = `Current Target: ${target.outerHTML}`
    }
}


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////
///////                event listeners
///////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
let count = 0;
let temp;
let targetSelected = false;

function listenToHighlight(ev) {
    // #7211
    if (!ev.path[0].parentNode.classList.hasOneOf("context-menu-item context-menu-list")) {
        target = ev.path[0];
        console.log(ev.target);
        highlightTarget();
        // set target for display
    }
};

function evListener() {
    doc.body.addEventListener("click", listenToHighlight)
}


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////
///////              end
///////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
module.exports = cm_logic
// end   ======================================
