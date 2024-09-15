import mainmenu from "./main";
import { invoke } from "@tauri-apps/api/core";
import { changeSelected, reloadset, skeleton } from "../scripts/menus";
import { addEvent, removeallEvent, removeEvent } from "../scripts/savelisteners";
import { MoveMenu, SetMoveMenu, acceptedKeys } from "../scripts/publicvars";

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
    let topbaract: (Function | null)[] = [function(){if(!MoveMenu){reloadset(menu, 0)}}, function(){if(!MoveMenu){reloadset(menu, 1)}}, null];

    const settings = menu.getElementsByTagName("settings")[0];
    const explain = menu.getElementsByTagName("explain")[0];

    function changeName(list: string[], set: number, element: Element){
        if (set + 1 < list.length){
            set += 1;
        } else {
            set = 0;
        }
        
        element.getElementsByTagName("t")[0].textContent = list[set];
        return set;
    }

    function topbarinit(selected: (Element | null)[][], fnc: Function | null = null){
        selected[0].forEach((element, i) => {
            element!.addEventListener("mousemove", ()=>{
                if (!element!.classList.contains("selected")) {
                    if (!MoveMenu){
                        changeSelected(0, i, selected);
                        if (fnc != null){
                            fnc();
                        }
                    }
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
        if(!MoveMenu){reloadset(menu, 0)};
    })
    menu.getElementsByTagName("gamecontrol")[0].addEventListener("mousedown",()=>{
        if(!MoveMenu){reloadset(menu, 1)};
    })

    function explaininject(text: string | null) {
        return function() {
            explain.getElementsByTagName("t")[0].textContent = "";
            if (text!=null){
            explain.getElementsByTagName("t")[0].insertAdjacentHTML("beforeend", text);
        }
        }
    }
    
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
    const selected = selectedfnc();

    topbarinit(selected, explaininject(null));

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
    
    
    async function control(){
        explain.textContent = "";
        explain.insertAdjacentHTML("beforeend", /*html*/`
            <removekey class="set"><t class="mx-auto">Ustaw domyślne klawisze<t></removekey>
            <keys class="w-full m-auto text-center h-2/3 font-black text-5xl"></keys>
            <backkey class="absolute hidden font-bold bottom-1/3 w-1/2 text-center">Kliknij BACKSPACE aby powrócić</backkey>
            `)
        const selectedfnc = function(){return[
            topbarselected,
            [menu.getElementsByTagName("gotoup")[0]],
            [menu.getElementsByTagName("gototopbar")[0]],
            [menu.getElementsByTagName("up")[0],menu.getElementsByTagName("removekey")[0]],
            [menu.getElementsByTagName("down")[0],menu.getElementsByTagName("removekey")[0]],
            [menu.getElementsByTagName("left")[0],menu.getElementsByTagName("removekey")[0]],
            [menu.getElementsByTagName("right")[0],menu.getElementsByTagName("removekey")[0]],
            [menu.getElementsByTagName("use")[0],menu.getElementsByTagName("removekey")[0]],
            [menu.getElementsByTagName("inv")[0],menu.getElementsByTagName("removekey")[0]],
            [menu.getElementsByTagName("esc")[0],menu.getElementsByTagName("removekey")[0]]
        ]};
        
        let keysettings: string[][] = [];
        for (let x = 0; x < 7; x++){
            const text: string = await invoke("read_file", {line: 4+x, which: 0});
            let namekey = [];
            let old_text = "";
            for (let y = 0; y < text.length; y++){
                if (text[y]==","){
                    namekey.push(old_text);
                    old_text = "";
                } else{
                    old_text = old_text + text[y];
                }
            }
            namekey.push(old_text)
            keysettings.push(namekey);
        }
        console.log(keysettings);

        function changekey(number: number | null = null){
            return function(){
                let text = "";
                if (number!=null){
                    text = keysettings[number][0];
                    for (let x=1;keysettings[number].length>x;x++){
                        text = text + ", " + keysettings[number][x];
                    }
                    explain.getElementsByTagName("removekey")[0].getElementsByTagName("t")[0].textContent = "Usuń klawisze";
                } else {
                    explain.getElementsByTagName("removekey")[0].getElementsByTagName("t")[0].textContent = "Ustaw domyślne klawisze";
                }
                explain.getElementsByTagName("keys")[0].textContent = text;}
            }


        function setkey(number: number) {
            explain.getElementsByTagName("backkey")[0].classList.remove("hidden");
            SetMoveMenu(true);
            let keys = keysettings[number];
            addEvent("setkey", "keydown", (e: any)=>{
                const key: string = e.key;
                if (acceptedKeys.includes(key.toLowerCase()) && !keys.includes(key)){
                    keysettings[number].push(key);
                    console.log(keys);
                }
                
                if (key == "Backspace"){
                    SetMoveMenu(false);
                    explain.getElementsByTagName("backkey")[0].classList.add("hidden");
                    removeEvent("setkey");
                }
                
                changekey(number);
            });
        }

        skeleton(/*html*/`
            <gotoup></gotoup>
            <gototopbar></gototopbar>
            <up class="set"><text class="flex-none">Góra</text><t class="t" >></t></up>
            <down class="set"><text class="flex-none">Dół</text><t class="t" >></t></down>
            <left class="set"><text class="flex-none">Lewo</text><t class="t" >></t></left>
            <right class="set"><text class="flex-none">Prawo</text><t class="t" >></t></right>
            <use class="set"><text class="flex-none">Użyj/Dalej</text><t class="t" >></t></use>
            <inv class="set"><text class="flex-none">Epwikunek</text><t class="t" >></t></inv>
            <esc class="set"><text class="flex-none">Pauza/Anuluj</text><t class="t" >></t></esc>
            `,
        selectedfnc,
        [
            topbaract,
            [function(){},null,null,null],
            [null],
            [function(){return setkey(0)}],
            [function(){return setkey(1)},null],
            [function(){return setkey(2)},null],
            [function(){return setkey(3)},null],
            [function(){return setkey(4)},null],
            [function(){return setkey(5)},null],
            [function(){return setkey(6)},null],
        ],
        [
            [changekey(), changekey(), changekey()],
            [function(){changeSelected(3, 0, selected, changekey(0));}],
            [function(){changeSelected(0, 0, selected, changekey());}],
            [changekey(0),null],
            [changekey(1),null],
            [changekey(2),null],
            [changekey(3),null],
            [changekey(4),null],
            [changekey(5),null],
            [changekey(6),null],
        ], 1, settings
    )

    const selected = selectedfnc();

    topbarinit(selected, changekey());
    }
    addEvent("escape_settings", "keydown", (e:any)=>{
        if(e.key == "Escape" && !MoveMenu){
            mainmenu(menu);
        }});
}