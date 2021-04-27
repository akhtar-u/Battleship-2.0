"use strict";
var cpu;
(function (cpu) {
    let shipDirection;
    let attackCell;
    let firstCell = null;
    let secondCell = null;
    let currShipLength = null;
    let currentShipID;
    let currentShip = null;
    let cpuShipsPlaced = false;
    let gameOver = false;
    let attackedCellsByCpu;
    let cpuShipCells;
    let allShipCells = [];
    let allcpuShipCells = [];
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
    document.getElementById("start").addEventListener("click", () => {
        attackedCellsByCpu = [];
        for (let i = 0; i <= 99; i++) {
            attackedCellsByCpu.push(i);
        }
        cpuShipCells = [];
        for (let i = 0; i <= 99; i++) {
            cpuShipCells.push(i);
        }
        cpucarrier.coordinates = generateCPUShips(5);
        cpubattleship.coordinates = generateCPUShips(4);
        cpucruiser.coordinates = generateCPUShips(3);
        cpusubmarine.coordinates = generateCPUShips(3);
        cpudestroyer.coordinates = generateCPUShips(2);
        addToAllCPUCells(cpucarrier.coordinates);
        addToAllCPUCells(cpubattleship.coordinates);
        addToAllCPUCells(cpucruiser.coordinates);
        addToAllCPUCells(cpusubmarine.coordinates);
        addToAllCPUCells(cpudestroyer.coordinates);
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
        if (allShipCells.length == 17) {
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
                if (allShipCells.includes(i)) {
                    printLog("Your selection <span>overlaps</span> with another ship");
                    return true;
                }
            }
        }
        else {
            for (let i = smaller; i <= larger; i += 10) {
                if (allShipCells.includes(i)) {
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
            allShipCells.push(coord);
            shipSelected().coordinates.push(coord);
            document.getElementById(String(coord)).innerText = "⚓";
        }
        printLog("You have placed your <span>" + currentShip + "</span>!");
    }
    function playGame() {
        if (document.getElementById("c" + attackCell).innerText == "") {
            if (allcpuShipCells.includes(attackCell)) {
                document.getElementById("c" + attackCell).innerText = "💥";
                allcpuShipCells.splice(allcpuShipCells.indexOf(attackCell), 1);
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
        if (allShipCells.includes(newAttack)) {
            document.getElementById(String(newAttack)).innerText = "💥";
            allShipCells.splice(allShipCells.indexOf(newAttack), 1);
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
        if (allcpuShipCells.length == 0) {
            printLog("Player WINS! Refresh the page to play again.");
            gameOver = true;
        }
        if (allShipCells.length == 0) {
            printLog("CPU WINS! Refresh the page to play again.");
            gameOver = true;
        }
    }
    /* randomly place ships on the board */
    function generateCPUShips(shipLength) {
        let shipPlaced = false;
        let shipCoords = [];
        let directionX;
        while (!shipPlaced) {
            do {
                let randomCell = Math.floor(Math.random() * cpuShipCells.length);
                directionX = Math.random() >= 0.5;
                if (directionX) {
                    let rowCheck = randomCell % 10;
                    if (rowCheck + (shipLength - 1) <= 9) {
                        let overlap = false;
                        for (let i = 0; i < shipLength; i++) {
                            if (!cpuShipCells.includes(randomCell + i)) {
                                overlap = true;
                            }
                        }
                        if (!overlap) {
                            for (let i = 0; i < shipLength; i++) {
                                shipCoords.push(randomCell + i);
                                let index = cpuShipCells.indexOf(randomCell + i);
                                if (index != -1) {
                                    cpuShipCells.splice(index, 1);
                                }
                                shipPlaced = true;
                            }
                        }
                        else {
                        }
                    }
                    else {
                        break;
                    }
                }
                else {
                    if (randomCell + shipLength * 10 <= 99) {
                        let overlap = false;
                        for (let i = 0; i < shipLength * 10; i += 10) {
                            if (!cpuShipCells.includes(randomCell + i)) {
                                overlap = true;
                            }
                        }
                        if (!overlap) {
                            for (let i = 0; i < shipLength * 10; i += 10) {
                                shipCoords.push(randomCell + i);
                                let index = cpuShipCells.indexOf(randomCell + i);
                                if (index != -1) {
                                    cpuShipCells.splice(index, 1);
                                }
                                shipPlaced = true;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            } while (!shipPlaced);
        }
        return shipCoords;
    }
    function addToAllCPUCells(array) {
        for (let i = 0; i < array.length; i++) {
            allcpuShipCells.push(array[i]);
        }
    }
})(cpu || (cpu = {}));
