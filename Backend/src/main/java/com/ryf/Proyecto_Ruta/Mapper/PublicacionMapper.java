package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.PublicacionRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.PublicacionResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Publicacion;
import org.springframework.stereotype.Component;

@Component
public class PublicacionMapper {

    public Publicacion toEntity(PublicacionRequestDTO dto) {
        Publicacion publicacion = new Publicacion();
        publicacion.setTitulo(dto.getTitulo());
        publicacion.setContenido(dto.getContenido());
        return publicacion;
    }

    public PublicacionResponseDTO toDTO(Publicacion publicacion) {
        PublicacionResponseDTO dto = new PublicacionResponseDTO();
        dto.setId(publicacion.getId());
        dto.setTitulo(publicacion.getTitulo());
        dto.setContenido(publicacion.getContenido());
        dto.setFecha(publicacion.getFecha());

        if (publicacion.getUser() != null) {
            dto.setUserId(publicacion.getUser().getIdUser());
            dto.setEmailUsuario(publicacion.getUser().getEmail());
        }

        if (publicacion.getRuta() != null) {
            dto.setRutaId(publicacion.getRuta().getId());
            dto.setTituloRuta(publicacion.getRuta().getTitulo());
        }

        return dto;
    }
}
