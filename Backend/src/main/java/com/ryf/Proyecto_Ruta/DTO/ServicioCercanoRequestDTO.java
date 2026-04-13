package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServicioCercanoRequestDTO {

    @NotNull
    private Integer paradaId;

    @NotNull
    private String tipo;

    private String nombre;
    private Double distancia;
}
