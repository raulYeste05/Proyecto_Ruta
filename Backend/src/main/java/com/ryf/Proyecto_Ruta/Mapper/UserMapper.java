package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.UserRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.UserResponseDTO;
import com.ryf.Proyecto_Ruta.Model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequestDTO dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        return user;
    }

    public UserResponseDTO toDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setIdUser(user.getIdUser());
        dto.setEmail(user.getEmail());
        
        if (user.getRol() != null) {
            dto.setRolId(user.getRol().getIdRol());
            dto.setNombreRol(user.getRol().getNombre());
        }

        return dto;
    }
}
