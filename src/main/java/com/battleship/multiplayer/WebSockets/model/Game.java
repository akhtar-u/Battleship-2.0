package com.battleship.multiplayer.WebSockets.model;

import lombok.Data;

@Data
public class Game {

    private String gameID;
    private Player player1;
    private Player player2;
    private GameStatus status;
    private int[] playerOneShips;
    private int[] playerTwoShips;
}
