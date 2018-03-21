import { WriteDragDrop } from '../../src/features/write_anywhere/write-drag-drop';

// describe("clear database", () => {
//   it("happy path", () => {
//     const mockArr = [1,2,[3,4]]
//     expect(new WriteDragDrop().clearCanvas()).toBe(5)
//   })
// })

describe("Toggle Draggable", () => {
  beforeEach( function() {
    this.WDD = new WriteDragDrop()
    console.log(this.WDD)
    let div = window.document.createElement("DIV") // create div
    div.textContent = "ClassEdit" // set content in order to appear in window
    div.classList.add("draggable") // give it class draggable
    window.document.body.appendChild(div) // append to body
    this.draggable = this.WDD.methods.draggable
    spyOn(this.draggable, "makeDraggableToggle").and.callThrough()
  })

  // note that false is default value
  it("was called in case false", function() { 
    this.draggable.makeDraggableToggle(this.WDD.Draggable) // initiate action
    
    expect(this.draggable.makeDraggableToggle).toHaveBeenCalled()
    expect($(".draggable").attr("contenteditable")).toBe("false")
  })
  it('was called in case true', function() {
    this.WDD.draggableToggle = true
    this.draggable.makeDraggableToggle() // initiate action
    
    expect(this.draggable.makeDraggableToggle).toHaveBeenCalled()
    expect($(".draggable").attr("contenteditable")).toBe("true")

  })
})

describe('WDD.addContentStorageElement: Save newly created child Notes to view', function() {
  let div = window.document.createElement("DIV")
  div.id = 'note-container'
  div.textContent = 'note-container'
  window.document.body.appendChild(div)

  beforeEach(function() {
    this.WDD = new WriteDragDrop()
    this.spyEvent = spyOnEvent('#note-container', 'click')
    spyOnEvent($('#note-container'),'click') // add spy event on click simulation
    $('#note-container').on("click", (ev) => { // listener for click event
      this.WDD.addContentStorageElement(ev)// trigger expected method on click
    })
    $('#note-container').click() // simulate actual click
  })
   
  it('render new child note to view', function() {
    expect($('#note-container')).toBeInDOM() // targer ele in dom
    expect('click').toHaveBeenTriggeredOn($('#note-container')) // click triggered on right element
    expect(this.spyEvent).toHaveBeenTriggered() // click triggered
    expect(this.WDD.contentStorage.length).toBe(1) // method successfull
  })
})

describe('WDD.childNotes', function() {
  beforeEach(function() {
    this.WDD = new WriteDragDrop()
    // Mock element in window
      let element = window.document.createElement("DIV")
      element.textContent = "Element for listenToDragAndSave"
      element.style.left = 100;
      element.style.top = 100;
      element.id = 2
      element.style.transform = "translate3d(1.0px, 1.0px, 0px)";

      window.document.body.appendChild(element)
    // mock contStor content
    this.WDD.contentStorage = [ 
      {id:1,position: {x:111,y:111}},
      {id:2,position: {x:200,y:200}}
    ] 
    // Draggable event is fired and dragEnd has function #TODO
    // Change position of an element
                  // spyOnEvent($(".draggable"),"dragstop") // maybe "dragend" instead of "dragstop"
    // Get changes
    this.listenToDragAndSave = this.WDD.methods.childNotes.listenToDragAndSave
    this.listenToDragAndSave(element)

  })
  // After dragging small notes, their position should be saved to contentStorage
  it('When position changed, save changes to contentStorage', function() {
    expect(this.WDD.contentStorage[1].position).toBe('s')
  })
})
