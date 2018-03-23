export class ConnectWithLine {
  attached() {
    // select all objects
    let path = document.querySelector("path");
    let handles = document.querySelectorAll("circle");
    // set points
    let p1 = { x: 100, y: 200 };
    let p2 = { x: 250, y: 100 };
    let p3 = { x: 300, y: 200 };
    // for each circle set a tween handler
    [p1, p2, p3].forEach(function (point, i) {
      // for each circle create a tween at point {x,y}
      // note that set() is a "instant" to()
      TweenLite.set(handles[i], { x: point.x, y: point.y });
      Draggable.create(handles[i], {
        onDrag: function () {
          console.log(this.x)
          point.x = this.x;
          point.y = this.y;
          updatePath();
        }
      });
    });
    updatePath();

    function updatePath() {
      let p2x = p2.x * 2 - (p1.x + p3.x) / 2;
      let p2y = p2.y * 2 - (p1.y + p3.y) / 2;
      let d = "M" + [p1.x, p1.y] + "Q" + [p2x, p2y, p3.x, p3.y];
      path.setAttribute("d", d);
    }

  }
}
