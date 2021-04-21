"use strict";
let currentShip = null;
let firstCell = null;
let secondCell = null;
let currShipLength = null;
let shipDirection;
let currentShipID;
let overlapFlag = false;
let carrierCells = [];
let battleshipCells = [];
let cruiserCells = [];
let submarineCells = [];
let destroyerCells = [];
let allCells = [];
/* add event listeners to player buttons and gameboard */
const pbtnwrapper = document.getElementById("pships");
const pboardwrapper = document.getElementById("pboard").getElementsByTagName("td");
pbtnwrapper.addEventListener("click", event => {
    const isButton = event.target instanceof HTMLButtonElement;
    if (!isButton) {
        return;
    }
    currentShip = event.target.textContent;
    currentShipID = event.target.id;
    shipSelected();
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
                document.getElementById(String(firstCell)).innerText;
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
        document.getElementById(currentShipID).disabled = true;
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
        document.getElementById(String(coord)).innerText = "#";
        document.getElementById(String(coord)).style.color = "#ffd5d5";
    }
    printLog("You have placed your <span>" + currentShip + "</span>!");
}
