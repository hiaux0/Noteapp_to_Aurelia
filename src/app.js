
import {Todo} from './todo'
import {contextMenu} from 'jquery-contextmenu'
import playNew from './playground/playNew'
import play from "./playground/play"
import porterplay from "./playground/porterplay"


export class App {
    constructor() {
        this.heading = "Todos"
        this.todos = []
        this.todoDescription = ''
    }

    multipleCalls() {
        this.launchCM()
        // this.inlineStyling()
        // let todotest = new Todo("hi")
        // todotest.logger()
        play.hello()
        porterplay.sayHi()

        // requirejs(['./playground/play','jquery-contextmenu'], function (play,cm) {
        //     console.log("from require")
        //     console.log(play)
        //     $(function () {
        //         $.contextMenu({
        //             selector: '#container',
        //             // trigger: 'left',
        //             // delay:1,
        //             items: {
        //                 SplitDiv: {
        //                     name: "Split Div From require",
        //                 },

        //                 Sep: "--------------------------",
        //             },
        //         });
        //     });
        // })
    }

    addTodo() {
        if(this.todoDescription) {
            this.todos.push(new Todo(this.todoDescription))
            this.todoDescription = ''
        }
    }

    removeTodo(todo) {
        let index = this.todos.indexOf(todo)
        if(index !== -1) {
            this.todos.splice(index,1)
        }
    }

    clickTest() {
        console.log("success")
        let container = document.getElementById("container")
        console.log(container)
    }

    launchCM() {
        $(function () {
            $.contextMenu({
                selector: '#container',
                // trigger: 'left',
                // delay:1,
                items: {
                    SplitDiv: {
                        name: "Split Div From require",
                        callback: play.hello
                    },

                    Sep: "--------------------------",
                },
            });
        });

    }

    // inlineStyling() {
    //     let is = new Play("hi")
    //     let container = document.getElementById("container")
        
    //     let box = { "border": "3px dotted blue" }
    //     console.log(is)
    //     is.addInlineStyle(container, box)
    // }



}


