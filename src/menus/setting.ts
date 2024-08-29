import mainmenu from "./main";
import { invoke } from "@tauri-apps/api/core";
import { changeSelected, reloadset, skeleton } from "../scripts/menus";
import { addEvent, removeallEvent } from "../scripts/savelisteners";

export default function settings(menu: HTMLElement, type: number = 0){
    removeallEvent();
    menu.textContent = "";
    menu.insertAdjacentHTML('beforeend', /*html*/`
        <style>
            .set{
                padding-left: 1rem;
                padding-top: 1rem;
                padding-bottom: 1rem;
                font-size: 25px;
                font-weight: 900;
                display: flex;
                flex-direction: row;
                width: 100%;
                letter-spacing: -0.05em;
                cursor: pointer;
                transition-property: background;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 75ms;                
            }
            .set:hover{
                <!-- background-color: #ffffff40; -->
            }
            .t{
                margin-left: auto;
                margin-right: 1.5rem;
                text-align: center;
                font-size: 25px
            }
            .selected{
                background-color: #ffffff40
            }
            .btn{
                transition-property: background;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 75ms;
                padding-top: 8px;
                padding-bottom: 8px;
                width: 100%;
            }
        </style>
        <all class="flex flex-col absolute w-full h-full">
            <topbar class="flex flex-row w-1/2 cursor-pointer text-3xl font-black border-r-2 text-center">
                <gameset class="btn">GRA</gameset>
                <gamecontrol class="btn px-2">STEROWANIE</gamecontrol>
                <gameaudio class="btn">AUDIO</gameaudio>
            </topbar>
            <content class="flex flex-row w-full h-full">
                <settings class="h-full w-full flex flex-col overflow-y-hidden pt-6 border-r-2 border-white">
                </settings>
                <explain class="w-full h-full border-white border-t-2 flex flex-col">
                <t class="m-2 mt-5 text-xl h-full w-full font-thin tracking-tighter leading-6"></t>
                </explain>
            </content>
            <esc class="absolute bottom-0 ml-1 opacity-50 text-lg">[ESC] - WRÓĆ </esc>
        </all>
`)

    let topbarselected = [menu.getElementsByTagName("gameset")[0], menu.getElementsByTagName("gamecontrol")[0], menu.getElementsByTagName("gameaudio")[0]];
    let topbaract: (Function | null)[] = [async function(){reloadset(menu, 0)}, async function(){reloadset(menu, 1)}, null];

    const settings = menu.getElementsByTagName("settings")[0];
    const explain = menu.getElementsByTagName("explain")[0].getElementsByTagName("t")[0];

    function changeName(list: string[], set: number, element: Element){
        if (set + 1 < list.length){
            set += 1;
        } else {
            set = 0;
        }
        
        element.getElementsByTagName("t")[0].textContent = list[set];
        return set;
    }

    function topbarinit(selected: Element[][]){
        selected[0].forEach((element, i) => {
            element.addEventListener("mousemove", ()=>{
                if (!element.classList.contains("selected")) {
                    changeSelected(0, i, selected);
                }
            });
        });
    }

    function setting(name: string): HTMLElement{
        return settings.getElementsByTagName(name)[0] as HTMLElement
    }

    if (type == 0){
        changeSelected(0,0,[topbarselected]);
        game()
    } else if (type == 1) {
        changeSelected(0,1,[topbarselected]);
        control()        
    }
    
    menu.getElementsByTagName("gameset")[0].addEventListener("mousedown",()=>{
        reloadset(menu, 0);
    })
    menu.getElementsByTagName("gamecontrol")[0].addEventListener("mousedown",()=>{
        reloadset(menu, 1);
    })

    async function game(){
        const selectedfnc = function(){return[
            topbarselected,
            [menu.getElementsByTagName("difficulty")[0]],
            [menu.getElementsByTagName("mousecamera")[0]],
            [menu.getElementsByTagName("movecamera")[0]],
            [menu.getElementsByTagName("breathcamera")[0]]
        ]};
        skeleton(/*html*/`
        <difficulty class="set"><text class="flex-none">Poziom Trudności</text><t class="t" >Reading...</t></difficulty>
        <mousecamera class="set"><text class="flex-none">Ruch kamery myszką</text><t class="t" >Reading...</t></mousecamera>
        <movecamera class="set"><text class="flex-none">Ruch kamery poprzez ruch</text><t class="t" >Reading...</t></movecamera>
        <breathcamera class="set"><text class="flex-none">Ruch kamery "oddychanie"</text><t class="t" >Reading...</t></breathcamera>
        `, 
        selectedfnc,
        [
            topbaract,
            [async function(){value[0] = changeName(["🔥PIEKŁOO🔥", "NORMALNY", "ŁATWY"], value[0], setting("difficulty"));
                invoke("write_file",
                    {line: 0, content: String(value[0]), which: 0}
                )
                if (value[0] == 0){
                    setting("difficulty").style.color = "red";
                } else {
                    setting("difficulty").style.color = "";
                }}],
            [async function(){value[1] = changeName(["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"], value[1], setting("mousecamera"));
                invoke("write_file",
                    {line: 1, content: String(value[1]), which: 0}
                )
            }],
            [async function(){value[2] = changeName(["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"], value[2], setting("movecamera"));
                invoke("write_file",
                    {line: 2, content: String(value[2]), which: 0}
                )
            }],
            [async function(){value[3] = changeName(["WYŁĄCZONY", "WŁĄCZONY"], value[3], setting("breathcamera"));
                invoke("write_file",
                    {line: 3, content: String(value[3]), which: 0}
                )
            }]
        ],
        [
            [explaininject(null), explaininject(null), explaininject(null)],
            [explaininject(`
                Zmienia jak trudna będzie rozgrywka:<br><br>
                Łatwy - Dla osób które dopiero zaczynają,<br>
                Normalny - Dla osób które są doświadczane,<br>
                PIEKŁOO - Dla osób które szukają wyzwania.
                `)],
            [explaininject(`
                Podczas ruchu myszką, kamera się w przeciwną stronę myszki.<br><br>
                Dla większej czystości możesz przełączyć na Lekki<br> i Wyłączony.
                `)],
            [explaininject(`
                Podczas ruchu gracza (WSAD), kamera się porusza w stronę kierunku ruchu.<br><br>
                Dla większej czystości możesz przełączyć na Lekki<br> i Wyłączony.
                `)],
            [explaininject(`
                Dodaje animację do kamery w stylu kamera, dodaje więcej dynamizmu do gry.<br><br>
                Dla większej czystości możesz przełączyć na Wyłączony.
                `)],
        ],
        1,
        settings,
    )
    function explaininject(text: string | null) {
        return function() {
            explain.textContent = "";
            if (text!=null){
            explain.insertAdjacentHTML("beforeend", text);
        }
        }
    }
    const selected = selectedfnc();

    topbarinit(selected);

    const value = [Number(await invoke("read_file", {line: 0, which: 0})), 
        Number(await invoke("read_file", {line: 1, which: 0})), 
        Number(await invoke("read_file", {line: 2, which: 0})), 
        Number(await invoke("read_file", {line: 3, which: 0}))]
    // let difficulty = Number(await invoke("read_file", {line: 0, which: 0}));
    // let mousecamera = Number(await invoke("read_file", {line: 1, which: 0}));
    // let movecamera = Number(await invoke("read_file", {line: 2, which: 0}));

    setting("difficulty").getElementsByClassName("t")[0].textContent = ["🔥PIEKŁOO🔥", "NORMALNY", "ŁATWY"][value[0]];
    if (value[0] == 0){
        setting("difficulty").style.color = "red";
    } else {
        setting("difficulty").style.color = "";
    }
    setting("mousecamera").getElementsByClassName("t")[0].textContent = ["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"][value[1]];
    setting("movecamera").getElementsByClassName("t")[0].textContent = ["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"][value[2]];   
    setting("breathcamera").getElementsByClassName("t")[0].textContent = ["WYŁĄCZONY", "WŁĄCZONY"][value[3]];   
    }
    
    function control(){
        const selectedfnc = function(){return[
            topbarselected,
            [menu.getElementsByTagName("up")[0]]
        ]};
        skeleton(/*html*/`
            <up class="set"><text class="flex-none">Góra</text><t class="t" >Reading...</t></up>
            `,
        selectedfnc,
        [
            topbaract,
            [async function(){console.log("Test")}]
        ],
        [
            [null, null, null],
            [function(){}]
        ], 1, settings
    )

    const selected = selectedfnc();

    topbarinit(selected);
    }
    addEvent("escape_settings", "keydown", (e:any)=>{
        console.log("nodebil")
        if(e.key == "Escape"){
            mainmenu(menu);
        }});
}