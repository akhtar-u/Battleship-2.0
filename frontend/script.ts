let currentShip: string | null = null;
let firstCell: number | null = null;
let secondCell: number | null = null;
let currShipLength: number | null = null;
let shipDirection: number;
let currentShipID: string;
let overlapFlag: boolean = false;
let carrierCells: number[] = [];
let battleshipCells: number[] = [];
let cruiserCells: number[] = [];
let submarineCells: number[] = [];
let destroyerCells: number[] = [];
let allCells: number[] = [];

/* add event listeners to player buttons and gameboard */
const pbtnwrapper = document.getElementById("pships");
const pboardwrapper = document.getElementById("pboard")!.getElementsByTagName("td");

pbtnwrapper!.addEventListener("click", event => {
    const isButton = event!.target instanceof HTMLButtonElement;
    if (!isButton) {
        return;
    }
    currentShip = (<HTMLButtonElement>event.target).textContent;
    currentShipID = (<HTMLButtonElement>event.target).id;
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
                printLog("You have selected <span>" + secondCell + "</span> " +
                    "as your ending position.");
                placeShip();
            } else {
                firstCell = parseInt((<HTMLTableCellElement>event.target).getElementsByTagName("div")[0].id);
                printLog("You have selected <span>" + firstCell + "</span> " +
                    "as your starting position.");
                document.getElementById(String(firstCell))!.innerText
            }
        }
    })
}

/* add class to all board div */
for(let i = 0; i <= 99; i++){
    let div: HTMLElement | null = document.getElementById(String(i));
    div!.classList.add("d-flex");
    div!.classList.add("justify-content-center");
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

    printLog("You have selected: <span>" + currentShip + "</span>." +
        " It has length, <span>" + currShipLength + "</span>. Click on one of the cells to place your ship.");
}

function placeShip() {
    if (checkCoordinates()) {
        checkOverlap();
        /* if ship has been placed */
        (<HTMLButtonElement> document.getElementById(currentShipID)).disabled = true;
    }

    firstCell = null;
    secondCell = null;
}

function checkCoordinates(): boolean {
    /* check direction and length */
    if (Math.abs(firstCell! - secondCell!) < 10) {
        if (Math.abs(firstCell! - secondCell!) == currShipLength! - 1) {
            shipDirection = -1;
            return true;
        } else {
            printLog("Your selection is not " +
                "the correct <span>length</span>! Try again.");
        }

    } else if (Math.abs(firstCell! - secondCell!) >= 10 && firstCell! % 10 == secondCell! % 10) {
        if (Math.abs(firstCell! - secondCell!) / 10 == currShipLength! - 1) {
            shipDirection = 1;
            return true;
        } else {
            printLog("Your selection is not " +
                "the correct <span>length</span>! Try again.");
        }
    } else {
        printLog("Your selection is not <span>horizontal</span> " +
            "or <span>vertical</span>! Try again.");
    }
    return false;
}

function printLog(text: string) {
    document.getElementById("message")!.innerHTML = text;
}

function checkOverlap() {
    /* if the selection is correct, generate coordinates and check for overlap */
    if (firstCell! > secondCell!) {
        if (!hasOverlap(firstCell!, secondCell!)) {
            generateCoordinates(firstCell!, secondCell!);
        }
    } else {
        if (!hasOverlap(secondCell!, firstCell!)) {
            generateCoordinates(secondCell!, firstCell!);
        }
    }
}

function hasOverlap(larger: number, smaller: number): boolean {
    if (shipDirection < 0) {
        for (let i = smaller; i <= larger; i++) {
            if (allCells.includes(i)) {
                printLog("Your selection <span>overlaps</span> with another ship");
                return true;
            }
        }
    } else {
        for (let i = smaller; i <= larger; i += 10) {
            if (allCells.includes(i)) {
                printLog("Your selection <span>overlaps</span> with another ship");
                return true;
            }
        }
    }
    return false;
}

function generateCoordinates(larger: number, smaller: number) {
    if (shipDirection < 0) {
        for (let i = smaller; i <= larger; i++) {
            placeOnBoard(i);
        }
    } else {
        for (let i = smaller; i <= larger; i += 10) {
            placeOnBoard(i);
        }
    }
    function placeOnBoard(coord: number){
        allCells.push(coord);
        document.getElementById(String(coord))!.innerText = "#";
        document.getElementById(String(coord))!.style.color = "#ffd5d5";
    }

    printLog("You have placed your <span>" + currentShip + "</span>!");
}