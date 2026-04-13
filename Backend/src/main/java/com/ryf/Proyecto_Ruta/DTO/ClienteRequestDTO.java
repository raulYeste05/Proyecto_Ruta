package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter

public class ClienteRequestDTO {

    @NotBlank
    private String dni;

    private String password;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido1;

    private String apellido2;

    @NotBlank
    private String telefono;

    @NotBlank
    private String provincia;

    @NotBlank
    private String localidad;

    @NotNull
    private Integer userId;
}
