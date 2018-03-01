

// refactor, such that index.html doesn't require this one anymore
// right now it does
// main logic output should only be in app.js
// define(['jquery', 'helper_lib', 'context_menu_lib', 'context_menu_logic'], function ($, helper, cm, cm_logic) {
// import { contextMenu } from 'jquery-contextmenu'

module.exports = (function () {
const contextMenu = require('jquery-contextmenu')
const _cm_logic = require('./cm_logic')

    // start ======================================
    const doc = document;
    let changeDisplayedText = 'Ondemand cm';

    // listen to highlight event
    _cm_logic.listeners.evListener()

    // #422
    $(function () {
        $.contextMenu({
            selector: '#container',
            // trigger: 'left',
            // delay:1,
            items: {
                SplitDiv: {
                    name: "Split Div",
                    items: {
                        Split_test: {
                            name: "Split",
                            className: "head-line",
                        },
                        Split_horizontally: {
                            name: "Horizontal",
                            callback: _cm_logic.grid.splitThisHorizontally
                        },
                        Split_vertically: {
                            name: "Vertical",
                            callback: _cm_logic.grid.splitThisVertically
                        },
                        // range: {
                        //     name: 'By',
                        //     type: 'range',
                        //     id: 'contextMenuSlider',
                        //     // #425 be able to input min, max,step and value somehow
                        //     options: { min: 1, max: 5, step: 1, },
                        //     value: 3
                        // }
                    }
                },

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // TODO: #323
                // when activate: change current tag to another one
                ChangeTagTo: {
                    name: "Change Tag to",
                    items: {
                        ChangeToTextarea: {
                            name: "Textarea",
                            // isHtmlName: true,
                            callback: _cm_logic.textmanipulation.changeToTextarea
                        },
                        ChangeToDiv: {
                            name: "Div",
                            callback: _cm_logic.textmanipulation.changeToDiv
                        }
                    }
                },
                Sep: "--------------------------",
            },
            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            // events
            events: {
                show: function (itemKey, opt) {
                    // console.log("changed? " + itemKey.commands.edit.name);
                    // _cm_logic.grid.listenForSlider();
                    // cm_logic.textmanipulation.displayCurrentTarget();

                }
            }
        });
    });


    // end ======================================


// })

})();
