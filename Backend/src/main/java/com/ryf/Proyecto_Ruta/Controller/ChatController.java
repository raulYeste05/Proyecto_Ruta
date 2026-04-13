package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ryf.Proyecto_Ruta.Services.ChatService;
import com.ryf.Proyecto_Ruta.DTO.ChatResponseDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ryf.Proyecto_Ruta.DTO.ChatRequestDTO;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    //Crear chat
    @PostMapping
    public ResponseEntity<ChatResponseDTO> crear(
            @RequestBody ChatRequestDTO chatRequestDTO) {

        return ResponseEntity.ok(chatService.crearChat(chatRequestDTO.getUser1Id(), chatRequestDTO.getUser2Id()));
    }

    //Chats de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatResponseDTO>> obtenerChatsUsuario(@PathVariable Integer userId) {
        return ResponseEntity.ok(chatService.obtenerChatsUsuario(userId));
    }

    //Obtener un chat por su id
    @GetMapping("/{id}")
    public ResponseEntity<ChatResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(chatService.obtenerChat(id));
    }


    //Eliminar un chat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        chatService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
