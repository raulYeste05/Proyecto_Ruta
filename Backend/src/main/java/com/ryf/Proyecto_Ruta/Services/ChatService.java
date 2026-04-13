package com.ryf.Proyecto_Ruta.Services;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Repositories.ChatRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;

import com.ryf.Proyecto_Ruta.Model.Chat;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.DTO.ChatResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.ChatMapper;

import java.util.List;

import java.time.LocalDateTime;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMapper chatMapper;


    public ChatService(ChatRepository chatRepository,
                       UserRepository userRepository,
                       ChatMapper chatMapper) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.chatMapper = chatMapper;
    }

    //Crear o recuperar chat 
    public ChatResponseDTO crearChat(Integer user1Id, Integer user2Id) {

        if(user1Id.equals(user2Id)) {
            throw new RuntimeException("No puedes crear un chat contigo mismo");
        }

        //buscar en ambos lados

        Chat chat = chatRepository
                .findByUser1IdUserAndUser2IdUser(user1Id, user2Id)
                .or(() -> chatRepository.findByUser1IdUserAndUser2IdUser(user2Id, user1Id))
                .orElseGet(() -> {
                    User user1 = userRepository.findById(user1Id)
                            .orElseThrow(() -> new RuntimeException("Usuario1 no encontrado"));
                    User user2 = userRepository.findById(user2Id)
                            .orElseThrow(() -> new RuntimeException("Usuario2 no encontrado"));

                    Chat newChat = Chat.builder()
                            .user1(user1)
                            .user2(user2)
                            .fechaInicio(LocalDateTime.now())
                            .build();

                    return chatRepository.save(newChat);
                    });
            return chatMapper.toDTO(chat);
    }

    //Chats de un usuario
    public List<ChatResponseDTO> obtenerChatsUsuario(Integer userId) {
        return chatRepository.findByUser1IdUserOrUser2IdUser(userId, userId)
                .stream()
                .map(chatMapper::toDTO)
                .toList();
    }

    //
    public ChatResponseDTO obtenerChat(Integer id) {

                    Chat chat = chatRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

                return chatMapper.toDTO(chat);
    }


    public void eliminar(Integer id) {
        chatRepository.deleteById(id);
    }

    
}
