package com.battleship.multiplayer.WebSockets.Controller;

import lombok.Data;

import java.util.List;

@Data
public class ConnectRequest {
    private String player;
    private String gameID;
    private String type;
    private List<Integer> shipArray;
}
