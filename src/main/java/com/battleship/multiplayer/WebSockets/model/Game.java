package com.battleship.multiplayer.WebSockets.model;

import lombok.Data;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;

@Data
@Entity
public class Game {

    @Id
    private String gameID;

    private String player1;
    private String player2;
    private GameStatus status;
    @ElementCollection
    private List<Integer> playerOneShips;
    @ElementCollection
    private List<Integer> playerTwoShips;
}
