/** README
 * Handle drag and drop of dyn notes
 * 
 */
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Imports
//^
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
import Draggable from "gsap/Draggable";
import { ScrollExpansion } from './scroll_expansion/scroll-expansion'
import {mylodash as _} from '../helper_lib'

export const DragDrop = new function(){ self = this
  self.nc_rect = null
  self.nc_global = null

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//
//    Methods
//^
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  self.m = {
    initDrag: function(ele) {

      // 

      let targetEle = ele.children[0].children[0]
      let D = Draggable.create(targetEle, {
        autoScroll: 1,
        onDragStart: (ev) => {
          this.currLeft = Number((targetEle.style.left).match(/-?\d+(\.\d+)?/g)); console.log('​currLeft', this.currLeft);
        },
        onDrag: (ev) => {
          ScrollExpansion.expansion.scrollExpansion_Right(ev,ele)
          ScrollExpansion.autoScroll.autoScrollOnDrag_Right(ev, D, this.currLeft)
        },
        onDragEnd: () => {
          D[0].kill()
        }
      })
    },
    notes: {
      /** As Draggable moves elements via transform, this method filters the coords
       */
      filterTransform: (transformString) => {
        let regex = /(-?\d+(\.\d*)?)/g // matches 3 in "3d" aswell (still learning regex), thus array index 1 and 2
        let filteredCoords = transformString.match(regex)
        return {
          x: Number(filteredCoords[1]),
          y: Number(filteredCoords[2])
        }
      },
      /** As Draggable moves elements via transform, we need to combined the transfrom style with style.left/top.
       * Uses Regex to match Numbers and parses them
       */
      coordsForDatabase: function(targetEle) {
        const filteredTransform = (this.filterTransform(targetEle.style.transform))  //get coords of transfrom3d in format {x,y}
        const leftOfEle         = Number((targetEle.style.left).match(/-?\d+(\.\d+)?/g)[0])  // get current left
        const topOfEle          = Number((targetEle.style.top) .match(/-?\d+(\.\d+)?/g)[0])  // get current top
        const combineX          = leftOfEle + filteredTransform.x  
        const combineY          = topOfEle  + filteredTransform.y
        return { x: combineX, y: combineY }
      }
    },
    view: {
      current_nc_dim: () => {
          return {
            x: {
              "left": self.nc_rect.x + self.nc_global.scrollLeft,
              "right": self.nc_rect.x + self.nc_global.scrollLeft + self.nc_rect.width,
            },
            y: {
              "left": self.nc_rect.y + self.nc_global.scrollTop,
              "right": self.nc_rect.y + self.nc_global.scrollTop + self.nc_rect.height,
            }
          }
      },
      listenToExpansion: new function() {
        console.log("in drag-drop")
        console.log(self.nc_global)
        // self.nc_global.addEventListener('scroll', effScrollListener)
        let effScrollListener = _.debounce(function (ev) {
          console.log(ev)
          const scrollHeight = (this.scrollHeight)
          const eleHeight = (this.getBoundingClientRect().height)
          const diffHeight = scrollHeight - eleHeight
          // console.log(
          //   'diffHeight: ',diffHeight,
          //   'scroll: ', this.scrollTop
          // )
          if (Math.abs(diffHeight - this.scrollTop) < 10) {
            console.log('at bottom')
          }

        }, 250)
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
}
