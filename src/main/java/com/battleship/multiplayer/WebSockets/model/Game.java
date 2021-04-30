package com.battleship.multiplayer.WebSockets.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Game {

    @Id
    @GeneratedValue
    private UUID gameID;

    private String player1;
    private String player2;
    private GameStatus status;
    @ElementCollection
    private List<Integer> playerOneShips;
    @ElementCollection
    private List<Integer>  playerTwoShips;
}
