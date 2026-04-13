package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RutaResponseDTO {

    private Integer id;
    private String titulo;
    private String descripcion;
    private Boolean publicada;
    private LocalDateTime fechaCreacion;

    private Integer userId;
    private String emailUsuario;
}
