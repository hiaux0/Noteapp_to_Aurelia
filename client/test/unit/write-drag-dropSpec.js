import { WriteDragDrop } from '../../src/features/write_anywhere/write-drag-drop';

// describe("clear database", () => {
//   it("happy path", () => {
//     const mockArr = [1,2,[3,4]]
//     expect(new WriteDragDrop().clearCanvas()).toBe(5)
//   })
// })
let WDD = new WriteDragDrop() 
let Draggable = window.Draggable
// console.log(Draggable)
// console.log(window)
describe("Toggle Draggable", () => {
  let div = window.document.createElement("DIV")
  div.textContent = "ClassEdit"
  div.classList.add("edit")
  window.document.body.appendChild(div)

  it("was called in case false", () => {
    let WDD = new WriteDragDrop()
    WDD.draggable = window.Draggable
    let draggable = WDD.method.draggable
    console.log(WDD)
    spyOn(draggable,"makeDraggableToggle").and.callThrough()

    draggable.makeDraggableToggle(Draggable)
    
    expect(draggable.makeDraggableToggle).toHaveBeenCalled()
    expect($(".edit").attr("contenteditable")).toBe("false")
  })
})
