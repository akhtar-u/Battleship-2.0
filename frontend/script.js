"use strict";
let currentShip = null;
let firstCell = null;
let secondCell = null;
let currShipLength = null;
let currentShipID;
let shipDirection;
let cpuShipsPlaced = false;
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
let carrier = new Ship("Carrier", 5, "pcarrier");
let battleship = new Ship("Battleship", 4, "pbattleship");
let cruiser = new Ship("Cruiser", 3, "pcruiser");
let submarine = new Ship("Submarine", 3, "psubmarine");
let destroyer = new Ship("Destroyer", 2, "pdestroyer");
/* add event listeners to player buttons and gameboard */
const pbtnwrapper = document.getElementById("pships");
const pboardwrapper = document.getElementById("pboard").getElementsByTagName("td");
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
/* add class to all board div */
for (let i = 0; i <= 99; i++) {
    let div = document.getElementById(String(i));
    div.classList.add("d-flex");
    div.classList.add("justify-content-center");
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
        generateCPUShips();
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
        document.getElementById(String(coord)).innerText = "⚓";
        document.getElementById(String(coord)).style.color = "#ffd5d5";
    }
    printLog("You have placed your <span>" + currentShip + "</span>!");
}
function generateCPUShips() {
}
