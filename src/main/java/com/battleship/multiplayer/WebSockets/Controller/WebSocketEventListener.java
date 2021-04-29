package com.battleship.multiplayer.WebSockets.Controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handleWebSocketConnectListener(final SessionConnectedEvent event) {
        LOGGER.info("PEEP PEEP. NEW CONNECTION!");
        LOGGER.info(event.getMessage().getHeaders().toString());
        final StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        headerAccessor.getSessionAttributes().put()

        LOGGER.info(event.getMessage().getHeaders().get("simpSessionId").toString());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(final SessionDisconnectEvent event) {
//        final StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        final Player player = (Player) headerAccessor.getSessionAttributes().get("player");
//        final String gameID = (String) headerAccessor.getSessionAttributes().get("gameID");
//
//        final ConnectRequest request = new ConnectRequest();
//        request.setGameID(gameID);
//        request.setPlayer(player);
//        request.setMsgType("ERROR");
//
//        sendingOperations.convertAndSend("/topic/game-progress" + gameID, request);
        LOGGER.info(event.toString());
    }
}
