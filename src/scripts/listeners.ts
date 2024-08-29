import { listen } from '@tauri-apps/api/event';
import settings from '../menus/setting';

export default function(menu: HTMLElement){
    
    listen('writefile', (event) => {
        const error = document.getElementsByTagName("error")[0];
        console.log(event.payload)
        if(event.payload == 0){
            error.classList.remove("showerror");
            error.getElementsByTagName("t")[0].textContent = "Uszkodzony plik";
            error.getElementsByTagName("o")[0].textContent = "Plik z ustawieniami był/został uszkodzony, resetowanie pliku oraz strony.";
            error.classList.add("showerror");
            settings(menu);
        }
    });
}
