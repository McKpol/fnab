import { mainmenu } from './menu';

let game: HTMLElement = document.getElementById("game")!;
let menu: HTMLElement = document.getElementById("menu")!;

function getScale(){
  let heightscale = window.innerHeight/(1080/2);
  let widthscale = window.innerWidth/(1920/2);

  if (heightscale < widthscale)
    return heightscale;
    else return widthscale
};

function gameResize(){
  game.style.scale = getScale().toString();
  game.style.transform = `translate(${-50 / getScale()}%, ${-50 / getScale()}%)`;
}

window.addEventListener("DOMContentLoaded", () => {
  mainmenu(menu);
  gameResize();
    window.addEventListener("resize", ()=>{
      gameResize();
    })
});
