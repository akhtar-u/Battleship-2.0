package com.battleship.multiplayer.WebSockets.model;

import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface GameRepository extends CrudRepository<Game, String> {
    List<Game> findByStatusIs(GameStatus status);

}
