const titleInput = document.getElementById("title")
const descInput = document.getElementById("description")
const submitBtn = document.getElementById("submit")
const resetBtn = document.getElementById("reset")

const newTodoTab = document.getElementById("new_todo_tab")
const completedTab = document.getElementById("completed_tab")
const pendingTab = document.getElementById("pending_tab")

const newTodo = document.getElementById("new_todo")
const completeTodo = document.getElementById("complete_todo")
const pendingTodo = document.getElementById("pending_todo")

const pending_todo_div = document.getElementById("pending_todo_div")
const complete_todo_div = document.getElementById("complete_todo_div")

export default class Todo{
    constructor(title, description){
        this.title = title
        this.description = description
        this.done = false;
        this.date = new Date().toDateString()
        this.id = new Date().getTime()
    }

    static deleteTodoFromLS(id){
        if(localStorage.getItem("todos") != null){
            let array = JSON.parse(localStorage.getItem("todos"))
            let idx = array.findIndex((item)=>{return item.id == id})
            if(idx >= 0){
                array.splice(idx,1)
            }
            localStorage.setItem("todos",JSON.stringify(array))
        }
    }

    static createTodoElement(todo,parent){
        let div = document.createElement("div")
        div.id = todo.id
        div.className = "p-4 pl-5 w-auto max-w-sm"

        let innerDiv = document.createElement("div")
        innerDiv.className = "h-full flex flex-col todo bg-opacity-40 p-8 rounded"

        let titleDiv = document.createElement("div")
        titleDiv.className = "flex justify-between"

        let title = document.createElement("h1")
        title.className = "text-3xl text-white todo-title mb-2 mr-5"
        title.innerText = todo.title

        let date = document.createElement("h1")
        date.className = "text-xs date mt-4 mb-2"
        date.innerText = todo.date

        titleDiv.appendChild(title)
        titleDiv.appendChild(date)

        innerDiv.appendChild(titleDiv)

        let p = document.createElement("p")
        p.className = "leading-relaxed text-white mb-2 text-base"
        p.innerText = todo.description

        innerDiv.appendChild(p)

        let buttons = document.createElement("div")
        buttons.className = "flex justify-end buttons"

        let b1 =document.createElement("button")
        b1.className = "ml-5 text-lg"
        b1.title = "Delete"
        b1.innerHTML = `<i class="fa-solid fa-trash"></i>`

        b1.addEventListener("click",()=>{
            Todo.deleteTodoFromLS(b1.parentElement.parentElement.parentElement.id)
            b1.parentElement.parentElement.parentElement.remove()
        })

        let b2 =document.createElement("button")
        b2.className = "ml-5 text-lg"
        b2.title = "Edit"
        b2.innerHTML = `<i class="fa-sharp fa-solid fa-pen-to-square"></i>`
        b2.addEventListener("click",()=>{
            document.getElementById("modal_btn").click()
            const edit_title=document.getElementById("edit_title")
            const edit_description=document.getElementById("edit_description")

            edit_title.value = todo.title
            edit_description.value = todo.description

            document.getElementById("edit_save").addEventListener("click",()=>{
                let array = JSON.parse(localStorage.getItem("todos"))
                let idx = array.findIndex(item=>{return item.id === todo.id})
                array[idx].title = edit_title.value
                array[idx].description = edit_description.value
                localStorage.setItem("todos",JSON.stringify(array))
                document.getElementById(todo.id).firstChild.firstChild.firstChild.innerText = edit_title.value
                document.getElementById(todo.id).firstChild.firstChild.nextSibling.innerText = edit_description.value

            })
        })

        let b3 =document.createElement("button")
        b3.className = "ml-5 text-lg"
        if(todo.done){
            b3.title = "Complete"
            b3.innerHTML = `<i class="fa-solid fa-circle-check">`
            b3.addEventListener("click",()=>{
                let array = JSON.parse(localStorage.getItem("todos")) 
                let idx = array.findIndex((item)=>{return item.id == todo.id})
                array[idx].done = false
                localStorage.setItem("todos",JSON.stringify(array))

                b3.parentElement.parentElement.parentElement.remove()
                Todo.createTodoElement(array[idx],pending_todo_div)
                showPendingTodoTab()
            })
        }
        else{
            b3.title = "Pending"
            b3.innerHTML = `<i class="fa-solid fa-hourglass-half"></i>`
            b3.addEventListener("click",()=>{
                let array = JSON.parse(localStorage.getItem("todos")) 
                let idx = array.findIndex((item)=>{return item.id === todo.id})
                array[idx].done = true
                localStorage.setItem("todos",JSON.stringify(array))
                
                b3.parentElement.parentElement.parentElement.remove()
                Todo.createTodoElement(array[idx],complete_todo_div)


                showCompleteTodoTab()
            })
        }

        buttons.appendChild(b1)
        buttons.appendChild(b2)
        buttons.appendChild(b3)

        innerDiv.appendChild(buttons)
        div.appendChild(innerDiv)
        parent.appendChild(div)
        return div
    }
}

function reset(){
    titleInput.value = ""
    descInput.value = ""
}

function showNewTodoTab(){
    newTodoTab.classList.add("active-tab")
    completedTab.classList.remove("active-tab")
    pendingTab.classList.remove("active-tab")

    newTodo.style.display = "block"
    completeTodo.style.display = "none"
    pendingTodo.style.display = "none"
    localStorage.setItem("activeTab","new")
}

function showCompleteTodoTab(){
    newTodoTab.classList.remove("active-tab")
    completedTab.classList.add("active-tab")
    pendingTab.classList.remove("active-tab")
    
    newTodo.style.display = "none"
    completeTodo.style.display = "block"
    pendingTodo.style.display = "none"
    localStorage.setItem("activeTab","complete")
}
function showPendingTodoTab(){
    newTodoTab.classList.remove("active-tab")
    completedTab.classList.remove("active-tab")
    pendingTab.classList.add("active-tab")
    
    newTodo.style.display = "none"
    completeTodo.style.display = "none"
    pendingTodo.style.display = "block"
    localStorage.setItem("activeTab","pending")
}

newTodoTab.addEventListener("click",showNewTodoTab);
completedTab.addEventListener("click",showCompleteTodoTab);
pendingTab.addEventListener("click",showPendingTodoTab);

window.addEventListener("DOMContentLoaded",()=>{
    if(localStorage.getItem("todos") == null){
        localStorage.setItem("todos",JSON.stringify([]))
        return
    }
    if(localStorage.getItem("activeTab") == null){
        localStorage.setItem("activeTab","new");
    }
    else{
        let a = localStorage.getItem("activeTab")
        if(a=="new") showNewTodoTab()
        else if(a=="complete") showCompleteTodoTab()
        else if(a=="pending") showPendingTodoTab()
    }
    let array = JSON.parse(localStorage.getItem("todos"))
    array.forEach((item)=>{
        if(item.done){
            Todo.createTodoElement(item,complete_todo_div)
        }
        else{
            Todo.createTodoElement(item,pending_todo_div)
        }
    })
})

resetBtn.addEventListener("click",reset)

submitBtn.addEventListener("click",()=>{
    if(titleInput.value  == "" || descInput.value == "") return
    let array = JSON.parse(localStorage.getItem("todos"))
    let t = new Todo(titleInput.value,descInput.value)
    array.push(t)
    localStorage.setItem("todos",JSON.stringify(array))
    Todo.createTodoElement(t,pending_todo_div);
    
    showPendingTodoTab();
    reset()
})

