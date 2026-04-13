package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComentarioRequestDTO {

    @NotNull
    private Integer publicacionId;

    @NotNull
    private Integer userId;

    @NotBlank
    private String contenido;
}
