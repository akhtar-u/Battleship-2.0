package com.battleship.multiplayer.WebSockets.service;

import com.battleship.multiplayer.WebSockets.exceptions.InvalidGameException;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidParameterException;
import com.battleship.multiplayer.WebSockets.exceptions.NotFoundException;
import com.battleship.multiplayer.WebSockets.model.Game;
import com.battleship.multiplayer.WebSockets.model.GamePlay;
import com.battleship.multiplayer.WebSockets.model.GameStatus;
import com.battleship.multiplayer.WebSockets.model.Player;
import com.battleship.multiplayer.WebSockets.storage.GameStorage;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class GameService {

    public Game createGame(Player player){
        Game game = new Game();
        game.setGameID(UUID.randomUUID().toString());
        game.setPlayer1(player);
        game.setStatus(GameStatus.NEW);
        GameStorage.getInstance().setGames(game);
        return game;
    }

    public Game connectToGame(Player player2, String gameID) throws InvalidParameterException, InvalidGameException {
        if(!GameStorage.getInstance().getGames().containsKey(gameID)){
            throw new InvalidParameterException("No games found with given Game ID");
        }

        Game game = GameStorage.getInstance().getGames().get(gameID);
        if(game.getPlayer2() != null){
            throw new InvalidGameException("Game is full");
        }

        game.setPlayer2(player2);
        game.setStatus(GameStatus.IN_PROGRESS);
        GameStorage.getInstance().setGames(game);
        return game;
    }

    public Game connectToRandomGame(Player player2) throws NotFoundException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                .filter(it->it.getStatus().equals(GameStatus.NEW))
                .findFirst()
                .orElseThrow(()-> new NotFoundException("Game not found"));

        game.setPlayer2(player2);
        game.setStatus(GameStatus.IN_PROGRESS);
        GameStorage.getInstance().setGames(game);
        return game;
    }

    public Game gamePlay(GamePlay gamePlay) throws NotFoundException, InvalidGameException {
        if(!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameID())){
            throw new NotFoundException("Game not found");
        }

        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameID());
        if(game.getStatus().equals(GameStatus.FINISHED)){
            throw new InvalidGameException("Game is already finished");
        }

        GameStorage.getInstance().setGames(game);
        return game;
    }

}