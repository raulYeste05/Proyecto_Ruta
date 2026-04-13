package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.ComentarioRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ComentarioResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Comentario;
import org.springframework.stereotype.Component;

@Component
public class ComentarioMapper {

    public Comentario toEntity(ComentarioRequestDTO dto) {
        Comentario comentario = new Comentario();
        comentario.setContenido(dto.getContenido());
        return comentario;
    }

    public ComentarioResponseDTO toDTO(Comentario comentario) {
        ComentarioResponseDTO dto = new ComentarioResponseDTO();
        dto.setId(comentario.getId());
        dto.setContenido(comentario.getContenido());
        dto.setFecha(comentario.getFecha());

        if (comentario.getPublicacion() != null) {
            dto.setPublicacionId(comentario.getPublicacion().getId());
        }

        if (comentario.getUser() != null) {
            dto.setUserId(comentario.getUser().getIdUser());
            dto.setEmailUsuario(comentario.getUser().getEmail());
        }

        return dto;
    }
}
