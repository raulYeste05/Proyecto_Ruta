package com.ryf.Proyecto_Ruta.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Repositories.MensajeRepository;
import com.ryf.Proyecto_Ruta.Repositories.ChatRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;

import com.ryf.Proyecto_Ruta.Model.Mensaje;
import com.ryf.Proyecto_Ruta.DTO.MensajeRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.MensajeResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.MensajeMapper;
import com.ryf.Proyecto_Ruta.Model.Chat;
import com.ryf.Proyecto_Ruta.Model.User;

import java.time.LocalDateTime;

@Service

public class MensajeService {

    private final MensajeRepository mensajeRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final MensajeMapper mensajeMapper;

    public MensajeService(MensajeRepository mensajeRepository,
                          ChatRepository chatRepository,
                          UserRepository userRepository,
                          MensajeMapper mensajeMapper) {
        this.mensajeRepository = mensajeRepository;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.mensajeMapper = mensajeMapper;
    }

    //Enviar mensaje

    public MensajeResponseDTO enviar(MensajeRequestDTO dto) {

    Chat chat = chatRepository.findById(dto.getChatId())
            .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

    User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    if (!chat.getUser1().getIdUser().equals(dto.getUserId()) &&
        !chat.getUser2().getIdUser().equals(dto.getUserId())) {

        throw new RuntimeException("No pertenece al chat");
    }

    Mensaje mensaje = Mensaje.builder()
            .chat(chat)
            .user(user)
            .contenido(dto.getContenido())
            .fecha(LocalDateTime.now())
            .build();

    return mensajeMapper.toDTO(mensajeRepository.save(mensaje));
}

    public List<MensajeResponseDTO> obtenerPorChat(Integer chatId) {
        return mensajeRepository.findByChatIdOrderByFechaAsc(chatId)
                .stream()
                .map(mensajeMapper::toDTO)
                .toList();
    }

    public MensajeResponseDTO obtenerPorId(Integer id) {
        return mensajeMapper.toDTO(
                mensajeRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"))
        );
    }

    public void eliminar(Integer id) {
        mensajeRepository.deleteById(id);
    }
    
}
