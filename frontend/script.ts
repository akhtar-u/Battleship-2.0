let currentShip: string | null = null;
let firstCell: number | null = null;
let secondCell: number | null = null;
let currShipLength: number | null = null;
let carrierCells: number[] = new Array(5);
let battleshipCells: number[] = new Array(4);
let cruiserCells: number[] = new Array(3);
let submarineCells: number[] = new Array(3);
let destroyerCells: number[] = new Array(2);
let allCells: number[] = new Array(17);

/* add event listeners to player buttons and gameboard */
const pbtnwrapper = document.getElementById("pships");
const pboardwrapper = document.getElementById("pboard")!.getElementsByTagName("td");

pbtnwrapper!.addEventListener("click", event => {
    const isButton = event!.target instanceof HTMLButtonElement;
    if (!isButton) {
        return;
    }
    currentShip = (<HTMLButtonElement>event.target).textContent;
    shipSelected();
})

for (let i = 0; i < pboardwrapper.length; i++) {
    pboardwrapper[i].addEventListener("click", event => {
        const isCell = event!.target instanceof HTMLTableCellElement;
        if (!isCell) {
            return;
        }
        if (currentShip != null) {
            if (firstCell != null) {
                secondCell = parseInt((<HTMLTableCellElement>event.target).getElementsByTagName("div")[0].id);
                document.getElementById("message")!.innerHTML = "You have selected <span>" + secondCell + "</span> " +
                    "as your ending position.";
                placeShip();
            } else {
                firstCell = parseInt((<HTMLTableCellElement>event.target).getElementsByTagName("div")[0].id);
                document.getElementById("message")!.innerHTML = "You have selected <span>" + firstCell + "</span> " +
                    "as your starting position.";
            }
        }
    })
}

function shipSelected() {
    if (currentShip == "Carrier") {
        currShipLength = 5;
    }
    if (currentShip == "Battleship") {
        currShipLength = 4;
    }
    if (currentShip == "Cruiser") {
        currShipLength = 3;
    }
    if (currentShip == "Submarine") {
        currShipLength = 3;
    }
    if (currentShip == "Destroyer") {
        currShipLength = 2;
    }

    document.getElementById("message")!.innerHTML = "You have selected: <span>" + currentShip + "</span>." +
        " It has length, <span>" + currShipLength + "</span>. Click on one of the cells to place your ship.";
}

function placeShip() {
    checkCoordinates();
    checkOverlap();

    firstCell = null;
    secondCell = null;
}

function checkCoordinates() {
    /* check direction and length */
    if (Math.abs(firstCell! - secondCell!) < 10) {
        if (Math.abs(firstCell! - secondCell!) == currShipLength! - 1) {
            console.log("horizontal");
        } else {
            printLengthError();
        }

    } else if (Math.abs(firstCell! - secondCell!) >= 10 && firstCell! % 10 == secondCell! % 10) {
        if (Math.abs(firstCell! - secondCell!) / 10 == currShipLength! - 1) {
            console.log("vertical");
        } else {
            printLengthError();
        }
    } else {
        document.getElementById("message")!.innerHTML = "Your selection is not <span>horizontal</span> " +
            "or <span>vertical</span>! Try again.";
    }
}

function printLengthError() {
    document.getElementById("message")!.innerHTML = "Your selection is not " +
        "the correct <span>length</span>! Try again.";
}

function checkOverlap(){
    /* if the selection is correct, generate coordinates and check for overlap */
    // for(let i = firstCell)

}