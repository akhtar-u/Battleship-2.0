let currentShip: string | null = null;
let firstCell: number | null = null;
let secondCell: number | null = null;
let currShipLength: number | null = null;
let currentShipID: string;
let shipDirection: number;
let cpuShipsPlaced: boolean = false;
let attackTile: number | null = null;
let cpuShipCoordinates: number[];
let gameOver: boolean = false;
let attackedCellsByCpu: number[];
let allCells: number[] = [];

/* create a ship class */
class Ship {
    name: string;
    length: number;
    coordinates: number[];
    buttonID: string;

    constructor(name: string, length: number, buttonID: string) {
        this.name = name;
        this.length = length;
        this.buttonID = buttonID;
        this.coordinates = [];
    }
}

/* create the 5 ships for the game */
/* player ships */
let carrier = new Ship("Carrier", 5, "pcarrier");
let battleship = new Ship("Battleship", 4, "pbattleship");
let cruiser = new Ship("Cruiser", 3, "pcruiser");
let submarine = new Ship("Submarine", 3, "psubmarine");
let destroyer = new Ship("Destroyer", 2, "pdestroyer");

/* cpu ships */
let cpucarrier = new Ship("Carrier", 5, "ccarrier");
let cpubattleship = new Ship("Battleship", 4, "cbattleship");
let cpucruiser = new Ship("Cruiser", 3, "ccruiser");
let cpusubmarine = new Ship("Submarine", 3, "csubmarine");
let cpudestroyer = new Ship("Destroyer", 2, "cdestroyer");


/* add event listeners to player buttons and gameboard */
const pbtnwrapper = document.getElementById("pships");
const pboardwrapper = document.getElementById("pboard")!.getElementsByTagName("td");
const cpuboardwrapper = document.getElementById("cboard")!.getElementsByTagName("td");

pbtnwrapper!.addEventListener("click", event => {
    const isButton = event!.target instanceof HTMLButtonElement;
    if (!isButton) {
        return;
    }
    currentShip = (<HTMLButtonElement>event.target).textContent;
    currShipLength = shipSelected().length;
    currentShipID = shipSelected().buttonID;
    /* set coordinates to null if player changes ship */
    firstCell = null;
    secondCell = null;

    printLog("You have selected: <span>" + currentShip + "</span>." +
        " It has length, <span>" + currShipLength + "</span>. Click on one of the cells to place your ship.");
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
            }
        }
    })
}

for (let i = 0; i < cpuboardwrapper.length; i++) {
    cpuboardwrapper[i].addEventListener("click", event => {
        const isCell = event!.target instanceof HTMLTableCellElement;
        if (!isCell) {
            return;
        }
        if (cpuShipsPlaced) {
            let tempID = (<HTMLTableCellElement>event.target).getElementsByTagName("div")[0].id
            tempID = tempID.slice(1);
            attackTile = parseInt(tempID);

            if(!gameOver){
                playGame();
            }
        }
    })
}

document.getElementById("start")!.addEventListener("click", ev => {
    // generateCPUShips();
    cpuShipCoordinates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    attackedCellsByCpu = [];
    for(let i = 0; i <= 99; i++){
        attackedCellsByCpu.push(i);
    }

    cpuShipsPlaced = true;
    (<HTMLButtonElement>document.getElementById("start")).disabled = true;
    printLog("CPU ships have been set. Destroy it's ships by clicking on the CPU board!");
})

/* add class to all board div */
for (let i = 0; i <= 99; i++) {
    let div: HTMLElement | null = document.getElementById(String(i));
    let cpudiv: HTMLElement | null = document.getElementById("c" + String(i));
    div!.classList.add("d-flex");
    cpudiv!.classList.add("d-flex");
    div!.classList.add("justify-content-center");
    cpudiv!.classList.add("justify-content-center");
}

function shipSelected(): Ship {
    if (currentShip == carrier.name) {
        return carrier;
    }
    if (currentShip == battleship.name) {
        return battleship;
    }
    if (currentShip == cruiser.name) {
        return cruiser;
    }
    if (currentShip == submarine.name) {
        return submarine;
    }

    return destroyer;
}

function placeShip() {
    if (checkCoordinates()) {
        checkOverlap();
        /* if ship has been placed */
        (<HTMLButtonElement>document.getElementById(currentShipID)).disabled = true;
        currentShipID = "";
        currShipLength = null;
        currentShip = null;
    }

    if (allCells.length == 17) {
        document.getElementById("start")!.style.display = "block";
        // console.log(allCells);
        // console.log(carrier.coordinates);
        // console.log(battleship.coordinates);
        // console.log(cruiser.coordinates);
        // console.log(submarine.coordinates);
        // console.log(destroyer.coordinates);
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

    function placeOnBoard(coord: number) {
        allCells.push(coord);
        shipSelected().coordinates.push(coord);
        document.getElementById(String(coord))!.innerText = "⚓";
    }

    printLog("You have placed your <span>" + currentShip + "</span>!");
}

function playGame() {
    if(document.getElementById("c" + attackTile)!.innerText == "") {
        if (cpuShipCoordinates.includes(attackTile!)) {
            document.getElementById("c" + attackTile)!.innerText = "💥";
            cpuShipCoordinates.splice(cpuShipCoordinates.indexOf(attackTile!), 1);
        } else {
            document.getElementById("c" + attackTile)!.innerText = "❌";
        }
        checkWinner();
        attackPlayer();
    }
}

function attackPlayer(){
    let newAttack: number = attackedCellsByCpu.splice(Math.floor(Math.random() * attackedCellsByCpu.length),1)[0];

    if(allCells.includes(newAttack)){
        document.getElementById(String(newAttack))!.innerText = "💥";
        allCells.splice(allCells.indexOf(newAttack), 1);
    }
    else{
        document.getElementById(String(newAttack))!.innerText = "❌";
    }
    checkWinner();
}

function checkWinner(){
    if(cpuShipCoordinates.length == 0){
        printLog("Player WINS! Refresh the page to play again.");
        gameOver = true;
    }
    if(allCells.length == 0){
        printLog("CPU WINS! Refresh the page to play again.");
        gameOver = true;
    }
}


// /* randomly place ships on the board */
// function generateCPUShips() {
//     let shipPlaced = false;
//     let shipCoords = [];
//
//     // keep generating ship placement possibilities till one works
//     do {
//
//         let randomTile = Math.floor(Math.random() * emptyTiles.length);
//
//         if (Math.random() >= 0.5) {
//             let directionX = true;
//         } else {
//             let directionX = false;
//         }
//
//         // check possible placement in X direction
//         if (directionX == true) {
//             let rowCheck = randomTile % 10;
//             // if ship fits generate rest of coordinates and check for overlap
//             if (rowCheck + (shipLength - 1) <= 9) {
//                 let overlap = false;
//                 for (let i = 0; i < shipLength; i++) {
//                     if (!emptyTiles.includes(randomTile + i)) {
//                         overlap = true;
//                     }
//                 }
//
//                 if (overlap == false) {
//                     // place ship on CPU board
//                     for (let i = 0; i < shipLength; i++) {
//                         // add tiles to ship arrays
//                         shipCoords.push(randomTile + i);
//
//                         // remove tiles from being chosen again
//                         let index = emptyTiles.indexOf(randomTile + i);
//                         if (index != -1) {
//                             emptyTiles.splice(index, 1);
//                         }
//
//                         // end loop and return array
//                         shipPlaced = true;
//                     }
//                 }
//                 // ship can't fit due to overlap
//                 else {
//                     generateShipCoords(shipLength);
//                 }
//             }
//             // ship can't fit given the starting tile - restart loop
//             else {
//                 generateShipCoords(shipLength);
//             }
//         }
//
//         // check possible placement in Y direction
//         else {
//             if (randomTile + shipLength * 10 <= 99) {
//                 // check if overlap exists
//                 let overlap = false;
//                 for (let i = 0; i < shipLength * 10; i += 10) {
//                     if (!emptyTiles.includes(randomTile + i)) {
//                         overlap = true;
//                     }
//                 }
//
//                 // no overlap found
//                 if (overlap == false) {
//                     // place ship on CPU board
//                     for (let i = 0; i < shipLength * 10; i += 10) {
//                         // add tiles to ship arrays
//                         shipCoords.push(randomTile + i);
//
//                         // remove tiles from being chosen again
//                         let index = emptyTiles.indexOf(randomTile + i);
//                         if (index != -1) {
//                             emptyTiles.splice(index, 1);
//                         }
//
//                         // end loop and return array
//                         shipPlaced = true;
//                     }
//                 }
//
//                 // ship can't fit due to overlap
//                 else {
//                     generateShipCoords(shipLength);
//                 }
//             }
//
//             // ship can't fit given the starting tile - restart loop
//             else {
//                 generateShipCoords(shipLength);
//             }
//         }
//     } while (!shipPlaced);
//     return shipCoords;
// }
//
//
// (<HTMLButtonElement>document.getElementById("start")).disabled = true;
// }