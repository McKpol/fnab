export function changeSelected(numbery: number | null = null, numberx: number | null = null, list: (Element | null)[][], code: (Function | null) = null){
    for(const selectedd of list){
        for (const element of selectedd){
            element?.classList.remove("selected");  
        }
    }
    if(numbery != null){
        if (numberx == null){
            numberx = 0;
        }
        if (list[numbery].length - 1 < numberx){
            numberx = 0;
        }
        const Element = list[numbery];
        if (Element[numberx] != null){
            Element[numberx]!.classList.add("selected")
        }
        }
        if (code!=null){
            code();
        }
    }

export function checkSelected(list: Element[][]): number[] | null{
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

import settings from "../menus/setting";
import { addEvent } from "./savelisteners";
export function reloadset(menu: HTMLElement, type: number){
    settings(menu, type);
}

// import { removeAllEventListeners } from "./savelisteners";

export function skeleton(HTML: string | null, fncselected: Function, act:(Function | null)[][], hover: (Function | null)[][], start: number, inject: Element){

    if (HTML!=null){
        inject.textContent = "";
        inject.insertAdjacentHTML('beforeend', `${HTML}`);
    }
    const selected: Element[][] = fncselected();
    for(let y = start; y < selected.length; y++){
        for (let x = 0; x < selected[y].length; x++){
            const element = selected[y][x];
            element?.addEventListener("mousemove", ()=>{
                if (!(element.classList.contains("selected"))){
                    changeSelected(y, x, selected);
                }
            })
        }
    }

    for (let y = start; y < selected.length; y++){
        if (y != 0){
            for (let x = 0; x < selected[y].length; x++){
                const fnc = act[y][x];
                const element = selected[y][x];
                const hoveract = hover[y][x];                

                if (hoveract != null){
                    element?.addEventListener("mouseenter",()=>hoveract())
                }
                if (fnc != null){
                    element.addEventListener("mousedown", ()=>fnc())
                }
                x++;
            }
        }
    }
    addEvent("skeleton_keydown", "keydown",(e:any)=>{

        function hoveract(key: [number,number]){
            const hoveract = hover[key[0]][key[1]]
            if (hoveract) {
                hoveract()
            }
        }

        let key = checkSelected(selected);
        if (key != null){
            if(e.key == "Enter"){
                const actn = act[key[0]][key[1]]
                if (actn != null){
                    actn();
                }
                return
            }
            if((e.key.toLowerCase() == "w" || e.key == "ArrowUp") && key[0] - 1 >= 0){
                changeSelected(key[0] - 1, key[1], selected)
            } else
            if((e.key.toLowerCase() == "s" || e.key == "ArrowDown") && key[0] + 1 <= selected.length - 1){
                changeSelected(key[0] + 1, key[1], selected)
            } else
            if((e.key.toLowerCase() == "a" || e.key == "ArrowLeft") && key[1] - 1 >= 0){
                changeSelected(key[0], key[1] - 1, selected)
            } else
            if((e.key.toLowerCase() == "d" || e.key == "ArrowRight") && key[1] + 1 <= selected[key[0]].length - 1){
                changeSelected(key[0], key[1] + 1, selected)
            }
        } else {
            if (e.key.toLowerCase() == "s" || e.key.toLowerCase() == "d" || e.key == "ArrowDown" || e.key == "ArrowRight"){
                changeSelected(0, 0, selected)
            }
        } 
        key = checkSelected(selected)
        if (key!=null){
            console.log("test")
            hoveract([key[0], key[1]])
        }
    })    
}