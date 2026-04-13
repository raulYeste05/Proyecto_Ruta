package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublicacionRequestDTO {

    @NotNull
    private Integer userId;

    private Integer rutaId;

    @NotBlank
    private String titulo;

    private String contenido;
}
