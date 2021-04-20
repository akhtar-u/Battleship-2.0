class buttons{
    currentShip : string = "";

    constructor() {
        const wrapper = document.getElementById("pships");
        wrapper!.addEventListener("click", event => {
            const isButton = event!.target instanceof HTMLButtonElement;
            if(!isButton){
                return;
            }
            console.log((<HTMLButtonElement>event.target).id);
        })
    }
}

let button = new buttons();