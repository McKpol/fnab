export interface TrackedEventListener {
  name: string;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions | undefined;
  }

let Events: TrackedEventListener[] = [];

export function addEvent(name: string, type: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions | undefined = undefined){
    const event: TrackedEventListener = {
      name,
      type,
      listener,
      options,
    };
    if (Events.some(event => event.name === name)){
      removeEvent(name);
    }
    document.addEventListener(type, listener, options);
    Events.push(event);
}

export function removeEvent(name: string){
  const index = Events.findIndex(event => event.name === name);
  document.removeEventListener(Events[index].type, Events[index].listener, Events[index].options)
  if (index !== -1) {
    Events.splice(index, 1);
  }
}

export function removeallEvent(){
  for (const event of Events){
    document.removeEventListener(event.type, event.listener, event.options);
  }
}