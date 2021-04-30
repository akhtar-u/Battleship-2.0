package com.battleship.multiplayer.WebSockets.Controller;

import lombok.Data;
import com.battleship.multiplayer.WebSockets.model.Player;

import java.util.List;

@Data
public class ConnectRequest {
    private Player player;
    private String gameID;
    private String type;
    private List<Integer> shipArray;
}
