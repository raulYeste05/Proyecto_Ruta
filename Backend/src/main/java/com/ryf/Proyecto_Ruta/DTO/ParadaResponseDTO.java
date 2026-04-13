package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParadaResponseDTO {

    private Integer id;
    private Integer rutaId;
    private Integer orden;
    private Double latitud;
    private Double longitud;
    private String tipoTransporte;
    private Integer tiempoEstimado;
    private Double distanciaEstimada;
}
