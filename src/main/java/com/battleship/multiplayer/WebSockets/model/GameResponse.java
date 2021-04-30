package com.battleship.multiplayer.WebSockets.model;

import lombok.Data;

@Data
public class GameResponse {

    private String gameID;
    private String player1;
    private String player2;
}
