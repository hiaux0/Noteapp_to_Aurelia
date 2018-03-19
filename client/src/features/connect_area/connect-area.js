
let connectStorage = []

let connectArea = {
  getConnectStorageSize,
  listenToConnect,
  areaDistancesToOrigin, // sorting
  euclideanDistaceToOrigin,
  rectangle: {
    /**
     * Accepts either an object {x,y,height,width} or all args as if
     * @returns Middle point of given rectangle (coords) as an object {x,y}
     */
    getMiddlePoint: function (x, y, height, width) {
      if(typeof arguments[0] === "object") {
        let x = arguments[0].x + (arguments[0].width * 0.5)
        let y = arguments[0].y + (arguments[0].height * 0.5)
        return {
          x: Math.round(x),
          y: Math.round(y)
        }
      } else {
        // console.log(arguments.length,4,"arg list error")
        return {
          x: x + width * 0.5,
          y: y + height * 0.5
        }
      }   
    }
  }
}

/**
 * Function to connect textareas
 * 1. trigger on cmd-press
 * 2. click all areas you want to connect
 * a. If cmd is release remove all listeners
 * 
 */
function listenToConnect() {
  const container = document.getElementById("note-container")
  // listen for cmd-press
  container.addEventListener("keydown", (ev) => {
    if(ev.which === 91) {
      console.log(ev.which)
    // while cmd is pressed, at textareas to connectStorage
      container.addEventListener("click", pushToStorage)
      container.addEventListener("keydown", drawLine)
    }
  })
  container.addEventListener("keyup", (ev) => {
    if(ev.which === 91) {
      container.removeEventListener("click", pushToStorage)
      container.removeEventListener("keydown", drawLine)
      
      // resets storage since you only want to execute function if cmd is pressed
      // connectStorage.length = 0
    }
  })
  
  function drawLine(ev) {
    ev.preventDefault()
    console.log(ev.which)
    switch(ev.which) {
    case 76:
      console.log("drawing line")
      getLineEndPts()
      break;
    default:
    }
  }
    function getLineEndPts() {
      // case where only 2 areas are selecetd 2018-03-14 23:21:30
      const middlePtNearLeft = getCorners(connectStorage[0],"bl")
      const middlePtNearRight = getCorners(connectStorage[0],"br")
        const middlePtNear =  {
          x: (middlePtNearLeft.x + middlePtNearRight.x)*0.5,
          y: middlePtNearLeft.y 
        }
      const middlePtFarLeft = getCorners(connectStorage[1], "tl")
      const middlePtFarRight = getCorners(connectStorage[1], "tr")
        const middlePtFar = {
          x: (middlePtFarLeft.x + middlePtFarRight.x) * 0.5,
          y: middlePtFarLeft.y
        }
      // [{x,y},{x,y}] 
      return [middlePtNear,middlePtFar]
      
    }

  function pushToStorage(ev) {
    console.log(ev.target.getBoundingClientRect())
    connectStorage.push(ev.target)
    connectStorage.map( ele => {
      console.log("id: ", ele.id)
      let coords = ele.getBoundingClientRect()
      console.log("has euc dis: ", euclideanDistaceToOrigin({ x: coords.x, y: coords.y}))
    })
    connectStorage = areaDistancesToOrigin(connectStorage)
		console.log('pushToStorage -> connectStorage', connectStorage);
  }
}
  /** 
  * Takes all elements of connectStorage and sorts them according to their distance to the origin
  * 
  */
  function areaDistancesToOrigin(connectStorage) {
    return connectStorage.sort((a,b) => {
      const coord_a= transformToPoints(a)
      const coord_b= transformToPoints(b)
      console.log(coord_a)
      return euclideanDistaceToOrigin(coord_a) - euclideanDistaceToOrigin(coord_b)
    })
  }
    function euclideanDistaceToOrigin(ele) {
      return Math.sqrt((ele.x)**2 + (ele.y)**2)
    }
    /**
     * 
     * 
     * @param {any} eleNode 
     * @returns 
     */
    function transformToPoints(eleNode) {
      return {x:eleNode.getBoundingClientRect().x, y:eleNode.getBoundingClientRect().y}
    }
    /**
     * Pt nearest origin is at index 0, farest is last in array
     * get upper left coords
     * 
     * @param {any} arr 
     * @returns 
     */
    function transformToPointsAll(arr) {
      return arr.map(ele => transformToPoints(ele))
    }

    function getCorners(ele, whichCorner) {
      switch(whichCorner) {
        case "tr":
          return {
            x: ele.getBoundingClientRect().right,
            y: ele.getBoundingClientRect().top
          }
          break
        case "bl":
          return {
            x: ele.getBoundingClientRect().left,
            y: ele.getBoundingClientRect().bottom
          }
          break
        case "br":
          return {
            x: ele.getBoundingClientRect().right,
            y: ele.getBoundingClientRect().bottom
          }
          break
        case "tl":
          return {
            x: ele.getBoundingClientRect().left,
            y: ele.getBoundingClientRect().top
          }
          break
      }
    }

function getConnectStorageSize() {
  return console.log(connectStorage.length) }

export default connectArea
