package com.battleship.multiplayer.WebSockets.service;

<<<<<<< HEAD
import com.battleship.multiplayer.WebSockets.controller.ConnectRequest;
=======
import com.battleship.multiplayer.WebSockets.Controller.ConnectRequest;
>>>>>>> b22a6398f7f210f3d18c410295e320556f9c5e01
import com.battleship.multiplayer.WebSockets.exceptions.InvalidGameException;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidParameterException;
import com.battleship.multiplayer.WebSockets.exceptions.NotFoundException;
import com.battleship.multiplayer.WebSockets.model.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
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
        game.setPlayer1(request.getPlayer() + "1");
        game.setPlayerOneShips(request.getShipArray());
        game.setStatus(GameStatus.NEW);
        gameRepository.save(game);

        GameResponse response = new GameResponse();
        response.setGameID(game.getGameID());
        response.setPlayer1(game.getPlayer1().substring(0, game.getPlayer1().length() - 1));

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

        game.setPlayer2(request.getPlayer() + "2");
        game.setPlayerTwoShips(request.getShipArray());
        game.setStatus(GameStatus.IN_PROGRESS);
        gameRepository.save(game);

        GameResponse response = new GameResponse();
        response.setGameID(game.getGameID());
        response.setPlayer1(game.getPlayer1().substring(0, game.getPlayer1().length() - 1));
        response.setPlayer2(game.getPlayer2().substring(0, game.getPlayer2().length() - 1));

        return response;
    }

    public GameResponse connectToRandomGame(ConnectRequest request) throws NotFoundException {
        if (gameRepository.findFirstByStatusIs(GameStatus.NEW) == null) {
            throw new NotFoundException("Game not found");
        }
        Game game = gameRepository.findFirstByStatusIs(GameStatus.NEW).get(0);
        game.setPlayer2(request.getPlayer() + "2");
        game.setPlayerTwoShips(request.getShipArray());
        game.setStatus(GameStatus.IN_PROGRESS);
        gameRepository.save(game);

        GameResponse response = new GameResponse();
        response.setGameID(game.getGameID());
        response.setPlayer1(game.getPlayer1().substring(0, game.getPlayer1().length() - 1));
        response.setPlayer2(game.getPlayer2().substring(0, game.getPlayer2().length() - 1));

        return response;
    }

    public GamePlayResponse gamePlay(GamePlay gamePlay) throws NotFoundException, InvalidGameException {
        if (gameRepository.findByGameIDIs(gamePlay.getGameID()).get(0) == null) {
            throw new NotFoundException("Game not found");
        }

        Game game = gameRepository.findByGameIDIs(gamePlay.getGameID()).get(0);
        if (game.getStatus().equals(GameStatus.FINISHED)) {
            throw new InvalidGameException("Game is already finished");
        }

        GamePlayResponse response = new GamePlayResponse();
        response.setGameID(game.getGameID());

        if (game.getPlayer1().equals(gamePlay.getPlayer() + "1")) {
            response.setAttackingPlayer("one");
            List<Integer> playerShipCells = gameRepository.findAllPlayerTwoShips(game.getGameID());
            response.setShipHit(playerShipCells.contains(Integer.parseInt(gamePlay.getCellAttacked())));
        }
        else {
            response.setAttackingPlayer("two");
            List<Integer> playerShipCells = gameRepository.findAllPlayerOneShips(game.getGameID());
            response.setShipHit(playerShipCells.contains(Integer.parseInt(gamePlay.getCellAttacked())));
        }

        response.setAttackCell(gamePlay.getCellAttacked());
        return response;
    }

    public void deleteFinishedGame(String gameID) throws InvalidGameException {
        if (gameRepository.findByGameIDIs(gameID).get(0) == null) {
            throw new InvalidGameException("Game could not be found!");
        }
        Game game = gameRepository.findByGameIDIs(gameID).get(0);
        gameRepository.delete(game);
    }
}
