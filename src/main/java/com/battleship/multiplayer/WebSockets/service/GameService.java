package com.battleship.multiplayer.WebSockets.service;

import com.battleship.multiplayer.WebSockets.Controller.ConnectRequest;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidGameException;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidParameterException;
import com.battleship.multiplayer.WebSockets.exceptions.NotFoundException;
import com.battleship.multiplayer.WebSockets.model.Game;
import com.battleship.multiplayer.WebSockets.model.GamePlay;
import com.battleship.multiplayer.WebSockets.model.GameStatus;
import com.battleship.multiplayer.WebSockets.model.Player;
import com.battleship.multiplayer.WebSockets.model.GameRepository;
import com.battleship.multiplayer.WebSockets.storage.GameStorage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class GameService {

    @Autowired
    private final GameRepository gameRepository;

    public Game createGame(ConnectRequest request){
        Game game = new Game();
        game.setGameID(UUID.randomUUID().toString());
        game.setPlayer1(request.getPlayer().getName());
        game.setPlayerOneShips(request.getShipArray());

        game.setStatus(GameStatus.NEW);
        gameRepository.save(game);
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

        game.setPlayer2(player2.getName());
        game.setStatus(GameStatus.IN_PROGRESS);
        GameStorage.getInstance().setGames(game);
        return game;
    }

    public Game connectToRandomGame(ConnectRequest request) throws NotFoundException {
        System.out.println(gameRepository.findById(request.getGameID()));

        Game game = GameStorage.getInstance().getGames().values().stream()
                .filter(it->it.getStatus().equals(GameStatus.NEW))
                .findFirst()
                .orElseThrow(()-> new NotFoundException("Game not found"));

        game.setPlayer2(request.getPlayer().getName());
        game.setPlayerTwoShips(request.getShipArray());
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
