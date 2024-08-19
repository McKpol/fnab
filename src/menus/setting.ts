import { removeAllEventListeners } from "../scripts/savelisteners";
import mainmenu from "./main";

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
                <settings class="h-full w-full flex flex-col overflow-y-scroll pt-6">
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

    function changeSelected(numbery: number | null = null, numberx: number | null = null){
        for(const selectedd of selected){
            for (const element of selectedd){
                element?.classList.remove("selected");  
            }
        }
        if (numberx == null){
            numberx = 0;
        }
        if(numbery != null){
            if (selected[numbery].length - 1 < numberx){
                numberx = 0;
            }
            selected[numbery][numberx].classList.add("selected")
        }
    }

    function checkSelected(): number[] | null{
        let y = 0;
        let x = 0;
        for(const selectedd of selected){
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
    
    game();
    
    menu.getElementsByTagName("gameset")[0].addEventListener("mousedown",()=>{
        game();
    })

    function game(){
        removeAllEventListeners();
        settings.textContent = "";
        settings.insertAdjacentHTML('beforeend', /*html*/`
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

        <difficulty class="set"><text class="flex-none">Poziom Trudności</text><t class="t" >NORMALNY</t></difficulty>
        <mousecamera class="set"><text class="flex-none">Ruch kamery myszką</text><t class="t" >WŁĄCZONY</t></mousecamera>
        <movecamera class="set"><text class="flex-none">Ruch kamery poprzez ruch</text><t class="t" >WŁĄCZONY</t></movecamera>
        `)
        
        selected = [
            [menu.getElementsByTagName("gameset")[0], menu.getElementsByTagName("gamecontrol")[0], menu.getElementsByTagName("gameaudio")[0]],
            [menu.getElementsByTagName("difficulty")[0]],
            [menu.getElementsByTagName("mousecamera")[0]],
            [menu.getElementsByTagName("movecamera")[0]]
        ]

        act = [
            [game, null, null],
            [function(){difficulty = changeName(["PIEKŁOO", "NORMALNY", "ŁATWY"], difficulty, setting("difficulty"));
                if (difficulty == 0){
                    setting("difficulty").style.color = "red";
                } else {
                    setting("difficulty").style.color = "";
                }}],
            [function(){mousecamera = changeName(["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"], mousecamera, setting("mousecamera"));}],
            [function(){movecamera = changeName(["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"], movecamera, setting("movecamera"));}]
        ]

        for(let y = 1; y < selected.length; y++){
            for (let x = 0; x < selected[y].length; x++){
                const element = selected[y][x];
                element?.addEventListener("mousemove", ()=>{
                    if (!(element.classList.contains("selected"))){
                        changeSelected(y, x);
                    }
                })
            }
        }

        let difficulty = 1;
        let mousecamera = 1;
        let movecamera = 1;

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

        
        setting("difficulty").addEventListener("mousedown", ()=>{
            difficulty = changeName(["PIEKŁOO", "NORMALNY", "ŁATWY"], difficulty, setting("difficulty"));
            if (difficulty == 0){
                setting("difficulty").style.color = "red";
            } else {
                setting("difficulty").style.color = "";
            }
        })

        setting("mousecamera").addEventListener("mousedown", ()=>{
            mousecamera = changeName(["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"], mousecamera, setting("mousecamera"));
        })

        setting("movecamera").addEventListener("mousedown", ()=>{
            movecamera = changeName(["WYŁĄCZONY", "WŁĄCZONY", "LEKKI"], movecamera, setting("movecamera"));
        })
    
        document.addEventListener("keydown",(e)=>{
            if(e.key == "Escape"){
                mainmenu(menu);
                return
            }
            const key = checkSelected();
            if (key != null){
                if(e.key == "Enter"){
                    const actn = act[key[0]][key[1]]
                    if (actn != null){
                        actn();
                    }
                    return
                }
                if(e.key.toLowerCase() == "w" && key[0] - 1 >= 0){
                    changeSelected(key[0] - 1, key[1])
                    return
                }
                if(e.key.toLowerCase() == "s" && key[0] + 1 <= selected.length - 1){
                    changeSelected(key[0] + 1, key[1])
                    return
                }
                if(e.key.toLowerCase() == "a" && key[1] - 1 >= 0){
                    changeSelected(key[0], key[1] - 1)
                    return
                }
                if(e.key.toLowerCase() == "d" && key[1] + 1 <= selected[key[0]].length - 1){
                    changeSelected(key[0], key[1] + 1)
                    return
                }
            } else{
                if (e.key.toLowerCase() == "s" || e.key.toLowerCase() == "d"){
                    changeSelected(0, 0)
                    return
                }
            } 
        })
    }
}
