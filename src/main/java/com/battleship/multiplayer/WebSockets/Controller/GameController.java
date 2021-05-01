package com.battleship.multiplayer.WebSockets.Controller;

import com.battleship.multiplayer.WebSockets.exceptions.InvalidGameException;
import com.battleship.multiplayer.WebSockets.exceptions.InvalidParameterException;
import com.battleship.multiplayer.WebSockets.exceptions.NotFoundException;
import com.battleship.multiplayer.WebSockets.model.GamePlay;
import com.battleship.multiplayer.WebSockets.model.GameResponse;
import com.battleship.multiplayer.WebSockets.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<GameResponse> start(@RequestBody ConnectRequest request) {
        log.info("start game request: {}", request);
        return ResponseEntity.ok(gameService.createGame(request));
    }

    @PostMapping("/connect")
    public ResponseEntity<GameResponse> connect(@RequestBody ConnectRequest request) throws InvalidParameterException, InvalidGameException {
        log.info("connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<GameResponse> connectRandom(@RequestBody ConnectRequest request) throws NotFoundException {
        log.info("connect random: {}", request);
        return ResponseEntity.ok(gameService.connectToRandomGame(request));
    }

    @PostMapping("/gameover")
    public void deleteFinishedGame(@RequestBody ConnectRequest request) throws InvalidGameException {
        log.info("deleted finished game: {}", request);
        gameService.deleteFinishedGame(request.getGameID());
    }

    @PostMapping("/gameplay")
    public void gamePlay(@RequestBody GamePlay gamePlay) throws InvalidGameException, NotFoundException {
        log.info("gameplay: {}", gamePlay);
        simpMessagingTemplate.convertAndSend("/topic/game-progress" + gamePlay.getGameID() ,gameService.gamePlay(gamePlay));
    }
}
