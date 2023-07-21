const screen = document.getElementById("screen")
const buttons = document.querySelectorAll(".btn")
let text = ""

function isOperator(char){
    return char === '×' || char  === '+' || char  === '−' || char === '%' || char === '÷'
}

buttons.forEach(item=>{
    item.addEventListener("click",()=>{
        switch(item.textContent){
            case '0':case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':case ')':case '(':case '×':case '+':case '−':case '÷':case '%':
            case '.':{
                text+=item.textContent
                screen.innerHTML = text
                break
            }
            case "Clear":{
                text = ""
                screen.innerHTML = text
                break
            }
            case"Del":{
                text = text.slice(0,-1)
                screen.innerHTML = text
                break
            }
            case"±":{
                let array = text.split('').slice(0,text.length-1)
                array.push('(−')
                array.push(text[text.length-1])
                array.push(')')
                text = array.join('')
                screen.innerHTML = text
                break
            }
            case 'π':{
                if(isOperator(text[text.length-1])){
                    text+='π'
                }
                else{
                    text+=`*π`
                }
                screen.innerHTML = text
                break
            }
            case "Enter":{
                if(text === '') return
                try{
                    text = text.replace(/×/g,'*')
                    text = text.replace(/−/g,'-')
                    text = text.replace(/÷/g,'/')
                    text = text.replace(/π/g,'Math.PI')
                    
                    let ans = eval(text)
                    screen.innerHTML = String(ans.toFixed(10))
                    text = screen.innerHTML
                }
                catch(err){
                    screen.innerHTML = "Wrong Expression"
                }
                break
            }
        }
    })
})

screen.addEventListener("dblclick",async (e)=>{
    if(text!==''){
        let d = await navigator.clipboard.writeText(text)
        alert("Copied to Clipboard")
    }
})