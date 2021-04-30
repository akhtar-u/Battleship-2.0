package com.battleship.multiplayer.WebSockets.Controller;

import com.battleship.multiplayer.WebSockets.exceptions.InvalidGameException;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidParameterException;
import com.battleship.multiplayer.WebSockets.exceptions.NotFoundException;
import com.battleship.multiplayer.WebSockets.model.GameResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.battleship.multiplayer.WebSockets.model.Game;
import com.battleship.multiplayer.WebSockets.model.GamePlay;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import com.battleship.multiplayer.WebSockets.service.GameService;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody ConnectRequest request) {
        log.info("start game request: {}", request);
        Game game = gameService.createGame(request);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request) throws InvalidParameterException, InvalidGameException {
        log.info("connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameID()));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<GameResponse> connectRandom(@RequestBody ConnectRequest request) throws NotFoundException {
        log.info("connect random: {}", request);
        return ResponseEntity.ok(gameService.connectToRandomGame(request));
    }

    @PostMapping("/gameplay")
    public ResponseEntity<Game> gamePlay(@RequestBody GamePlay request) throws InvalidGameException, NotFoundException {
        log.info("gameplay: {}", request);
        Game game = gameService.gamePlay(request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress" + game.getGameID(), game);
        return ResponseEntity.ok(game);
    }
}
