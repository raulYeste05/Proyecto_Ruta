package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PublicacionResponseDTO {

    private Integer id;
    private String titulo;
    private String contenido;
    private LocalDateTime fecha;

    private Integer userId;
    private String emailUsuario;

    private Integer rutaId;
    private String tituloRuta;
}
