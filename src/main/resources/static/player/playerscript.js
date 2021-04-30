let shipDirection;
let attackCell;
let firstCell = null;
let secondCell = null;
let currShipLength = null;
let currentShipID;
let currentShip = null;
let gameStarted = false;
let gameOver = false;
let allShipCells = [];
let cellsAttacked = [];

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
        if (gameStarted && !gameOver) {
            let tempID = event.target.getElementsByTagName("div")[0].id;
            tempID = tempID.slice(1);
            attackCell = parseInt(tempID);
            if (playerTurn) {
                playGame();
            }
        }
    });
}

for (let i = 0; i <= 99; i++) {
    let div = document.getElementById(String(i));
    let oppdiv = document.getElementById("o" + String(i));
    div.classList.add("d-flex");
    oppdiv.classList.add("d-flex");
    div.classList.add("justify-content-center");
    oppdiv.classList.add("justify-content-center");
}

/* logging */
function printLog(text) {
    document.getElementById("message").innerHTML = text;
}

/* ship placement */
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

        document.getElementById(currentShipID).disabled = true;
        currentShipID = "";
        currShipLength = null;
        currentShip = null;
    }
    firstCell = null;
    secondCell = null;
}

function checkCoordinates() {
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

/* gameplay */
function playGame() {
    if (cellsAttacked.includes(attackCell)) {
        printLog("You have already attacked here!");
    } else {
        let data = JSON.stringify({
            cellAttacked: attackCell,
            type: "ATTACK"
        })
        sendMessage(data);
        cellsAttacked.push(attackCell);

        if (gameOver) {
            showHomeButton();
        }
    }
}

function playerAttacked(newAttack) {
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

/* game over */
function showHomeButton() {
    let homeButton = document.getElementById("start");
    homeButton.disabled = false;
    homeButton.innerText = "Home";
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
let playerTurn;

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
// const url = "https://shipsahoy.herokuapp.com";
let stompClient;
let connectionType;

const connectSocket = () => {
    const socket = new SockJS(url + "/gameplay");
    stompClient = Stomp.over(socket);
    stompClient.connect({gameID: newGameID}, onConnected, onError)
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
        if (playerTurn) {
            oppBoardName.innerText = message.name;
            printLog("<span>" + message.name + "</span> has joined your game! " +
                "You go first, attack your opponent!");
            gameStarted = true;
        } else {
            printLog("Game found! You are playing against: <span>" + oppNameInput + "</span>. " +
                "You will go second, wait for your opponent to attack.");
            gameStarted = true;
        }
    } else if (message.type === "ERROR") {
        alert("Your opponent has disconnected! Please create a new game.");
        printLog("Your opponent has disconnected! Please create a new game.");
        gameStarted = false;
    } else if (message.type === "ATTACK") {
        if (!playerTurn) {
            playerAttacked(message.cellAttacked);
            printLog("Opponent attacked at: <span>" + message.cellAttacked + "</span>.");
        }
    }
}

function sendMessage(data) {
    stompClient.send("/topic/game-progress" + newGameID, {}, data);
}

function createNewGame() {
    if (playerShipsPlaced()) {
        axios.post(url + "/game/start", {
            player: {
                name: playerNameInput.value
            },
            shipArray: allShipCells
        })
            .then((response) => {
                newGameID = response.data.gameID;
                connectionType = "NEWGAME";
                connectSocket();

                printLog("New game created with game ID: <span>" + newGameID + "</span>");
                playerBoardName.innerText = playerNameInput.value;
                playerTurn = true;
                disableConnectButtons();
            }, (error) => {
                console.log(error);
            });
    }
}

function connectToRandomGame() {
    if (playerShipsPlaced()) {
        axios.post(url + "/game/connect/random", {
            player: {
                name: playerNameInput.value
            },
            shipArray: allShipCells
        })
            .then((response) => {
                newGameID = response.data.gameID;
                connectionType = "JOIN";
                connectSocket();

                playerBoardName.innerText = playerNameInput.value;
                playerTurn = false;
                console.log(response.data);
                oppNameInput = response.data.player1;
                oppBoardName.innerText = oppNameInput;
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
            gameID: gameIDInput.value,
            shipArray: allShipCells
        })
            .then((response) => {
                newGameID = response.data.gameID;
                connectionType = "JOIN";
                connectSocket();

                playerBoardName.innerText = playerNameInput.value;
                playerTurn = false;
                oppNameInput = response.data.player1.name;
                oppBoardName.innerText = oppNameInput;
                disableConnectButtons();
            }, (error) => {
                console.log(error);
                printLog("No game found! Try creating a new game instead.");
            });
    }
}