import { getScale } from "../main";

export function getMouse(e: MouseEvent){
    let Width = window.innerWidth;
    let Height = window.innerHeight;
    return [((e.clientX-(Width-(960*getScale()))/2)-(960/2)), ((e.clientY-(Height-(540*getScale()))/2)-(540/2))];
}