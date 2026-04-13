package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ComentarioResponseDTO {

    private Integer id;
    private String contenido;
    private LocalDateTime fecha;

    private Integer publicacionId;
    private Integer userId;
    private String emailUsuario;
}
