
let inline_styles = {
    addInlineStyle,
    changeStyle,
    inlineStyle,
    toStylesheet
}

// #322 can actually just pass an arr instead of an obj?
/**
 * Transforms an "style object" into string to add to a tag
 * Example:
 * - Input:  let box = { "border": "3px dotted blue",... }
 * - Output: "border: 3px dotted blue;"
 * @param  {[type]} obj [style object contains styles like css in key value pairs]
 * @return {[type]} string [string which converted "style object" to ongoing string]
 */
function inlineStyle(obj) {
    let tempString = '';
    for (let entries of Object.entries(obj)) {
        tempString += ` ${entries[0]}: ${entries[1]}; `
    }
    // console.log(tempString);
    return tempString;
}

/**
 * Adds inline style to a tag
 * @param  {[type]} selector [Add style to]
 * @param  {[type]} obj      [specify style]
 *      See: inlineStyle Example, for what to input here
 * @return {[type]} string   [string with all styles]
 */
function addInlineStyle(selector, obj) {
    return selector.setAttribute('style', inlineStyle(obj))
}

/**
 * Converts from the manage_styles object to css format for the stylesheet.
 * @param  {[type]} obj [usually manage_styles, my costum dynamic styles]
 * @return {[type]}     [string for dynamic stylesheet]
 */
let toStylesheet = function (obj) {
    let tempString = ''
    for (let selector of Object.keys(obj)) {
        // console.log(obj[selector]);
        for (let costumName of Object.keys(obj[selector])) {
            // console.log(selector);
            switch (selector) {
                case "classes":
                    tempString += `.${costumName}{`
                    break;
                case "ids":
                    tempString += `#${costumName}{`
                    break;
            }
            // add cases for classes, ids
            // console.log(costumName);
            // console.log(obj[selector][costumName]);
            // console.log(inlineStyle(obj[selector][costumName]));
            tempString += inlineStyle(obj[selector][costumName])
            tempString += "} "
        }
    }
    return tempString;
}
/**
 * [Takes in a string and changes the current inline style of an element, eg.]
 * <div style=" background-color: lightgray;  ~display~: grid; "></div>
 * changeStyle({"display": "block;"})
 * --> <div style=" background-color: lightgray;  ~block~: grid; "></div>
 * @param  {[type]} obj [new style element]
 * @return {[type]}     [description]
 */
let changeStyle = function (node, obj) {
    let resultString = '';
    changeString = node.getAttribute('style');
    changeStyle.includes(Object.keys(obj));


    node.setAttribute('style', resultString)
}




// #321 Look into
// inspired by $() = getELementbyid
// selector is meant to replace "wrapper"
// function $(selector,x) {
//     return selector.setAttribute("style",x);
// }

module.exports = inline_styles 

