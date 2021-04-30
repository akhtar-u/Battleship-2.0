package com.battleship.multiplayer.WebSockets.storage;

import com.battleship.multiplayer.WebSockets.model.Game;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class GameStorage {

    public static Map<UUID, Game> games;
    private static GameStorage instance;

    private GameStorage() {
        games = new HashMap<>();
    }

    public static synchronized GameStorage getInstance() {
        if (instance == null) {
            instance = new GameStorage();
        }
        return instance;
    }

    public Map<UUID, Game> getGames(){
        return games;
    }
    public void setGames(Game game){
        games.put(game.getGameID(), game);
    }
}
