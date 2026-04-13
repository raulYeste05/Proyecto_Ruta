package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.ChatResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Chat;
import org.springframework.stereotype.Component;

@Component
public class ChatMapper {

    public ChatResponseDTO toDTO(Chat chat) {
        ChatResponseDTO dto = new ChatResponseDTO();
        dto.setId(chat.getId());
        dto.setFechaInicio(chat.getFechaInicio());

        if (chat.getUser1() != null) {
            dto.setUser1Id(chat.getUser1().getIdUser());
            dto.setEmailUser1(chat.getUser1().getEmail());
        }

        if (chat.getUser2() != null) {
            dto.setUser2Id(chat.getUser2().getIdUser());
            dto.setEmailUser2(chat.getUser2().getEmail());
        }

        return dto;
    }
}
