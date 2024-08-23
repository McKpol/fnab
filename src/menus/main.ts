import { exit } from '@tauri-apps/plugin-process';
import settings from './setting';
import { removeAllEventListeners } from '../scripts/savelisteners';

export default function mainmenu(menu: HTMLElement){
    removeAllEventListeners();
    menu.textContent = "";
    menu.insertAdjacentHTML('beforeend', /*html*/`
        <style>
            .selected{
                letter-spacing: 20px;
                color: yellow;
            }
            .btn{
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 150ms;
                padding: 4px;
                padding-left: 8px;
                padding-right: 8px;
            }
        </style>
        <all class="flex flex-col absolute w-full h-full">
        <titlegame class="absolute left-1/2 text-[60px] -translate-x-1/2 top-[15%] font-black text-nowrap">Brateq the game</titlegame>
        <buttons id="buttons" class="flex flex-col absolute left-1/2 -translate-x-1/2 top-1/2 font-black text-2xl text-center cursor-pointer">
            <play class="btn">NOWA GRA</play>
            <continue class="btn opacity-50 cursor-default">KONTYNUUJ</continue>
            <settings class="btn">USTAWIENIA</settings>
            <quit class="btn">WYJŚCIE</quit>
        </buttons>
        </all>
`)

const buttons = document.getElementById("buttons");
const selected = [buttons?.getElementsByTagName("play")[0],buttons?.getElementsByTagName("settings")[0],buttons?.getElementsByTagName("quit")[0]];

function changeSelected(number: number | null = null){
    for(const element of selected){
        element?.classList.remove("selected");    
    }
    if(number != null){
        selected[number]?.classList.add("selected")
    }
}

function checkSelected(): number | null{
    let i = 0;
    for(const element of selected){
        if(element?.classList.contains("selected")){
            return i;
        }
        i += 1;
    }
    return null;
}

 // Clear selected on hover CONINUE
buttons?.getElementsByTagName("continue")[0].addEventListener("mouseenter",()=>{
    changeSelected()
})

 // Clear selected on unhover buttons
buttons?.addEventListener("mouseleave", ()=>{
    changeSelected();
})

 // Keyboard Support
document.addEventListener("keydown",(e)=>{
    const index = checkSelected();
    if(e.key == "w"|| e.key == "ArrowUp"){
        if(index != null && index != 0){
            changeSelected(index - 1);
        }
    }
    if(e.key == "s"|| e.key == "ArrowDown"){
        if(index != null && index + 1 < selected.length ){
            changeSelected(index + 1);
        } else if (index == null){
            changeSelected(0);
        }
    }
})

 // Mouse support
for(let i = 0; i < selected.length; i++){
    const element = selected[i];
    element?.addEventListener("mousemove", ()=>{
        if (!(element.classList.contains("selected"))){
            changeSelected(i);
        }
    })
}

 // Action buttons
buttons?.getElementsByTagName("quit")[0]?.addEventListener("mousedown",async ()=>{
    console.log("quit")
    await exit(1);
})

buttons?.getElementsByTagName("settings")[0].addEventListener("mousedown",()=>{
    settings(menu);
})
}