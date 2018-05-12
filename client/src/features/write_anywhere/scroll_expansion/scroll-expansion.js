/** README
 * 
 * 1. What?
 * - When draggin a note to the edge of #note-container, you will be able to auto expand the container
 * 2. Why?
 * - Because the main file write-drag-drop.js got too crowded
 * 3. How?
 * - By listening where the drag element is, you will be able to expand in that particular direction
 */
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Imports
 //^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
    
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Component Initialization
 //^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
    // note_container_rect = document.getElementById("note-container").getBoundingClientRect()
    // console.log('​ScrollExpansion -> attached -> note_container_rect', note_container_rect);
    // ScrollExpansion.note_container_global = document.getElementById("note-container")
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Methods
 //^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
export const ScrollExpansion = {
    note_container_rect: null,
    note_container_global: null,
    noteContainerScrollLeft: null,
    noteContainerScrollTop: null,
    expandedBool: false,

    autoScroll: {
      /**
         * @BUGS
         * 1. #0304_rutn48: when mouse moves outside of container, breaks
         * @param eleLeft left of ele before drag
         */
      autoScrollOnDrag_Right: function(ev, D, eleLeft) {
        const offsetX = ("offsetX: ", D[0].pointerEvent.offsetX)     //  Monitor Draggable
        const layerX = ("layerX: ", D[0].pointerEvent.layerX)        //
        if (ScrollExpansion.expandedBool) {
          D[0].update()                                               // update Draggable to reflect
          // update left of target with scrollLeft
          if (ev.target.style.left && ScrollExpansion.noteContainerScrollLeft) {
            // set new left
            let newLeft = eleLeft + ScrollExpansion.noteContainerScrollLeft * (2 / 3)
            ev.target.style.left = `${newLeft}px`
          }
          // 1. autoscroll in that direction
          if (layerX - offsetX === 0) {
            ScrollExpansion.expandedBool = false
          }
        }
      },
      all: () => { },
      bottom: function (ev, D, eleTop) {
        console.log('​eleTop', eleTop);
        const offsetY = ("offsetY: ", D[0].pointerEvent.offsetY)     //  Monitor Draggable
        const layerY = ("layerY: ", D[0].pointerEvent.layerY)        //
        if (ScrollExpansion.expandedBool) {
          D[0].update()                                               // update Draggable to reflect
          // update top of target with scrollLeft
          if (ev.target.style.top && ScrollExpansion.noteContainerScrollTop) {
            // set new top
            let newTop = eleTop + ScrollExpansion.noteContainerScrollTop * (2/3)
            ev.target.style.top = `${newTop}px`
          }
          // 1. autoscroll in that direction
          if (layerY - offsetY === 0) {
            ScrollExpansion.expandedBool = false
          }
        }
      },
      left: () => { 
      },
      right: () => { },
      top: () => { },

    },
    expansion: {
      all: (ev, ele) => { },
      bottom: (ev, ele) => { 
        const docScrollTop = (ScrollExpansion.note_container_global.ownerDocument.scrollingElement.scrollTop)
        const mouseY = ele.getBoundingClientRect().y - ScrollExpansion.note_container_rect.y + ScrollExpansion.note_container_global.scrollTop + docScrollTop;
        const bottomExpasion = mouseY / (ScrollExpansion.note_container_global.scrollHeight);
        // console.log('​bottomExpasion', bottomExpasion);
        if (bottomExpasion > 0.84) { // value, at which to start to expand
          ScrollExpansion.expandedBool = true
          console.log('expand bottom')
          // 1. expand in direction
          createScrollHelper( -50) // how far expansion should go
        }
        // HELPER
          function createScrollHelper(expandValue) {
            const SPANPosX = ev.clientX; // console.log('​WriteDragDrop -> SPANPosX', SPANPosX);
            const SPANPosY = ev.clientY; // console.log('​WriteDragDrop -> SPANPosY', SPANPosY);
            if ((document.getElementById("automaticScroller"))) {
              const scroller = document.getElementById("automaticScroller")
              scroller.style.left = `${SPANPosX}px`
              scroller.style.top = `${SPANPosY + 100 + ScrollExpansion.note_container_global.scrollTop + expandValue}px`

            } else {
              // 1. create element
              const SPAN = document.createElement("SPAN")
              SPAN.textContent = "......................"
              SPAN.id = "automaticScroller"
              // 2. get clientX/Y and set position
              SPAN.style.width = `${1}px`
              SPAN.style.height = `${1}px`
              SPAN.style.position = "relative"
              // 2.1 part where you can adjust how far automatic expansion should happen  
              SPAN.style.left = `${SPANPosX }px`
              SPAN.style.top = `${SPANPosY + 100 + expandValue}px`
              // 3. append to #note-conatainer  
              ScrollExpansion.note_container_global.appendChild(SPAN)
            }
        }
      },
      /** @ACHTUNG: cannot scroll to negative
       */
      left: (ev,ele) => { 
        const mouseX = ele.getBoundingClientRect().x - ScrollExpansion.note_container_rect.x - ScrollExpansion.note_container_global.scrollLeft; // or + c maybe?
        const leftExpasion = mouseX / (ScrollExpansion.note_container_global.scrollWidth);
        if (leftExpasion < 1 - 0.83) { // value, at which to start to expand
          ScrollExpansion.expandedBool = true
          console.log('expand left')
        }

      },
      right: (ev,ele) => { },
      top: (ev,ele) => {
        const docScrollTop = (ScrollExpansion.note_container_global.ownerDocument.scrollingElement.scrollTop)
        const mouseY = ele.getBoundingClientRect().y - ScrollExpansion.note_container_rect.y + ScrollExpansion.note_container_global.scrollTop + docScrollTop;
        const topExpasion = mouseY / (ScrollExpansion.note_container_global.scrollHeight);
        if (topExpasion < 1 - 0.84) { // value, at which to start to expand
          ScrollExpansion.expandedBool = true
          console.log('expand top')
          // 1. expand in direction
          // createScrollHelper.call(ScrollExpansion, -50) // how far expansion should go
        }

      },
      /**
        * Listens to drag and expand #note-container if drag reaches border
        * @TASKS
        * 1. Expand #note-container
        * 2. Monitor drag 
        */
      scrollExpansion_Right: function(ev, ele) {
        // @TASK 1 
        // 1. get mouse position: a - b - c, where
        // a: current x coord unadjusted;__b: adjust since position relative, thus #note-container starts at 0,0;__c: position according to scrollbar
        const mouseX = ele.getBoundingClientRect().x - ScrollExpansion.note_container_rect.x + ScrollExpansion.note_container_global.scrollLeft;
        // 2. If Mouse reaches certain area, expand
        const rightExpansion = mouseX / (ScrollExpansion.note_container_global.scrollWidth);
        if (rightExpansion > 0.83) { // value, at which to start to expand
          console.log('Expand Right')
          ScrollExpansion.expandedBool = true
          // 1. expand in direction
          createScrollHelper( -50) // how far expansion should go
        }
        // HELPERS
        // in positive x axis
        function createScrollHelper(expandValue) {
          const SPANPosX = ev.clientX; // console.log('​WriteDragDrop -> SPANPosX', SPANPosX);
          const SPANPosY = ev.clientY; // console.log('​WriteDragDrop -> SPANPosY', SPANPosY);
          if ((document.getElementById("automaticScroller"))) {
            const scroller = document.getElementById("automaticScroller")
            scroller.style.left = `${SPANPosX - 100 + ScrollExpansion.note_container_global.scrollLeft + expandValue}px`
            scroller.style.top = `${SPANPosY}px`

          } else {
            // 1. create element
            const SPAN = document.createElement("SPAN")
            SPAN.textContent = "......................"
            SPAN.id = "automaticScroller"
            // 2. get clientX/Y and set position
            SPAN.style.width = `${1}px`
            SPAN.style.height = `${1}px`
            SPAN.style.position = "relative"
            // 2.1 part where you can adjust how far automatic expansion should happen  
            SPAN.style.left = `${SPANPosX - 100 + expandValue}px`
            SPAN.style.top = `${SPANPosY}px`
            // 3. append to #note-conatainer  
            ScrollExpansion.note_container_global.appendChild(SPAN)
          }
        }

        // @TASK 2
        // #OPTIMIZE by not creating so many duplicates
      }
    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Playground
 //^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Position of elements in #note-container
 *  - left upper is (0,0)
 * 
 * Relative x,y coords in #note-container
 * {
 *  x: ele.layerX + note_container_global.scrollLeft,
 *  y: ele.layerY + note_container_global.scrollTop
 * }
 */
