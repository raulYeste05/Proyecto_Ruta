package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServicioCercanoResponseDTO {

    private Integer id;
    private Integer paradaId;
    private String tipo;
    private String nombre;
    private Double distancia;
}
