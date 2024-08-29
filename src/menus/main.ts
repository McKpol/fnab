import { removeAllEventListeners } from '../scripts/savelisteners';
import { exit } from '@tauri-apps/plugin-process';
import settings from './setting';
import { getMouse } from '../scripts/scripts';
import { skeleton, changeSelected } from '../scripts/menus';

export default function mainmenu(menu: HTMLElement){
    removeAllEventListeners();
    document.addEventListener("mousemove", (e)=>{
        const MousePosition = getMouse(e);
        menu.style.transform = `translate(${MousePosition[0]/-25}px, ${MousePosition[1]/-25}px)`;
    })
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

const selectedfnc = function(){return[
    [menu.getElementsByTagName("play")[0]],
    [menu.getElementsByTagName("settings")[0]],
    [menu.getElementsByTagName("quit")[0]]
]};
const selected = selectedfnc();

    skeleton(null, 
        selectedfnc,
        [   
            [null],
            [function(){return settings(menu)}],
            [async function(){await exit(0)}]
        ],
        [   [null],
            [null],
            [null]
        ],
        0,
        document.getElementById("buttons") as HTMLElement
    )

const buttons = document.getElementById("buttons");

 // Clear selected on hover CONINUE
buttons?.getElementsByTagName("continue")[0].addEventListener("mouseenter",()=>{
    changeSelected(null, null, selected)
})

 // Clear selected on unhover buttons
buttons?.addEventListener("mouseleave", ()=>{
    changeSelected(null, null, selected);
})
}