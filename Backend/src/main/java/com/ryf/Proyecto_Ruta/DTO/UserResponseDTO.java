package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDTO {

    private Integer idUser;
    private String email;
    private Integer rolId;
    private String nombreRol;
    private LocalDateTime fechaRegistro;
}
