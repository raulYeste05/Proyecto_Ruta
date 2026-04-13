package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.RolRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.RolResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Rol;

import org.springframework.stereotype.Component;

@Component
public class RolMapper {

    public Rol toEntity(RolRequestDTO dto) {
        Rol rol = new Rol();
        rol.setNombre(dto.getNombre());
        return rol;
    }

    public RolResponseDTO toDTO(Rol rol) {
        RolResponseDTO dto = new RolResponseDTO();
        dto.setIdRol(rol.getIdRol());
        dto.setNombre(rol.getNombre());
        return dto;
    }
}
