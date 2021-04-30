package com.battleship.multiplayer.WebSockets.Controller;

import lombok.Data;
import com.battleship.multiplayer.WebSockets.model.Player;

@Data
public class ConnectRequest {
    private Player player;
    private String gameID;
    private String type;
    private int[] shipArray;
}
