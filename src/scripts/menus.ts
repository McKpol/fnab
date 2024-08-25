export function changeSelected(numbery: number | null = null, numberx: number | null = null, list: Element[][]){
    console.log(list);
    for(const selectedd of list){
        for (const element of selectedd){
            element?.classList.remove("selected");  
        }
    }
    if (numberx == null){
        numberx = 0;
    }
    if(numbery != null){
        if (list[numbery].length - 1 < numberx){
            numberx = 0;
        }
        list[numbery][numberx].classList.add("selected")
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
export function reloadset(menu: HTMLElement, type: number){
    settings(menu, type);
}