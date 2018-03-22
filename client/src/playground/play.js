import {inject} from 'aurelia-framework'

import connectArea from '../features/connect_area/connect-area'
import 'gsap'
import Draggable from "gsap/Draggable";

export class Play {
  myArr = _.range(0,12)
  greeting = "Good Morning"
  parentSize = null
  scrollDifference = 0;

  attached() {
    $(function () { // initialize tooltip
      $('[data-toggle="tooltip"]').tooltip() })
    $(function () { // initialize popover
      $('[data-toggle="popover"]').popover() })  
    $('.popover-dismiss').popover({ //click anywhere to dismiss popover
      trigger: 'focus' })
  }

  /**
   * Activate Popper using the jQuery method
   * 
   * 
   * @memberOf Play
   */
  activatePopover(ev,num) {
    let target = ev.target
    let coords = target.getBoundingClientRect()
    let middlePoint = connectArea.rectangle.getMiddlePoint(coords)
    let options = {
      container: 'body',
      title: `Target ${num}`,
      content: `X-Y: (${Math.round(coords.x)},${Math.round(coords.y)})
      Middle point of Rectangle (X:${middlePoint.x}, Y:${middlePoint.y})`,
      placement: "auto",
      trigger: "hover"
    }
    $(`#grid-item-${num}`).popover(options)
    $(`#grid-item-${num}`).popover('toggle')
    $(`#grid-item-${num}`).on('hidden.bs.popover', function () {
      $(`#grid-item-${num}`).popover('dispose')
    })
  }

  /**
   * Uses 3 points to draw bezier curce in svg using gsap.
   * 
   * @param {any} parentSize To transform coordsystem, since svg is not at origin
   * @param {any} id1 
   * @param {any} id2 
   * @param {any} id3 
   * 
   * @memberOf Play
   */
  drawLine(id1,id2,id3) {
    let classThis = this
    // select targets
    let path = document.querySelector("path");

    let aa = document.getElementById(`grid-item-${id1}`);
    let bb = document.getElementById(`grid-item-${id2}`);
    let cc = document.getElementById(`grid-item-${id3}`);
    let targets = [aa,bb,cc];
      /**
       * Get coords of targets
       * @returns adjusted coords since svg graph will always start at origin
       */
      function coordi(target) {
        /**
         * Transform svg graph to origin
         * @returns tranformed points
         */
        function svgGraphToOrigin(x, y) {
          if (typeof arguments[0] === "object") {
            return {
              x: arguments[0].x - classThis.parentSize.x,
              y: arguments[0].y - classThis.parentSize.y
            }
          } else {
            return {
              x: x - classThis.parentSize.x,
              y: y - classThis.parentSize.y
            }
          }
        }
        let x = target.getBoundingClientRect().x;
        let y = target.getBoundingClientRect().y 
        let transformed = svgGraphToOrigin(x,y)
        return {
          x: Math.round(transformed.x),
          y: Math.round(transformed.y)
        };
      };
    let coordA = coordi(aa);
    let coordB = coordi(bb);
    let coordC = coordi(cc);
    // add effect for targets

    [coordA, coordB, coordC].map( (coord,i) => {
      Draggable.create(targets[i], {
        onDrag: (ev) => {
          let that = ev.target.getBoundingClientRect()
          coord.x = that.x - classThis.parentSize.x ;
          coord.y = that.y - classThis.parentSize.y ;
          updatePath();
        }
      })
    })
    updatePath();
    console.log(coordA)
    
    function updatePath() {
      let coordBx = coordB.x * 2 - (coordA.x + coordC.x) / 2;
      let coordBy = coordB.y * 2 - (coordA.y + coordC.y) / 2;
      let d = "M" +[coordA.x, coordA.y]+ "Q"+ [coordBx, coordBy,coordC.x,coordC.y];
                  
      path.setAttribute("d", d);
    }  
  }

  /**
   * As the svg element doesn't start at the origin, we need to transform it
   */
  getContainerSize() {
    this.parentSize = this.getSizeForSvg.getBoundingClientRect()
    this.drawLine(1, 6, 3)
    // handle scrolling and resizing
    $(window).on("scroll", (ev) => {
      this.parentSize = document.getElementById("grid-container").getBoundingClientRect()
      this.drawLine( 1, 6, 3)
    });
    window.addEventListener('resize', () => {     // prior used $(window) but didnt work (why?)
      this.parentSize = document.getElementById("grid-container").getBoundingClientRect()
      this.drawLine( 1, 6, 3);    
    });
  }

  makeDraggable() {
    let container = document.getElementById("grid-container")
    Array.from(container.children).map(ele => {
      if(ele.tagName === 'DIV') {
        Draggable.create(ele , {
          onDrag: function(ev) {
          }
        }) 
      }
    })
  }
  test() { 
    console.log }

}
