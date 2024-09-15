export const acceptedKeys = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m","shift","ctrl","space","1","2","3","4","5","6","7","8","9","0","control","alt"]

export let MoveMenu = false;

function toggle(value: boolean){
    if (value){
        return false
    } else {
        return true
    }

}

export function SetMoveMenu(value: boolean){
    MoveMenu = value;
}

export function ToggleMoveMenu(){
    MoveMenu = toggle(MoveMenu);
}