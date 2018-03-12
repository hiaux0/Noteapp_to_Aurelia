    // require("jsdom-global")()

export default (function () {

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    //
    // Iterable Helpers
    //
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    // get the last element of array
    // TODO: also of object, or of anything really
    // .map?
    // method to call the last element of array
    // array.last()
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    };

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    //
    // DOM Manipulation Helpers
    //
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    /* Adds Element BEFORE NeighborElement */
    Element.prototype.appendBefore = function (element) {
        element.parentNode.insertBefore(this, element);
    }, false;

    /* Adds Element AFTER NeighborElement */
    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    }, false;
    // https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib


    /**
     * [checks for multiple classes in an eleNode]
     * @param  {[type]} classes ["a b c d"]
     * @return {[type]}         []
     */
    DOMTokenList.prototype.containsMany = function (classes) {
        var items = classes.split(' ');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (this.contains(item) == false) {
                return false;
            }
        }
        return true;
    }
    // https://forum.kirupa.com/t/using-classlist-contains-on-multiple-elements/633888

    /**
     * [Motivated by containsMany, now only checks whether a class is present]
     * @param  {[type]} classes [description]
     * @return {[type]}         [description]
     */
    DOMTokenList.prototype.hasOneOf = function (classes) {
        var items = classes.split(' ');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (this.contains(item)) {
                return true;
            }
        }
        return false;
    }



})();
