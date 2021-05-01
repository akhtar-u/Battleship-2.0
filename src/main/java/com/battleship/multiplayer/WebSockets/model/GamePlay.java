package com.battleship.multiplayer.WebSockets.model;

import lombok.Data;

@Data
public class GamePlay {

    private String gameID;
    private String player;
    private String cellAttacked;
}
