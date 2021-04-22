"use strict";
let currentShip = null;
let firstCell = null;
let secondCell = null;
let currShipLength = null;
let currentShipID;
let shipDirection;
let cpuShipsPlaced = false;
let attackCell;
let cpuShipCoordinates;
let gameOver = false;
let attackedCellsByCpu;
let allCells = [];
/* create a ship class */
class Ship {
    constructor(name, length, buttonID) {
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
const pboardwrapper = document.getElementById("pboard").getElementsByTagName("td");
const cpuboardwrapper = document.getElementById("cboard").getElementsByTagName("td");
pbtnwrapper.addEventListener("click", event => {
    const isButton = event.target instanceof HTMLButtonElement;
    if (!isButton) {
        return;
    }
    currentShip = event.target.textContent;
    currShipLength = shipSelected().length;
    currentShipID = shipSelected().buttonID;
    /* set coordinates to null if player changes ship */
    firstCell = null;
    secondCell = null;
    printLog("You have selected: <span>" + currentShip + "</span>." +
        " It has length, <span>" + currShipLength + "</span>. Click on one of the cells to place your ship.");
});
for (let i = 0; i < pboardwrapper.length; i++) {
    pboardwrapper[i].addEventListener("click", event => {
        const isCell = event.target instanceof HTMLTableCellElement;
        if (!isCell) {
            return;
        }
        if (currentShip != null) {
            if (firstCell != null) {
                secondCell = parseInt(event.target.getElementsByTagName("div")[0].id);
                printLog("You have selected <span>" + secondCell + "</span> " +
                    "as your ending position.");
                placeShip();
            }
            else {
                firstCell = parseInt(event.target.getElementsByTagName("div")[0].id);
                printLog("You have selected <span>" + firstCell + "</span> " +
                    "as your starting position.");
            }
        }
    });
}
for (let i = 0; i < cpuboardwrapper.length; i++) {
    cpuboardwrapper[i].addEventListener("click", event => {
        const isCell = event.target instanceof HTMLTableCellElement;
        if (!isCell) {
            return;
        }
        if (cpuShipsPlaced) {
            let tempID = event.target.getElementsByTagName("div")[0].id;
            tempID = tempID.slice(1);
            attackCell = parseInt(tempID);
            if (!gameOver) {
                playGame();
            }
        }
    });
}
document.getElementById("start").addEventListener("click", ev => {
    // generateCPUShips();
    cpuShipCoordinates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    cpucarrier.coordinates = [1, 2, 3, 4, 5];
    cpubattleship.coordinates = [6, 7, 8, 9];
    cpucruiser.coordinates = [10, 11, 12];
    cpusubmarine.coordinates = [13, 14, 15];
    cpudestroyer.coordinates = [15, 16];
    attackedCellsByCpu = [];
    for (let i = 0; i <= 99; i++) {
        attackedCellsByCpu.push(i);
    }
    cpuShipsPlaced = true;
    document.getElementById("start").disabled = true;
    printLog("CPU ships have been set. Destroy it's ships by clicking on the CPU board!");
});
/* add class to all board div */
for (let i = 0; i <= 99; i++) {
    let div = document.getElementById(String(i));
    let cpudiv = document.getElementById("c" + String(i));
    div.classList.add("d-flex");
    cpudiv.classList.add("d-flex");
    div.classList.add("justify-content-center");
    cpudiv.classList.add("justify-content-center");
}
function shipSelected() {
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
        document.getElementById(currentShipID).disabled = true;
        currentShipID = "";
        currShipLength = null;
        currentShip = null;
    }
    if (allCells.length == 17) {
        document.getElementById("start").style.display = "block";
    }
    firstCell = null;
    secondCell = null;
}
function checkCoordinates() {
    /* check direction and length */
    if (Math.abs(firstCell - secondCell) < 10) {
        if (Math.abs(firstCell - secondCell) == currShipLength - 1) {
            shipDirection = -1;
            return true;
        }
        else {
            printLog("Your selection is not " +
                "the correct <span>length</span>! Try again.");
        }
    }
    else if (Math.abs(firstCell - secondCell) >= 10 && firstCell % 10 == secondCell % 10) {
        if (Math.abs(firstCell - secondCell) / 10 == currShipLength - 1) {
            shipDirection = 1;
            return true;
        }
        else {
            printLog("Your selection is not " +
                "the correct <span>length</span>! Try again.");
        }
    }
    else {
        printLog("Your selection is not <span>horizontal</span> " +
            "or <span>vertical</span>! Try again.");
    }
    return false;
}
function printLog(text) {
    document.getElementById("message").innerHTML = text;
}
function checkOverlap() {
    /* if the selection is correct, generate coordinates and check for overlap */
    if (firstCell > secondCell) {
        if (!hasOverlap(firstCell, secondCell)) {
            generateCoordinates(firstCell, secondCell);
        }
    }
    else {
        if (!hasOverlap(secondCell, firstCell)) {
            generateCoordinates(secondCell, firstCell);
        }
    }
}
function hasOverlap(larger, smaller) {
    if (shipDirection < 0) {
        for (let i = smaller; i <= larger; i++) {
            if (allCells.includes(i)) {
                printLog("Your selection <span>overlaps</span> with another ship");
                return true;
            }
        }
    }
    else {
        for (let i = smaller; i <= larger; i += 10) {
            if (allCells.includes(i)) {
                printLog("Your selection <span>overlaps</span> with another ship");
                return true;
            }
        }
    }
    return false;
}
function generateCoordinates(larger, smaller) {
    if (shipDirection < 0) {
        for (let i = smaller; i <= larger; i++) {
            placeOnBoard(i);
        }
    }
    else {
        for (let i = smaller; i <= larger; i += 10) {
            placeOnBoard(i);
        }
    }
    function placeOnBoard(coord) {
        allCells.push(coord);
        shipSelected().coordinates.push(coord);
        document.getElementById(String(coord)).innerText = "⚓";
    }
    printLog("You have placed your <span>" + currentShip + "</span>!");
}
function playGame() {
    if (document.getElementById("c" + attackCell).innerText == "") {
        if (cpuShipCoordinates.includes(attackCell)) {
            document.getElementById("c" + attackCell).innerText = "💥";
            cpuShipCoordinates.splice(cpuShipCoordinates.indexOf(attackCell), 1);
            checkCPUShip(attackCell);
        }
        else {
            document.getElementById("c" + attackCell).innerText = "❌";
        }
        checkWinner();
        attackPlayer();
    }
}
function checkCPUShip(attackCell) {
    if (cpucarrier.coordinates.includes(attackCell)) {
        cpucarrier.coordinates.splice(cpucarrier.coordinates.indexOf(attackCell), 1);
    }
    if (cpubattleship.coordinates.includes(attackCell)) {
        cpubattleship.coordinates.splice(cpubattleship.coordinates.indexOf(attackCell), 1);
    }
    if (cpucruiser.coordinates.includes(attackCell)) {
        cpucruiser.coordinates.splice(cpucruiser.coordinates.indexOf(attackCell), 1);
    }
    if (cpusubmarine.coordinates.includes(attackCell)) {
        cpusubmarine.coordinates.splice(cpusubmarine.coordinates.indexOf(attackCell), 1);
    }
    if (cpudestroyer.coordinates.includes(attackCell)) {
        cpudestroyer.coordinates.splice(cpudestroyer.coordinates.indexOf(attackCell), 1);
    }
    if (cpucarrier.coordinates.length == 0) {
        document.getElementById("ccarrier").style.textDecoration = "line-through white 0.2em";
    }
    if (cpubattleship.coordinates.length == 0) {
        document.getElementById("cbattleship").style.textDecoration = "line-through white 0.2em";
    }
    if (cpucruiser.coordinates.length == 0) {
        document.getElementById("ccruiser").style.textDecoration = "line-through white 0.2em";
    }
    if (cpusubmarine.coordinates.length == 0) {
        document.getElementById("csubmarine").style.textDecoration = "line-through white 0.2em";
    }
    if (cpudestroyer.coordinates.length == 0) {
        document.getElementById("cdestroyer").style.textDecoration = "line-through white 0.2em";
    }
}
function attackPlayer() {
    let newAttack = attackedCellsByCpu.splice(Math.floor(Math.random() * attackedCellsByCpu.length), 1)[0];
    if (allCells.includes(newAttack)) {
        document.getElementById(String(newAttack)).innerText = "💥";
        allCells.splice(allCells.indexOf(newAttack), 1);
        checkPlayerShip(newAttack);
    }
    else {
        document.getElementById(String(newAttack)).innerText = "❌";
    }
    checkWinner();
}
function checkPlayerShip(attackCell) {
    if (carrier.coordinates.includes(attackCell)) {
        carrier.coordinates.splice(carrier.coordinates.indexOf(attackCell), 1);
    }
    if (battleship.coordinates.includes(attackCell)) {
        battleship.coordinates.splice(battleship.coordinates.indexOf(attackCell), 1);
    }
    if (cruiser.coordinates.includes(attackCell)) {
        cruiser.coordinates.splice(cruiser.coordinates.indexOf(attackCell), 1);
    }
    if (submarine.coordinates.includes(attackCell)) {
        submarine.coordinates.splice(submarine.coordinates.indexOf(attackCell), 1);
    }
    if (destroyer.coordinates.includes(attackCell)) {
        destroyer.coordinates.splice(destroyer.coordinates.indexOf(attackCell), 1);
    }
    if (carrier.coordinates.length == 0) {
        document.getElementById("pcarrier").style.textDecoration = "line-through white 0.2em";
    }
    if (battleship.coordinates.length == 0) {
        document.getElementById("pbattleship").style.textDecoration = "line-through white 0.2em";
    }
    if (cruiser.coordinates.length == 0) {
        document.getElementById("pcruiser").style.textDecoration = "line-through white 0.2em";
    }
    if (submarine.coordinates.length == 0) {
        document.getElementById("psubmarine").style.textDecoration = "line-through white 0.2em";
    }
    if (destroyer.coordinates.length == 0) {
        document.getElementById("pdestroyer").style.textDecoration = "line-through white 0.2em";
    }
}
function checkWinner() {
    if (cpuShipCoordinates.length == 0) {
        printLog("Player WINS! Refresh the page to play again.");
        gameOver = true;
    }
    if (allCells.length == 0) {
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
