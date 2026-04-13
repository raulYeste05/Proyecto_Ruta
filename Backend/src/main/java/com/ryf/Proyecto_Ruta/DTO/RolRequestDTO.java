package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RolRequestDTO {

    @NotBlank
    private String nombre;
}
