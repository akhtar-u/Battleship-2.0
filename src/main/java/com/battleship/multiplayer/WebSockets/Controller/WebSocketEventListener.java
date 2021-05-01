package com.battleship.multiplayer.WebSockets.Controller;


import com.battleship.multiplayer.WebSockets.model.Game;
import com.battleship.multiplayer.WebSockets.model.GameRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
@AllArgsConstructor
public class WebSocketEventListener {

    private static Map<String, String> sessionMap = new HashMap<>();
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final GameRepository gameRepository;

    @Autowired
    private final SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handleWebSocketConnectListener(final SessionConnectedEvent event) {
        LOGGER.info("PEEP PEEP. NEW CONNECTION!");
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        GenericMessage connectHeader = (GenericMessage) stompAccessor.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);    // FIXME find a way to pass the username to the server
        Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) connectHeader.getHeaders().get(SimpMessageHeaderAccessor.NATIVE_HEADERS);

        String gameID = nativeHeaders.get("gameID").get(0);
        String sessionID = event.getMessage().getHeaders().get("simpSessionId").toString();
        sessionMap.put(sessionID, gameID);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(final SessionDisconnectEvent event) {
        String gameID = sessionMap.get(event.getSessionId());

        ConnectRequest request = new ConnectRequest();
        request.setType("ERROR");

        sendingOperations.convertAndSend("/topic/game-progress" + gameID, request);
        sessionMap.remove(event.getSessionId());
    }
}
