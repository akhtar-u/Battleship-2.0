package com.battleship.multiplayer.WebSockets.storage;

import com.battleship.multiplayer.WebSockets.model.Game;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface GameRepository extends CrudRepository<Game, UUID> {
}
