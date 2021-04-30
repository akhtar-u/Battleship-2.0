package com.battleship.multiplayer.WebSockets.service;

import com.battleship.multiplayer.WebSockets.Controller.ConnectRequest;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidGameException;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidParameterException;
import com.battleship.multiplayer.WebSockets.exceptions.NotFoundException;
import com.battleship.multiplayer.WebSockets.model.*;
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

    public GameResponse createGame(ConnectRequest request) {
        Game game = new Game();
        game.setGameID(UUID.randomUUID().toString());
        game.setPlayer1(request.getPlayer());
        game.setPlayerOneShips(request.getShipArray());
        game.setStatus(GameStatus.NEW);
        gameRepository.save(game);

        GameResponse response = new GameResponse();
        response.setGameID(game.getGameID());
        response.setPlayer1(game.getPlayer1());

        return response;
    }

    public GameResponse connectToGame(ConnectRequest request) throws InvalidParameterException, InvalidGameException {
        if (gameRepository.findByGameIDIs(request.getGameID()).get(0) == null) {
            throw new InvalidParameterException("No games found with given Game ID");
        }

        Game game = gameRepository.findByGameIDIs(request.getGameID()).get(0);
        if (game.getPlayer2() != null) {
            throw new InvalidGameException("Game is full");
        }

        game.setPlayer2(request.getPlayer());
        game.setPlayerTwoShips(request.getShipArray());
        game.setStatus(GameStatus.IN_PROGRESS);
        gameRepository.save(game);

        GameResponse response = new GameResponse();
        response.setGameID(game.getGameID());
        response.setPlayer1(game.getPlayer1());
        response.setPlayer2(game.getPlayer2());

        return response;
    }

    public GameResponse connectToRandomGame(ConnectRequest request) throws NotFoundException {
        if (gameRepository.findByStatusIs(GameStatus.NEW).get(0) == null) {
            throw new NotFoundException("Game not found");
        }
        Game game = gameRepository.findByStatusIs(GameStatus.NEW).get(0);
        game.setPlayer2(request.getPlayer());
        game.setPlayerTwoShips(request.getShipArray());
        game.setStatus(GameStatus.IN_PROGRESS);
        gameRepository.save(game);

        GameResponse response = new GameResponse();
        response.setGameID(game.getGameID());
        response.setPlayer1(game.getPlayer1());
        response.setPlayer2(game.getPlayer2());

        return response;
    }

    public Game gamePlay(GamePlay gamePlay) throws NotFoundException, InvalidGameException {
//        if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameID())) {
//            throw new NotFoundException("Game not found");
//        }
//
//        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameID());
//        if (game.getStatus().equals(GameStatus.FINISHED)) {
//            throw new InvalidGameException("Game is already finished");
//        }
//
//        GameStorage.getInstance().setGames(game);

        Game game = new Game();

        return game;
    }
}
