package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParadaRequestDTO {

    @NotNull
    private Integer rutaId;

    @NotNull
    private Integer orden;

    @NotNull
    private Double latitud;

    @NotNull
    private Double longitud;

    @NotNull
    private String tipoTransporte;

    private Integer tiempoEstimado;
    private Double distanciaEstimada;
}