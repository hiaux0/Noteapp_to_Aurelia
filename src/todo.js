export class Todo {
    constructor(description) {
        this.description = description
        this.done = false
    }

    logger() {
        console.log("from todo");
        this.loggerNew()
    }

    loggerNew() {
        console.log("yes from todo")
    }
}
