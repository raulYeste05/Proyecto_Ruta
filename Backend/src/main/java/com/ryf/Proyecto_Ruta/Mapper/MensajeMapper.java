package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.MensajeResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Mensaje;
import org.springframework.stereotype.Component;

@Component
public class MensajeMapper {

    public MensajeResponseDTO toDTO(Mensaje mensaje) {
        MensajeResponseDTO dto = new MensajeResponseDTO();
        dto.setId(mensaje.getId());
        dto.setContenido(mensaje.getContenido());
        dto.setFecha(mensaje.getFecha());

        if (mensaje.getChat() != null) {
            dto.setChatId(mensaje.getChat().getId());
        }

        if (mensaje.getUser() != null) {
            dto.setUserId(mensaje.getUser().getIdUser());
            dto.setEmailUsuario(mensaje.getUser().getEmail());
        }

        return dto;
    }
}
