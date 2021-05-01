package com.battleship.multiplayer.WebSockets.model;

import lombok.Data;

@Data
public class GamePlayResponse {

    private String gameID;
    private boolean shipHit;
    private String attackCell;
    private String attackingPlayer;
}
