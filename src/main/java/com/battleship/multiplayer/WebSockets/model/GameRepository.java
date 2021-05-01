package com.battleship.multiplayer.WebSockets.model;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface GameRepository extends CrudRepository<Game, String> {
    List<Game> findFirstByStatusIs(GameStatus status);
    List<Game> findByGameIDIs(String gameID);
    List<Game> findByGameIDAndPlayer1(String gameID, String playerName);

    @Query(value = "SELECT player_two_ships from game_player_two_ships where game_gameid = :#{(#gameID)}", nativeQuery = true)
    List<Integer> findAllPlayerTwoShips(@Param ("gameID") String gameID);
    @Query(value = "SELECT player_one_ships from game_player_one_ships where game_gameid = :#{(#gameID)}", nativeQuery = true)
    List<Integer> findAllPlayerOneShips(@Param ("gameID") String gameID);
}
