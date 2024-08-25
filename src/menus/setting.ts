import { removeAllEventListeners } from "../scripts/savelisteners";
import mainmenu from "./main";
import { invoke } from "@tauri-apps/api/core";

export default function settings(menu: HTMLElement){
    removeAllEventListeners();
    menu.textContent = "";
    menu.insertAdjacentHTML('beforeend', /*html*/`
        <style>
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
                <gamecontrol class="btn">STEROWANIE</gamecontrol>
                <gameaudio class="btn">AUDIO</gameaudio>
            </topbar>
            <content class="flex flex-row w-full h-full">
                <settings class="h-full w-full flex flex-col overflow-y-hidden pt-6">
                </settings>
                <explain class="bg-slate-50/50 w-full h-full">
                </explain>
            </content>
            <esc class="absolute bottom-0 ml-1 opacity-50 text-lg">[ESC] - WRÓĆ </esc>
        </all>
`)

    let selected = [
        [menu.getElementsByTagName("gameset")[0], menu.getElementsByTagName("gamecontrol")[0], menu.getElementsByTagName("gameaudio")[0]]
    ]
    let act = [
        [game, null, null],
    ]

    function changeSelected(numbery: number | null = null, numberx: number | null = null, list: Element[][] = selected){
        for(const selectedd of list){
            for (const element of selectedd){
                element?.classList.remove("selected");  
            }
        }
        if (numberx == null){
            numberx = 0;
        }
        console.log(numbery, list)
        if(numbery != null){
            if (list[numbery].length - 1 < numberx){
                numberx = 0;
            }
            list[numbery][numberx].classList.add("selected")
        }
    }

    function checkSelected(list: Element[][] = selected): number[] | null{
        let y = 0;
        let x = 0;
        for(const selectedd of list){
            for(const element of selectedd){
                if(element?.classList.contains("selected")){
                    return [y, x];
                }
                x += 1;
            }
            y += 1;
            x = 0;
        }
        return null;
    }

    for(let y = 0; y < selected.length; y++){
        for (let x = 0; x < selected[y].length; x++){
            const element = selected[y][x];
            element?.addEventListener("mousemove", ()=>{
                if (!(element.classList.contains("selected"))){
                    changeSelected(y, x);
                }
            })
        }
    }

    const settings = menu.getElementsByTagName("settings")[0];
    // const explain = menu.getElementsByTagName("explain")[0];

    function changeName(list: string[], set: number, element: Element){
        if (set + 1 < list.length){
            set += 1;
        } else {
            set = 0;
        }
        
        element.getElementsByTagName("t")[0].textContent = list[set];
        return set;
    }

    function setting(name: string): HTMLElement{
        return settings.getElementsByTagName(name)[0] as HTMLElement
    }

    game();
    
    menu.getElementsByTagName("gameset")[0].addEventListener("mousedown",()=>{
        game();
    })
    

    async function skeleton(HTML: string, fncselected: Function, act:(Function | null)[][]){
        removeAllEventListeners();
        settings.textContent = "";
        settings.insertAdjacentHTML('beforeend', `${HTML}`);
        const selected: Element[][] = fncselected();
        console.log(selected);
        for(let y = 1; y < selected.length; y++){
            for (let x = 0; x < selected[y].length; x++){
                const element = selected[y][x];
                element?.addEventListener("mousemove", ()=>{
                    if (!(element.classList.contains("selected"))){
                        changeSelected(y, x, selected);
                    }
                })
            }
        }

        for (let y = 1; y < selected.length; y++){
            if (y != 0){
                for (let x = 0; x < selected[y].length; x++){
                    const fnc = act[y][x];
                    const element = selected[y][x];
                    if (fnc != null){
                        element.addEventListener("mousedown", ()=>fnc())
                    }
                    x++;
                }
            }
        }
        document.addEventListener("keydown",(e)=>{
            if(e.key == "Escape"){
                mainmenu(menu);
                return
            }
            const key = checkSelected(selected);
            if (key != null){
                console.log(e.key);
                if(e.key == "Enter"){
                    const actn = act[key[0]][key[1]]
                    if (actn != null){
                        actn();
                    }
                    return
                }
                if((e.key.toLowerCase() == "w" || e.key == "ArrowUp") && key[0] - 1 >= 0){
                    changeSelected(key[0] - 1, key[1], selected)
                    return
                }
                if((e.key.toLowerCase() == "s" || e.key == "ArrowDown") && key[0] + 1 <= selected.length - 1){
                    changeSelected(key[0] + 1, key[1], selected)
                    return
                }
                if((e.key.toLowerCase() == "a" || e.key == "ArrowLeft") && key[1] - 1 >= 0){
                    changeSelected(key[0], key[1] - 1, selected)
                    return
                }
                if((e.key.toLowerCase() == "d" || e.key == "ArrowRight") && key[1] + 1 <= selected[key[0]].length - 1){
                    changeSelected(key[0], key[1] + 1, selected)
                    return
                }
            } else{
                if (e.key.toLowerCase() == "s" || e.key.toLowerCase() == "d"){
                    changeSelected(0, 0, selected)
                    return
                }
            } 
        })
    }
    
    async function game(){
        skeleton(/*html*/`
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
        </style>
        <difficulty class="set"><text class="flex-none">Poziom Trudności</text><t class="t" >Reading...</t></difficulty>
        <mousecamera class="set"><text class="flex-none">Ruch kamery myszką</text><t class="t" >Reading...</t></mousecamera>
        <movecamera class="set"><text class="flex-none">Ruch kamery poprzez ruch</text><t class="t" >Reading...</t></movecamera>
        `, 
        function(){const selected = [
            [menu.getElementsByTagName("gameset")[0], menu.getElementsByTagName("gamecontrol")[0], menu.getElementsByTagName("gameaudio")[0]],
            [menu.getElementsByTagName("difficulty")[0]],
            [menu.getElementsByTagName("mousecamera")[0]],
            [menu.getElementsByTagName("movecamera")[0]]
        ]
        return selected},
        [
            [game, null, null],
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
            }]
        ]
    )
    const value = [Number(await invoke("read_file", {line: 0, which: 0})), Number(await invoke("read_file", {line: 1, which: 0})), Number(await invoke("read_file", {line: 2, which: 0}))]
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
    }
    
}
