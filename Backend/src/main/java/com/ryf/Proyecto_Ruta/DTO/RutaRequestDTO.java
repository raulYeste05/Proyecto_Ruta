package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RutaRequestDTO {

    @NotNull
    private Integer userId;

    @NotBlank
    private String titulo;

    private String descripcion;
    private Boolean publicada;
}
