package com.battleship.multiplayer.WebSockets.model;

import org.springframework.data.repository.CrudRepository;


public interface GameRepository extends CrudRepository<Game, String> {
}
