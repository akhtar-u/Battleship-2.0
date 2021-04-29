let shipDirection;
let attackCell;
let firstCell = null;
let secondCell = null;
let currShipLength = null;
let currentShipID;
let currentShip = null;
let gameStarted = false;
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

let carrier = new Ship("Carrier", 5, "pcarrier");
let battleship = new Ship("Battleship", 4, "pbattleship");
let cruiser = new Ship("Cruiser", 3, "pcruiser");
let submarine = new Ship("Submarine", 3, "psubmarine");
let destroyer = new Ship("Destroyer", 2, "pdestroyer");

/* add event listeners to player buttons and gameboard */
const pbtnwrapper = document.getElementById("pships");
const pboardwrapper = document.getElementById("pboard").getElementsByTagName("td");
const oppboardwrapper = document.getElementById("oboard").getElementsByTagName("td");
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
            } else {
                firstCell = parseInt(event.target.getElementsByTagName("div")[0].id);
                printLog("You have selected <span>" + firstCell + "</span> " +
                    "as your starting position.");
            }
        }
    });
}
for (let i = 0; i < oppboardwrapper.length; i++) {
    oppboardwrapper[i].addEventListener("click", event => {
        const isCell = event.target instanceof HTMLTableCellElement;
        if (!isCell) {
            return;
        }
        if (gameStarted) {
            let tempID = event.target.getElementsByTagName("div")[0].id;
            tempID = tempID.slice(1);
            attackCell = parseInt(tempID);
            sendMessage();
            if (!gameOver) {
                playGame();
            }
        }
    });
}
// document.getElementById("start").addEventListener("click", () => {
//     attackedCellsByCpu = [];
//     for (let i = 0; i <= 99; i++) {
//         attackedCellsByCpu.push(i);
//     }
//     cpuShipCells = [];
//     for (let i = 0; i <= 99; i++) {
//         cpuShipCells.push(i);
//     }
//
//     cpuShipsPlaced = true;
//     document.getElementById("start").disabled = true;
//     printLog("CPU ships have been set. Destroy it's ships by clicking on the CPU board!");
// });


for (let i = 0; i <= 99; i++) {
    let div = document.getElementById(String(i));
    let oppdiv = document.getElementById("o" + String(i));
    div.classList.add("d-flex");
    oppdiv.classList.add("d-flex");
    div.classList.add("justify-content-center");
    oppdiv.classList.add("justify-content-center");
}

function printLog(text) {
    document.getElementById("message").innerHTML = text;
}

function shipSelected() {
    if (currentShip === carrier.name) {
        return carrier;
    }
    if (currentShip === battleship.name) {
        return battleship;
    }
    if (currentShip === cruiser.name) {
        return cruiser;
    }
    if (currentShip === submarine.name) {
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
    if (allShipCells.length === 17) {

    }
    firstCell = null;
    secondCell = null;
}

function checkCoordinates() {
    /* check direction and length */
    if (Math.abs(firstCell - secondCell) < 10) {
        if (Math.abs(firstCell - secondCell) === currShipLength - 1) {
            shipDirection = -1;
            return true;
        } else {
            printLog("Your selection is not " +
                "the correct <span>length</span>! Try again.");
        }
    } else if (Math.abs(firstCell - secondCell) >= 10 && firstCell % 10 === secondCell % 10) {
        if (Math.abs(firstCell - secondCell) / 10 === currShipLength - 1) {
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

function checkOverlap() {

    if (firstCell > secondCell) {
        if (!hasOverlap(firstCell, secondCell)) {
            generateCoordinates(firstCell, secondCell);
        }
    } else {
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
    } else {
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
    } else {
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
    if (document.getElementById("o" + attackCell).innerText === "") {
        if (allcpuShipCells.includes(attackCell)) {
            document.getElementById("o" + attackCell).innerText = "💥";
            allcpuShipCells.splice(allcpuShipCells.indexOf(attackCell), 1);
            checkCPUShip(attackCell);
        } else {
            document.getElementById("o" + attackCell).innerText = "❌";
        }
        attackPlayer();
    }
}

function attackPlayer() {
    let newAttack = attackedCellsByCpu.splice(Math.floor(Math.random() * attackedCellsByCpu.length), 1)[0];
    if (allShipCells.includes(newAttack)) {
        document.getElementById(String(newAttack)).innerText = "💥";
        allShipCells.splice(allShipCells.indexOf(newAttack), 1);
        checkPlayerShip(newAttack);
    } else {
        document.getElementById(String(newAttack)).innerText = "❌";
    }
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
    if (carrier.coordinates.length === 0) {
        document.getElementById("pcarrier").style.textDecoration = "line-through white 0.2em";
    }
    if (battleship.coordinates.length === 0) {
        document.getElementById("pbattleship").style.textDecoration = "line-through white 0.2em";
    }
    if (cruiser.coordinates.length === 0) {
        document.getElementById("pcruiser").style.textDecoration = "line-through white 0.2em";
    }
    if (submarine.coordinates.length === 0) {
        document.getElementById("psubmarine").style.textDecoration = "line-through white 0.2em";
    }
    if (destroyer.coordinates.length === 0) {
        document.getElementById("pdestroyer").style.textDecoration = "line-through white 0.2em";
    }
}

/* multiplayer functions */
let playerBoardName = document.getElementById("playerboardname");
let oppBoardName = document.getElementById("opponentboardname");
let playerNameInput = document.getElementById("playername");
let gameIDInput = document.getElementById("gameID");
let newGameBtn = document.getElementById("newgamebtn");
let randomGameBtn = document.getElementById("randomgamebtn");
let gameIDBtn = document.getElementById("gameIDbtn");

let newGameID;
let oppNameInput;
let playerType;

document.getElementById("newgamebtn").addEventListener("click", ev => {
    if (playerNameInput.value !== "") {
        createNewGame();
    } else {
        printLog("No name entered. Cannot create a new game without a player name!");
    }
})

document.getElementById("randomgamebtn").addEventListener("click", ev => {
    if (playerNameInput.value !== "") {
        connectToRandomGame()
    } else {
        printLog("No name entered. Cannot connect to random game without a player name!");
    }
})

document.getElementById("gameIDbtn").addEventListener("click", ev => {
    if (playerNameInput.value !== "" && gameIDInput.value !== "") {
        connectBygameID();
    } else {
        printLog("No name or game ID entered. Cannot connect to game without a player name or game ID!");
    }
})

function playerShipsPlaced() {
    if (allShipCells.length !== 17) {
        printLog("Please place your ships before starting or connecting to a game!");
        return false;
    }
    return true;
}

function disableConnectButtons() {
    newGameBtn.disabled = true;
    randomGameBtn.disabled = true;
    gameIDBtn.disabled = true;
    gameIDInput.disabled = true;
    playerNameInput.disabled = true;
}

/* websocket functions */
const url = "http://localhost:8080";
let stompClient;
let connectionType;

const connectSocket = () => {
    const socket = new SockJS(url + "/gameplay");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError)
}

const onError = (error) => {
}

const onConnected = () => {
    stompClient.subscribe("/topic/game-progress" + newGameID, onMessageReceived);
    stompClient.send("/topic/game-progress" + newGameID, {}, JSON.stringify({
        name: playerNameInput.value,
        type: connectionType
    }));
}

const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === "NEWGAME") {

    } else if (message.type === "JOIN") {
        if (playerType === "1") {
            oppBoardName.innerText = message.name;
            printLog("<span>" + message.name + "</span> has joined your game!");
            gameStarted = true;
        }

    } else if (message.type === "ERROR") {
        printLog("<span>" + message.name + "</span> has left your game! Please create a new game.");
    }
}

function sendMessage() {
    stompClient.send("/topic/game-progress" + newGameID, {}, JSON.stringify({
        name: playerNameInput.value,
        type: connectionType
    }));
}

function createNewGame() {
    if (playerShipsPlaced()) {
        axios.post(url + "/game/start", {
            name: playerNameInput.value
        })
            .then((response) => {
                newGameID = response.data.gameID;
                connectionType = "NEWGAME";
                connectSocket();

                printLog("New game created with game ID: <span>" + newGameID + "</span>");
                playerBoardName.innerText = playerNameInput.value;
                playerType = "1";
                disableConnectButtons();
            }, (error) => {
                console.log(error);
            });
    }
}

function connectToRandomGame() {
    if (playerShipsPlaced()) {
        axios.post(url + "/game/connect/random", {
            name: playerNameInput.value
        })
            .then((response) => {
                newGameID = response.data.gameID;
                connectionType = "JOIN";
                connectSocket();

                playerBoardName.innerText = playerNameInput.value;
                playerType = "2";
                oppNameInput = response.data.player1.name;
                printLog("Game found! You are playing against: <span>" + oppNameInput + "</span>");
                oppBoardName.innerText = oppNameInput;
                gameStarted = true;
                disableConnectButtons();
            }, (error) => {
                console.log(error);
                printLog("No game found! Try creating a new game instead.");
            });
    }
}

function connectBygameID() {
    if (playerShipsPlaced()) {

        axios.post(url + "/game/connect", {
            player: {
                name: playerNameInput.value
            },
            gameID: gameIDInput.value
        })
            .then((response) => {
                newGameID = response.data.gameID;
                connectionType = "JOIN";
                connectSocket();

                playerBoardName.innerText = playerNameInput.value;
                playerType = "2";
                oppNameInput = response.data.player1.name;
                printLog("Connection established! You are playing against: <span>" + oppNameInput + "</span>");
                oppBoardName.innerText = oppNameInput;
                gameStarted = true;
                disableConnectButtons();
            }, (error) => {
                console.log(error);
                printLog("No game found! Try creating a new game instead.");
            });
    }
}