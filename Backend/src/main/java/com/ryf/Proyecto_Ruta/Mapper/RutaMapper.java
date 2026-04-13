package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.RutaRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.RutaResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Ruta;
import org.springframework.stereotype.Component;

@Component
public class RutaMapper {

    public Ruta toEntity(RutaRequestDTO dto) {
        Ruta ruta = new Ruta();
        ruta.setTitulo(dto.getTitulo());
        ruta.setDescripcion(dto.getDescripcion());
        ruta.setPublicada(dto.getPublicada());
        return ruta;
    }

    public RutaResponseDTO toDTO(Ruta ruta) {
        RutaResponseDTO dto = new RutaResponseDTO();
        dto.setId(ruta.getId());
        dto.setTitulo(ruta.getTitulo());
        dto.setDescripcion(ruta.getDescripcion());
        dto.setPublicada(ruta.getPublicada());
        dto.setFechaCreacion(ruta.getFechaCreacion());

        if (ruta.getUser() != null) {
            dto.setUserId(ruta.getUser().getIdUser());
            dto.setEmailUsuario(ruta.getUser().getEmail());
        }

        return dto;
    }
}
